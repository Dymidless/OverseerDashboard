import type { DiscordUser, DiscordGuild } from "../../shared/types/auth.js";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";

export async function getUserData(accessToken: string): Promise<DiscordUser | null> {
	try {
		const response = await fetch(`${DISCORD_API_BASE_URL}/users/@me`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) return null;

		return (await response.json()) as DiscordUser;
	} catch {
		return null;
	}
}

export async function getUserGuilds(accessToken: string): Promise<DiscordGuild[] | null> {
	try {
		const response = await fetch(`${DISCORD_API_BASE_URL}/users/@me/guilds`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) return null;

		return (await response.json()) as DiscordGuild[];
	} catch {
		return null;
	}
}
