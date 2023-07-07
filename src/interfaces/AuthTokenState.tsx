export interface AuthTokenState {
    authenticated: boolean;
    accessToken: string | null;
    expirationTime: number | null;
}