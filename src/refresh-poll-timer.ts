/** Manages a single cancellable one-shot timeout for periodic refreshes. */
export class RefreshPollTimer<TTimeout> {
	private timeout: TTimeout | undefined;
	private generation = 0;

	/**
	 * Create a timer using the adapter's lifecycle-managed timeout functions.
	 *
	 * @param setTimeout Schedules a one-shot callback and returns its handle.
	 * @param clearTimeout Cancels a scheduled callback.
	 */
	public constructor(
		private readonly setTimeout: (callback: () => void, milliseconds: number) => TTimeout | undefined,
		private readonly clearTimeout: (timeout: TTimeout | undefined) => void,
	) {}

	/**
	 * Replace the pending timeout with a new one-shot callback.
	 *
	 * @param callback Runs after the delay unless canceled.
	 * @param milliseconds Delay before the callback runs.
	 */
	public schedule(callback: () => void, milliseconds: number): void {
		this.clear();
		const generation = this.generation;
		this.timeout = this.setTimeout(() => {
			if (generation !== this.generation) {
				return;
			}
			this.timeout = undefined;
			callback();
		}, milliseconds);
	}

	/** Cancel the timeout and invalidate callbacks already dispatched by the runtime. */
	public clear(): void {
		this.generation++;
		this.clearTimeout(this.timeout);
		this.timeout = undefined;
	}
}
