/**
 * Index existing vehicle device IDs without regard to VIN casing.
 *
 * @param objectIds Existing instance-relative object IDs.
 */
export function indexExistingVehicleObjectIds(objectIds: Iterable<string>): Map<string, string[]> {
	const result = new Map<string, string[]>();
	for (const objectId of objectIds) {
		const match = /^vehicles\.([A-Za-z0-9_-]{1,64})$/.exec(objectId);
		if (!match) {
			continue;
		}
		const key = match[1].toLowerCase();
		const existing = result.get(key) ?? [];
		if (!existing.includes(match[1])) {
			existing.push(match[1]);
			existing.sort();
			result.set(key, existing);
		}
	}
	return result;
}

/**
 * Resolve an API VIN to its existing vehicle device ID, preserving old IDs.
 *
 * @param vehicleObjectIds Case-insensitive map of known VINs to object ID segments.
 * @param vin VIN returned by the API.
 */
export function resolveVehicleObjectId(vehicleObjectIds: Map<string, string[]>, vin: string): string {
	const existingIds = vehicleObjectIds.get(vin.toLowerCase());
	return existingIds?.[0] ?? vin;
}
