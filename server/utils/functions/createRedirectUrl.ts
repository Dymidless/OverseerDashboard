import { OAuth2Scopes } from "discord-api-types/v10";

export function createRedirectUrl() {
	const scopes = [OAuth2Scopes.Identify, OAuth2Scopes.Guilds];

	const callbackUrl = createCallbackUrl();
	const scopesString = scopes.join("+");

	const redirectUrl =
		`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${callbackUrl}&scope=${scopesString}` as const;

	return redirectUrl;
}
