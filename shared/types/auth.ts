import type { APIUser } from "discord-api-types/v10";

export interface Session {
	user: APIUser;
	access_token: string;
	refresh_token: string;
	expires_at: number;
}
