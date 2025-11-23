export function createCallbackUrl(baseUrl: string) {
	return `${baseUrl}/api/auth/callback` as const;
}
