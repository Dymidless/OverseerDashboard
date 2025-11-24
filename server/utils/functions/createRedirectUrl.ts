export function createRedirectUrl(clientId: string) {
	const scopes = ["identify", "guilds"];
	const encodedCallbackUrl = encodeURIComponent(createCallbackUrl());
	const encodedScopes = encodeURIComponent(scopes.join(" "));

	const redirectUrl =
		`https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedCallbackUrl}&scope=${encodedScopes}` as const;

	return redirectUrl;
}
