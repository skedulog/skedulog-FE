import { gql, useMutation } from "@apollo/client";
import { useDispatch } from 'react-redux';
import { getCookieToken, removeCookieToken } from "../cookie/Cookie";
import { useEffect } from "react";
import { DELETE_TOKEN, SET_TOKEN } from "../redux/Auth";

const RENEW = gql`
    mutation Renew ($refreshToken: String!) {
        renew(refreshToken: $refreshToken)
    }
`;

export default function useRenewToken() {

    const [renew, { data }] = useMutation(RENEW);
    const refreshToken = getCookieToken();
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            const response = JSON.parse(data.renew);
            if (response.ok) {
                dispatch(SET_TOKEN(response.renewedToken));
            } else {
                dispatch(DELETE_TOKEN());
                removeCookieToken();
            }
        }
    }, [data])
    
    const renewToken = () => {
        renew({ variables: { refreshToken: refreshToken } })
    };

    return { renewToken };
}