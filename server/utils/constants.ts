import { createHash } from "node:crypto";

const { clientId, clientSecret, clientToken, encryptionKey, jwtSecret, public: _public } = useRuntimeConfig();
const { baseUrl } = _public;

export const BASE_URL = baseUrl;

export const CLIENT_ID = clientId;
export const CLIENT_SECRET = clientSecret;
export const CLIENT_TOKEN = clientToken;

export const DISCORD_API_BASE_URL = "https://discord.com/api/v10" as const;

export const ENCRYPTION_ALGORITHM = "aes-256-gcm";
export const ENCRYPTION_HASH = createHash("sha256");
export const ENCRYPTION_IV_LENGTH = 12;
export const ENCRYPTION_KEY = ENCRYPTION_HASH.update(encryptionKey).digest();
export const ENCRYPTION_TAG_LENGTH = 16;

export const JWT_ENCODER = new TextEncoder();
export const JWT_SECRET = JWT_ENCODER.encode(jwtSecret);
