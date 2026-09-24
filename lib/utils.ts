export { cn } from "cn"

const ghsFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
})

export function formatPrice(amount: number) {
  return ghsFormatter.format(amount)
}
