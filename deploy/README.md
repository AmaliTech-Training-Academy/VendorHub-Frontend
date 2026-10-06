# Deploying the frontend (S3 + CloudFront)

The app builds as a static export (`output: "export"` in `next.config.ts`) into
`out/`, which is served from a private S3 bucket through CloudFront. The same
distribution proxies `/api/*` to the backend (deployed separately on Elastic
Beanstalk), so the browser talks to one HTTPS origin for both:

```
browser ──HTTPS──▶ CloudFront ─┬─ /api/*  ──HTTP──▶ Elastic Beanstalk (Django)
                               └─ default ─────────▶ S3 (static export, via OAC)
```

Static export can't use anything that needs a Node server: middleware/proxy,
server actions, route handlers that read the request, `cookies()`/`headers()`,
or dynamic route segments without `generateStaticParams`. That's why the vendor
catalogue lives at `/storefront/vendors/catalogue?id=<vendorId>`.

## One-time AWS setup

Do this once per environment, in the AWS console (us-east-1 or your team's region).

1. **S3 bucket**: create a bucket (e.g. `vendorhub-frontend-prod`). Keep
   *Block all public access* **on**. No static website hosting is needed.
2. **CloudFront Function**: CloudFront → Functions → Create function
   `vendorhub-index-rewrite`, runtime `cloudfront-js-2.0`. Paste
   [`cloudfront-function.js`](./cloudfront-function.js), then **Publish**.
3. **Distribution**: CloudFront → Create distribution:
   - Origin: the S3 bucket (the REST endpoint, not the website endpoint).
     Origin access: **Origin access control (OAC)**. Create a new OAC, then
     apply the bucket policy CloudFront offers to copy.
   - Viewer protocol policy: **Redirect HTTP to HTTPS**.
   - Cache policy: `CachingOptimized`. Origin request policy: none.
     The `?id=` query string is read in the browser, so it doesn't need to
     reach S3.
   - Function associations → Viewer request → CloudFront Function →
     `vendorhub-index-rewrite`.
   - Default root object: `index.html`.
4. **Error pages**: Distribution → Error pages → Create custom error
   response, for both **403** and **404**: response page `/404/index.html`,
   HTTP response code **404**. S3 returns 403 for missing keys under OAC.
5. **Backend origin**: Distribution → Origins → Create origin. Origin
   domain: the Elastic Beanstalk environment host (e.g.
   `vendorhub-staging.eu-west-1.elasticbeanstalk.com`), protocol
   **HTTP only**, port 80.
6. **API behavior**: Distribution → Behaviors → Create behavior:
   - Path pattern `/api/*`, origin: the backend origin.
   - Viewer protocol policy: **HTTPS only**.
   - Allowed methods: **GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE**.
   - Cache policy: **CachingDisabled**. Origin request policy:
     **AllViewerExceptHostHeader** (forwards `Authorization` and query
     strings; Django sees the Beanstalk host, which `ALLOWED_HOSTS` accepts).
   - **No** function association. The index rewrite would turn
     `/api/vendors` into `/api/vendors/index.html`.

   Check it with `curl -i https://<distribution>.cloudfront.net/api/vendors/`:
   a JSON 401 means requests reach Django.
7. **Custom domain** (optional): request an ACM certificate in **us-east-1**,
   add it plus the alternate domain name to the distribution, and point DNS
   at the distribution.

## Why the API goes through CloudFront

The Beanstalk environment only serves HTTP, and browsers block an HTTPS page
from calling an `http://` API (mixed content). Proxying `/api/*` through the
frontend's distribution gives the API an HTTPS URL, and because the frontend
and API now share an origin, no CORS settings are needed on the backend.

**Limitation:** the CloudFront → Beanstalk hop is still plain HTTP over the
internet, so credentials and tokens are unencrypted on that leg. That's
acceptable for staging only. Before production, give the backend real HTTPS
(load-balanced Beanstalk environment + ACM certificate on a custom domain;
ACM can't issue for `elasticbeanstalk.com`) and switch the origin's protocol
to **HTTPS only**.

## Automatic deploys (GitHub Actions)

| Event | Preflight (lint, typecheck, tests) | Deploy |
| --- | --- | --- |
| Pull request (any branch) | ✅ | — |
| Push to `develop` | ✅ | — |
| Push to `main` | ✅ (as part of Deploy) | ✅ if Preflight passes |

[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) runs on every
push to `main`: it calls [`preflight.yml`](../.github/workflows/preflight.yml)
on that commit, then runs `deploy.sh` only if Preflight passed. To release,
open a PR from `develop` into `main` and merge it. It can also be started by
hand from the Actions tab (on `main` only; the `production` environment rejects
other branches). It authenticates to AWS with OIDC, so no AWS keys are stored
in GitHub.

One-time setup:

1. **AWS IAM → Identity providers**: add an OpenID Connect provider with
   URL `https://token.actions.githubusercontent.com` and audience
   `sts.amazonaws.com` (skip if the account already has it).
2. **AWS IAM → Roles**: create `vendorhub-frontend-deploy` with this trust
   policy, which only lets this repo's `production` environment assume it:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
       "Action": "sts:AssumeRoleWithWebIdentity",
       "Condition": {
         "StringEquals": {
           "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
           "token.actions.githubusercontent.com:sub": "repo:AmaliTech-Training-Academy@104000470/VendorHub-Frontend@1326590141:environment:production"
         }
       }
     }]
   }
   ```

   This repo uses GitHub's **immutable subject claims**, so `sub` carries the
   org and repo IDs (`name@id`), not just their names. A recreated repo with
   the same name gets a new ID and can't assume the role. The plain
   `repo:AmaliTech-Training-Academy/VendorHub-Frontend:environment:production`
   form never matches and fails with *Not authorized to perform
   sts:AssumeRoleWithWebIdentity*. To get the exact prefix (no auth needed for
   a public repo):

   ```bash
   curl -s https://api.github.com/repos/AmaliTech-Training-Academy/VendorHub-Frontend/actions/oidc/customization/sub
   ```

   then append `:environment:production` to `sub_claim_prefix`.

   and this permissions policy:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       { "Effect": "Allow", "Action": "s3:ListBucket",
         "Resource": "arn:aws:s3:::<BUCKET>" },
       { "Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::<BUCKET>/*" },
       { "Effect": "Allow", "Action": "cloudfront:CreateInvalidation",
         "Resource": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>" }
     ]
   }
   ```

