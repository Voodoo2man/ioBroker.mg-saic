import { expect } from 'chai';
import { clearDeprecatedNativeCredentials, getLoginPasswordCredential } from './credentials';

describe('getLoginPasswordCredential', () => {
	const getCredentialForm = (values: Record<string, unknown>): string => (values.key !== undefined ? 'key' : 'login');

	it('reads the login and password from a custom Login/Password credential', () => {
		expect(
			getLoginPasswordCredential(
				{ type: 'custom', values: { login: ' driver@example.com ', password: 'secret' } },
				getCredentialForm,
			),
		).to.deep.equal({ accountIdentifier: 'driver@example.com', password: 'secret' });
	});

	it('rejects credentials that are not a complete Login/Password form', () => {
		for (const credential of [
			{ type: 'system', values: { login: 'driver@example.com', password: 'secret' } },
			{ type: 'custom', values: { key: 'secret' } },
			{ type: 'custom', values: { login: 'driver@example.com', password: '' } },
		]) {
			expect(() => getLoginPasswordCredential(credential, getCredentialForm)).to.throw();
		}
	});
});

describe('clearDeprecatedNativeCredentials', () => {
	it('persists empty legacy values before clearing them in memory', async () => {
		const config = { accountIdentifier: 'legacy@example.com', password: 'legacy-password' };
		let persisted: { accountIdentifier: string; password: string } | undefined;

		const result = await clearDeprecatedNativeCredentials(config, changes => {
			persisted = changes;
			return Promise.resolve();
		});

		expect(result).to.equal(true);
		expect(persisted).to.deep.equal({ accountIdentifier: '', password: '' });
		expect(config).to.deep.equal({ accountIdentifier: '', password: '' });
	});

	it('keeps the existing values and reports failure when persistence fails', async () => {
		const config = { accountIdentifier: 'legacy@example.com', password: 'legacy-password' };
		const result = await clearDeprecatedNativeCredentials(config, () => Promise.reject(new Error('write failed')));

		expect(result).to.equal(false);
		expect(config).to.deep.equal({ accountIdentifier: 'legacy@example.com', password: 'legacy-password' });
	});
});
