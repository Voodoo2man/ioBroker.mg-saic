import { expect } from 'chai';
import { MAX_POLL_INTERVAL_SECONDS, validateConfig } from './config';
import { calculateInitializationRetryDelayMs } from './main';
import { isIndiaRegion, resolveSaicRegion } from './regions';

describe('validateConfig', () => {
	const validEmailConfig = {
		region: 'EU',
		accountType: 'email',
		accountIdentifier: 'driver@example.com',
		password: 'secret',
	};

	it('accepts a complete email account configuration', () => {
		expect(validateConfig(validEmailConfig)).to.deep.equal([]);
	});

	it('accepts polling intervals within the supported timer range', () => {
		expect(validateConfig({ ...validEmailConfig, pollIntervalSeconds: 60 })).to.deep.equal([]);
		expect(validateConfig({ ...validEmailConfig, pollIntervalSeconds: MAX_POLL_INTERVAL_SECONDS })).to.deep.equal(
			[],
		);
		for (const pollIntervalSeconds of [0, 1, 10, 59, MAX_POLL_INTERVAL_SECONDS + 1]) {
			expect(validateConfig({ ...validEmailConfig, pollIntervalSeconds })).to.include(
				`Polling interval must be an integer between 60 and ${MAX_POLL_INTERVAL_SECONDS} seconds`,
			);
		}
		expect(validateConfig({ ...validEmailConfig, pollIntervalSeconds: 1.5 })).to.include(
			`Polling interval must be an integer between 60 and ${MAX_POLL_INTERVAL_SECONDS} seconds`,
		);
	});

	it('requires a country calling code for phone accounts', () => {
		expect(validateConfig({ ...validEmailConfig, accountType: 'phone', phoneCountryCode: '' })).to.include(
			'Phone country calling code is required',
		);
	});

	it('reports missing required account fields', () => {
		expect(validateConfig({})).to.deep.equal([
			'Region/backend code is required',
			'Login type must be email or phone',
			'Email address or phone number is required',
			'Password is required',
		]);
	});

	it('resolves supported global regions to their API routes', () => {
		expect(resolveSaicRegion('EU')).to.deep.equal({
			baseUrl: 'https://gateway-mg-eu.soimt.com/api.app/v1/',
			regionCode: 'eu',
			tenantId: '459771',
		});
		expect(resolveSaicRegion('Rest of World')?.regionCode).to.equal('eu');
		expect(resolveSaicRegion('India')).to.equal(undefined);
	});

	it('rejects India TAP and unknown regions before cloud login', () => {
		expect(validateConfig({ ...validEmailConfig, region: 'India' })).to.include(
			'India TAP connectivity is not implemented yet',
		);
		expect(validateConfig({ ...validEmailConfig, region: 'Unknown' })).to.include('Unsupported SAIC region');
		expect(isIndiaRegion(' india ')).to.equal(true);
	});

	it('keeps retrying with a longer bounded backoff after repeated initialization failures', () => {
		expect(calculateInitializationRetryDelayMs(1)).to.equal(60_000);
		expect(calculateInitializationRetryDelayMs(2)).to.equal(120_000);
		expect(calculateInitializationRetryDelayMs(3)).to.equal(180_000);
		expect(calculateInitializationRetryDelayMs(4)).to.equal(300_000);
		expect(calculateInitializationRetryDelayMs(10)).to.equal(300_000);
	});
});
