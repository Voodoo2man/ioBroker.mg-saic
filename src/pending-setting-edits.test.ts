import { expect } from 'chai';
import { parsePendingSettingEdits, serializePendingSettingEdits } from './pending-setting-edits';

describe('pending setting edit persistence', () => {
	const validStateIds = new Set(['vehicles.VIN.commands.charging.chargeTargetSoc']);

	it('round-trips valid pending setting IDs and ignores unknown or malformed data', () => {
		const serialized = serializePendingSettingEdits([...validStateIds]);
		expect(parsePendingSettingEdits(serialized, validStateIds)).to.deep.equal([...validStateIds]);
		expect(
			parsePendingSettingEdits(
				JSON.stringify(['vehicles.other.commands.charging.chargeTargetSoc', ...validStateIds]),
				validStateIds,
			),
		).to.deep.equal([...validStateIds]);
		expect(parsePendingSettingEdits('{invalid', validStateIds)).to.deep.equal([]);
	});
});
