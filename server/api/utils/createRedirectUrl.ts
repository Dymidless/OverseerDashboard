import { createCallbackUrl } from "./createCallbackUrl.js";

export function createRedirectUrl(clientId: string) {
	const { public: _public } = useRuntimeConfig();
	const { baseURL } = _public;

	const scopes = ["identify", "guilds"];

	const encodedCallbackUrl = encodeURIComponent(createCallbackUrl(baseURL));
	const encodedScopes = encodeURIComponent(scopes.join(" "));

	return `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodedCallbackUrl}&scope=${encodedScopes}` as const;
}
