// CloudFront Function (runtime: cloudfront-js-2.0), viewer-request event.
// S3 has no directory index behind CloudFront + OAC, so map clean URLs to the
// index.html files that `next build` emits with trailingSlash: true:
//   /             -> /index.html
//   /login/       -> /login/index.html
//   /login        -> /login/index.html
// Requests for real files (/_next/static/..., /e1.jpg, __next.*.txt) pass through.
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- invoked by CloudFront
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
  } else if (uri.split("/").pop().indexOf(".") === -1) {
    request.uri = uri + "/index.html";
  }

  return request;
}
