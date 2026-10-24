import { expect } from 'chai';
import { isRefreshCommand, normalizeStateChangeId } from './refresh-command';

describe('isRefreshCommand', () => {
	const namespace = 'mg-saic.0';

	it('accepts only the unacknowledged true state on this adapter instance', () => {
		expect(
			isRefreshCommand(`${namespace}.commands.refresh`, namespace, { val: true, ack: false } as ioBroker.State),
		).to.equal(true);
		expect(
			isRefreshCommand('mg-saic.1.commands.refresh', namespace, { val: true, ack: false } as ioBroker.State),
		).to.equal(false);
		expect(
			isRefreshCommand(`${namespace}.commands.refresh`, namespace, { val: true, ack: true } as ioBroker.State),
		).to.equal(false);
		expect(
			isRefreshCommand(`${namespace}.commands.refresh`, namespace, { val: false, ack: false } as ioBroker.State),
		).to.equal(false);
		expect(isRefreshCommand(`${namespace}.commands.refresh`, namespace, null)).to.equal(false);
	});
});

describe('normalizeStateChangeId', () => {
	it('normalizes local IDs and preserves fully qualified IDs', () => {
		expect(normalizeStateChangeId('vehicles.VIN.commands.charging.chargeTargetSoc', 'mg-saic.0')).to.equal(
			'mg-saic.0.vehicles.VIN.commands.charging.chargeTargetSoc',
		);
		expect(
			normalizeStateChangeId('mg-saic.0.vehicles.VIN.commands.charging.chargeTargetSoc', 'mg-saic.0'),
		).to.equal('mg-saic.0.vehicles.VIN.commands.charging.chargeTargetSoc');
	});
});
