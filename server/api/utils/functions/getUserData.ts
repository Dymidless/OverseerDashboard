import type { APIUser, RESTGetAPIUserResult } from "discord-api-types/v10";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export async function getUserData(accessToken: string): Promise<RESTGetAPIUserResult | null> {
	try {
		const response = await fetch(`${DISCORD_API_BASE_URL}/users/@me`, {
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});
		const { ok } = response;

		if (!ok) return null;

		return (await response.json()) as APIUser;
	} catch {
		return null;
	}
}
