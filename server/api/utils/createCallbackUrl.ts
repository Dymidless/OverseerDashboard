export function createCallbackUrl(baseURL: string) {
	return `${baseURL}/api/auth/callback` as const;
}
