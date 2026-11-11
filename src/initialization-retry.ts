const INITIALIZATION_RETRY_DELAY_MS = 60_000;
const MAX_INITIALIZATION_RETRY_DELAY_MS = 5 * INITIALIZATION_RETRY_DELAY_MS;

/**
 * Returns the bounded delay before retrying initialization.
 *
 * @param retryCount Number of initialization failures.
 * @returns Retry delay in milliseconds.
 */
export function calculateInitializationRetryDelayMs(retryCount: number): number {
	const attempts = Math.max(1, retryCount);
	if (attempts <= 3) {
		return INITIALIZATION_RETRY_DELAY_MS * attempts;
	}
	return MAX_INITIALIZATION_RETRY_DELAY_MS;
}
