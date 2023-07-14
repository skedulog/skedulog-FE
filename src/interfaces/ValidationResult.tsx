export interface ValidationResult {
    ok: boolean;
    error: {
        name: string;
        code: string;
        message: string;
    }
}