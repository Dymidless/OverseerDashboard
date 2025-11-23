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
