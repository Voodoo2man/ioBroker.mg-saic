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
 * Move a legacy Objects-tree value into private adapter storage before removing it.
 * IDs are kept unfiltered here because the current vehicle list may not be available yet.
 *
 * @param savedFileValue Previously persisted file content.
 * @param legacyState Legacy state metadata.
 * @param legacyState.exists Whether the legacy object exists.
 * @param legacyState.value Legacy state value.
 * @param writeFile Persist the merged value to private adapter storage.
 * @param deleteLegacyState Remove the legacy object after persistence succeeds.
 */
export async function migrateLegacyPendingSettingEdits(
	savedFileValue: unknown,
	legacyState: { exists: boolean; value: unknown },
	writeFile: (serialized: string) => Promise<void>,
	deleteLegacyState: () => Promise<void>,
): Promise<void> {
	if (!legacyState.exists) {
		return;
	}
	const stateIds = new Set([
		...parsePersistedPendingSettingEditIds(savedFileValue),
		...parsePersistedPendingSettingEditIds(legacyState.value),
	]);
	await writeFile(serializePendingSettingEdits(stateIds));
	await deleteLegacyState();
}

function parsePersistedPendingSettingEditIds(value: unknown): string[] {
	if (typeof value !== 'string') {
		return [];
	}
	try {
		const parsed: unknown = JSON.parse(value);
		return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string'))] : [];
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
