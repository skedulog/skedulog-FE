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
    return cookies.remove('refresh_token', { sameSite: 'strict', path: "/" });
}

export const setUsername = (username: string) => {
    return cookies.set('username', username, {
        sameSite: 'strict',
        path: '/'
    });
}

export const getUsername = () => {
    return cookies.get('username');
}

export const removeUsername = () => {
    return cookies.remove('username', { sameSite: 'strict', path: '/' });
}