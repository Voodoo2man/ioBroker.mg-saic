/**
 * Parse persisted setting IDs and keep only IDs valid for the current vehicles.
 *
 * @param value Persisted JSON value.
 * @param validStateIds Setting IDs available in the current adapter instance.
 */
export function parsePendingSettingEdits(value: unknown, validStateIds: ReadonlySet<string>): string[] {
	if (typeof value !== 'string') {
		return [];
	}
	try {
		const parsed: unknown = JSON.parse(value);
		if (!Array.isArray(parsed)) {
			return [];
		}
		return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && validStateIds.has(id)))];
	} catch {
		return [];
	}
}

/**
 * Serialize pending setting IDs for persistent storage.
 *
 * @param stateIds Pending setting state IDs.
 */
export function serializePendingSettingEdits(stateIds: Iterable<string>): string {
	return JSON.stringify([...stateIds]);
}
