import { expect } from 'chai';
import { RefreshPollQueue } from './refresh-poll-queue';

describe('RefreshPollQueue', () => {
	it('runs a refresh queued during finalization after the poll releases without overlap', async () => {
		const queue = new RefreshPollQueue();
		expect(queue.request()).to.equal(true);
		let resolveFinalStateWrite!: () => void;
		const finalStateWrite = new Promise<void>(resolve => {
			resolveFinalStateWrite = resolve;
		});
		let activePolls = 1;
		let maximumActivePolls = activePolls;
		let followUpPolls = 0;
		const firstPoll = (async () => {
			await finalStateWrite;
			activePolls--;
			queue.finish(false, () => {
				expect(activePolls).to.equal(0);
				expect(queue.request()).to.equal(true);
				activePolls++;
				maximumActivePolls = Math.max(maximumActivePolls, activePolls);
				followUpPolls++;
			});
		})();

		expect(queue.request()).to.equal(false);
		resolveFinalStateWrite();
		await firstPoll;

		expect(followUpPolls).to.equal(1);
		expect(maximumActivePolls).to.equal(1);
		expect(queue.hasQueuedRefresh).to.equal(false);
	});
});
