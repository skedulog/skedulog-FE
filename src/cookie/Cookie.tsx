import { Cookies } from 'react-cookie';


const cookies = new Cookies();

export const setRefreshToken = (refreshToken: string) => {
    const today = new Date();
    const expirationDate = today.setDate(today.getDate() + 180);

    return cookies.set('refresh_token', refreshToken, { 
        sameSite: 'strict', 
        path: "/", 
        expires: new Date(expirationDate)
    });
};

export const getCookieToken = () => {
    return cookies.get('refresh_token');
};

export const removeCookieToken = () => {
    return cookies.remove('refresh_token', { sameSite: 'strict', path: "/" })
}