// app/storefront/page.tsx
import { redirect } from "next/navigation";

export default function StorefrontIndexPage() {
  redirect("/storefront/vendors");
}
