/** Serialize polls while coalescing overlapping refresh requests. */
export class RefreshPollQueue {
	private inProgress = false;
	private queued = false;

	/** Start a poll or record a pending refresh when one is already active. */
	public request(): boolean {
		if (this.inProgress) {
			this.queued = true;
			return false;
		}
		this.inProgress = true;
		return true;
	}

	/** Whether a refresh request is waiting for the active poll. */
	public get hasQueuedRefresh(): boolean {
		return this.queued;
	}

	/** Clear a queued request after it has been handled or shutdown begins. */
	public clearQueuedRefresh(): void {
		this.queued = false;
	}

	/**
	 * Release the poll and immediately start any request queued during finalization.
	 *
	 * @param stopping Whether adapter shutdown prevents new polls.
	 * @param runQueuedRefresh Starts the queued poll.
	 * @param onIdle Runs after the final poll when no follow-up is waiting.
	 */
	public finish(stopping: boolean, runQueuedRefresh: () => void, onIdle: () => void): void {
		this.inProgress = false;
		if (stopping) {
			return;
		}
		if (this.queued) {
			this.queued = false;
			runQueuedRefresh();
			return;
		}
		onIdle();
	}
}
