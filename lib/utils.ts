export { cn } from "cn"

const ghsFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
})

export function formatPrice(amount: number) {
  return ghsFormatter.format(amount)
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GH", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatDate(iso: string) {
  return dateTimeFormatter.format(new Date(iso))
}
