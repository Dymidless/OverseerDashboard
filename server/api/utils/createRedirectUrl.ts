import { createCallbackUrl } from "./createCallbackUrl.js";

export function createRedirectUrl(clientId: string) {
	const { public: _public } = useRuntimeConfig();
	const { baseURL } = _public;

	const scopes = ["identify", "guilds"];
	const encodedCallbackUrl = encodeURIComponent(createCallbackUrl(baseURL));
	const encodedScopes = encodeURIComponent(scopes.join(" "));

	const redirectUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&amp;response_type=code&amp;redirect_uri=${encodedCallbackUrl}&amp;scope=${encodedScopes}`;

	return redirectUrl as const;
}
