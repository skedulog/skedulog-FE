import crypto from "crypto-js";

export const hashPassword = (username: string, password: string) => {
    const algo = crypto.algo.SHA256.create();
    algo.update(password);
    algo.update(crypto.SHA256(username));
    algo.update(crypto.SHA256(import.meta.env.VITE_CRYPTO_SECRET_KEY));

    return algo.finalize().toString(crypto.enc.Base64);
}