3. **GitHub → Settings → Environments**: create `production`, limit its
   deployment branches to `main`, and add these environment **variables**
   (none are secret, and the API URL ships in the public JS anyway):

   | Variable | Example |
   | --- | --- |
   | `AWS_ROLE_ARN` | `arn:aws:iam::<ACCOUNT_ID>:role/vendorhub-frontend-deploy` |
   | `AWS_REGION` | the bucket's region, e.g. `eu-west-1` |
   | `S3_BUCKET` | `vendorhub-frontend-prod` |
   | `CLOUDFRONT_DISTRIBUTION_ID` | `E123EXAMPLE` |
   | `NEXT_PUBLIC_API_URL` | `https://<distribution>.cloudfront.net/api` |

Until these exist, the workflow fails at *Configure AWS credentials*.

If it fails there with *Not authorized to perform
sts:AssumeRoleWithWebIdentity*, the trust policy doesn't match the token.
Check the `sub` format above first. Expanding the step's first line in the job
log shows the `role-to-assume` and `aws-region` it used. CloudTrail may not
record these failed attempts, so don't rely on it to find the mismatch.

## Deploying manually

Needs the AWS CLI v2 with credentials that can `s3:PutObject`,
`s3:DeleteObject` and `s3:ListBucket` on the bucket, plus
`cloudfront:CreateInvalidation` on the distribution.

```bash
NEXT_PUBLIC_API_URL=https://<distribution>.cloudfront.net/api \
S3_BUCKET=vendorhub-frontend-prod \
CLOUDFRONT_DISTRIBUTION_ID=E123EXAMPLE \
bash deploy/deploy.sh
```

`NEXT_PUBLIC_API_URL` is inlined into the JavaScript during the build, so
changing the backend URL means rebuilding and redeploying.

## Checking a build locally

```bash
NEXT_PUBLIC_API_URL=https://<distribution>.cloudfront.net/api npm run build
npx serve out
```

`serve` doesn't apply the CloudFront rewrite, but it resolves `/login/` to
`login/index.html` the same way.
