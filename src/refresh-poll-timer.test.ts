import { expect } from 'chai';
import { RefreshPollTimer } from './refresh-poll-timer';

type FakeTimeout = {
	callback: () => void;
	milliseconds: number;
	cleared: boolean;
};

describe('RefreshPollTimer', () => {
	it('keeps only one timeout and ignores a cleared timeout callback', () => {
		const timeouts: FakeTimeout[] = [];
		const timer = new RefreshPollTimer<FakeTimeout>(
			(callback, milliseconds) => {
				const timeout = { callback, milliseconds, cleared: false };
				timeouts.push(timeout);
				return timeout;
			},
			timeout => {
				if (timeout) {
					timeout.cleared = true;
				}
			},
		);
		let refreshes = 0;

		timer.schedule(() => refreshes++, 1_000);
		timer.schedule(() => refreshes++, 2_000);

		expect(timeouts).to.have.length(2);
		expect(timeouts[0].cleared).to.equal(true);
		expect(timeouts[1].milliseconds).to.equal(2_000);
		timeouts[0].callback();
		expect(refreshes).to.equal(0);
		timeouts[1].callback();
		expect(refreshes).to.equal(1);
	});

	it('cancels the pending timeout on manual refresh or unload', () => {
		const timeouts: FakeTimeout[] = [];
		const timer = new RefreshPollTimer<FakeTimeout>(
			(callback, milliseconds) => {
				const timeout = { callback, milliseconds, cleared: false };
				timeouts.push(timeout);
				return timeout;
			},
			timeout => {
				if (timeout) {
					timeout.cleared = true;
				}
			},
		);
		let refreshes = 0;

		timer.schedule(() => refreshes++, 1_000);
		timer.clear();
		timer.schedule(() => refreshes++, 1_000);
		timer.clear();
		timeouts.forEach(timeout => timeout.callback());

		expect(timeouts.every(timeout => timeout.cleared)).to.equal(true);
		expect(refreshes).to.equal(0);
	});
});
