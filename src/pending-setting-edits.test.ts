import { expect } from 'chai';
import {
	migrateLegacyPendingSettingEdits,
	parsePendingSettingEdits,
	serializePendingSettingEdits,
} from './pending-setting-edits';

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

	it('migrates legacy IDs to private storage before deleting the legacy object', async () => {
		const events: string[] = [];
		let migratedValue = '';
		await migrateLegacyPendingSettingEdits(
			JSON.stringify(['vehicles.VIN.commands.charging.chargeTargetSoc']),
			{
				exists: true,
				value: JSON.stringify([
					'vehicles.VIN.commands.charging.chargeTargetSoc',
					'vehicles.VIN.commands.charging.chargingCurrentLimit',
					'unknown.setting',
				]),
			},
			value =>
				Promise.resolve().then(() => {
					events.push('write');
					migratedValue = value;
				}),
			() =>
				Promise.resolve().then(() => {
					events.push('delete');
				}),
		);

		expect(events).to.deep.equal(['write', 'delete']);
		expect(JSON.parse(migratedValue)).to.deep.equal([
			'vehicles.VIN.commands.charging.chargeTargetSoc',
			'vehicles.VIN.commands.charging.chargingCurrentLimit',
			'unknown.setting',
		]);
		expect(parsePendingSettingEdits(migratedValue, validStateIds)).to.deep.equal([...validStateIds]);
	});

	it('keeps the legacy object when private-file persistence fails', async () => {
		let legacyDeleted = false;
		let migrationError: unknown;
		try {
			await migrateLegacyPendingSettingEdits(
				undefined,
				{ exists: true, value: JSON.stringify([...validStateIds]) },
				() => Promise.reject(new Error('file write failed')),
				() =>
					Promise.resolve().then(() => {
						legacyDeleted = true;
					}),
			);
		} catch (error) {
			migrationError = error;
		}
		expect(migrationError).to.be.instanceOf(Error);
		expect((migrationError as Error).message).to.equal('file write failed');
		expect(legacyDeleted).to.equal(false);
	});
});
