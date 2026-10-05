export function deliverySettingsQueryKey(vendorId: string) {
  return ["deliverySettings", vendorId] as const;
}
