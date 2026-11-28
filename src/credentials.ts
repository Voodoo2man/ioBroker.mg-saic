/** Login values supplied by a central ioBroker credential. */
export interface AccountLoginCredential {
	/** iSmart email address or phone number. */
	accountIdentifier: string;
	/** Password from the central credential store. */
	password: string;
}

interface CredentialInfo {
	type: string;
	values: unknown;
}

/**
 * Extracts the login and password from an ioBroker custom Login/Password credential.
 *
 * @param credential Credential returned by ioBroker's credential API.
 * @param getCredentialForm Resolves the form type for custom credentials.
 */
export function getLoginPasswordCredential(
	credential: CredentialInfo,
	getCredentialForm: (values: Record<string, unknown>) => string,
): AccountLoginCredential {
	if (credential.type !== 'custom' || !credential.values || typeof credential.values !== 'object') {
		throw new Error('A custom Login/Password credential is required');
	}
	const values = credential.values as Record<string, unknown>;
	if (
		getCredentialForm(values) !== 'login' ||
		typeof values.login !== 'string' ||
		!values.login.trim() ||
		typeof values.password !== 'string' ||
		!values.password
	) {
		throw new Error('The selected credential must contain a login and password');
	}
	return { accountIdentifier: values.login.trim(), password: values.password };
}

/**
 * Clears deprecated native login fields only after their empty values are persisted.
 *
 * @param config The adapter's native instance configuration.
 * @param updateConfig Persists the cleared legacy values.
 * @returns Whether the legacy values are cleared or already absent.
 */
export async function clearDeprecatedNativeCredentials(
	config: Record<string, unknown>,
	updateConfig: (changes: { accountIdentifier: string; password: string }) => Promise<unknown>,
): Promise<boolean> {
	if (!config.accountIdentifier && !config.password) {
		return true;
	}
	try {
		await updateConfig({ accountIdentifier: '', password: '' });
		config.accountIdentifier = '';
		config.password = '';
		return true;
	} catch {
		return false;
	}
}
