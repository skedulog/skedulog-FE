import { useSelector } from 'react-redux';
import { RootState } from "../interfaces/RootState";
import { getCookieToken } from "../cookie/Cookie";
import useRenewToken from "./useRenewToken";

export default function useCheckToken() {

    const { authenticated, expirationTime } = useSelector((state:RootState) => state.authToken);
    const { renewToken } = useRenewToken();
    const refreshToken = getCookieToken();

    const checkAuth = async() => {
        if (refreshToken) {
            if (!authenticated || ((authenticated && expirationTime) && new Date().getTime() >= expirationTime)) {
                renewToken();
            }
        }
    }

    return { checkAuth };
}