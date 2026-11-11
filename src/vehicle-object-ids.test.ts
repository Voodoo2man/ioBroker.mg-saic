import { expect } from 'chai';
import { indexExistingVehicleObjectIds, resolveVehicleObjectId } from './vehicle-object-ids';

describe('vehicle object IDs', () => {
	it('reuses existing IDs across VIN casing changes', () => {
		const objectIds = indexExistingVehicleObjectIds(['vehicles.VIN123', 'vehicles.OTHER456.status']);

		expect(resolveVehicleObjectId(objectIds, 'vin123')).to.equal('VIN123');
		expect(resolveVehicleObjectId(objectIds, 'NEW789')).to.equal('NEW789');
	});

	it('selects the same existing ID regardless of VIN casing when variants exist', () => {
		const objectIds = indexExistingVehicleObjectIds(['vehicles.vin123', 'vehicles.VIN123']);

		expect(resolveVehicleObjectId(objectIds, 'VIN123')).to.equal('VIN123');
		expect(resolveVehicleObjectId(objectIds, 'vin123')).to.equal('VIN123');
	});
});
