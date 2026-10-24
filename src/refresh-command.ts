/**
 * Return whether an event requests a refresh on this adapter instance.
 *
 * @param id Fully qualified state ID from ioBroker.
 * @param namespace Adapter instance namespace.
 * @param state State value supplied by ioBroker.
 */
export function isRefreshCommand(id: string, namespace: string, state: ioBroker.State | null | undefined): boolean {
	return (
		normalizeStateChangeId(id, namespace) === `${namespace}.commands.refresh` &&
		state !== null &&
		state !== undefined &&
		!state.ack &&
		state.val === true
	);
}

/**
 * Convert a local state ID to the fully qualified adapter-instance ID.
 *
 * @param id Local or fully qualified state ID.
 * @param namespace Adapter instance namespace.
 */
export function normalizeStateChangeId(id: string, namespace: string): string {
	return id.startsWith(`${namespace}.`) ? id : `${namespace}.${id}`;
}
