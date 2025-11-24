export function createRedirectUrl() {
	const scopes = ["identify", "guilds"];

	const encodedCallbackUrl = encodeURIComponent(createCallbackUrl());
	const encodedScopes = encodeURIComponent(scopes.join(" "));

	const redirectUrl =
		`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodedCallbackUrl}&scope=${encodedScopes}` as const;

	return redirectUrl;
}
