import { VendorCatalogue } from "@/components/shared/VendorCatalogue"

export default async function VendorCataloguePage(
  props: PageProps<"/storefront/vendors/[vendorId]">
) {
  const { vendorId } = await props.params
  return <VendorCatalogue vendorId={vendorId} />
}
