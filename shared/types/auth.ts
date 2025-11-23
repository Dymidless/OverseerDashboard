export interface DiscordUser {
	id: string;
	username: string;
	discriminator: string;
	global_name: string | null;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	mfa_enabled?: boolean;
	banner?: string | null;
	accent_color?: number | null;
	locale?: string;
	verified?: boolean;
	email?: string | null;
	flags?: number;
	premium_type?: number;
	public_flags?: number;
	avatar_decoration_data?: {
		asset: string;
		sku_id: string;
	} | null;
}

export interface DiscordGuild {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: string;
	features: string[];
}

export interface UserSession {
	user: DiscordUser;
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
	expiresAt: number;
}
