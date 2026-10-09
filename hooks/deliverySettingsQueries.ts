export function deliverySettingsQueryKey(vendorId: string | null) {
  return ["deliverySettings", vendorId] as const;
}
