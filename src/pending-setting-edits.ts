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

export function serializePendingSettingEdits(stateIds: Iterable<string>): string {
	return JSON.stringify([...stateIds]);
}
