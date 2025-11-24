export interface Session {
	user: SessionUser;
	access_token: string;
	refresh_token: string;
	expires_at: number;
}

export interface SessionUser {
	global_name: string | null;
	id: string;
	username: string;
}
