import { ResponseError } from "../interfaces/ResponseError.tsx";
import { getCookieToken } from "../cookie/Cookie.tsx";
import { DELETE_TOKEN, SET_TOKEN } from "../redux/Auth.tsx";
import { gql } from "@apollo/client";
import { client } from "../main.tsx";
import store from "../redux/ConfigureStore.tsx";
import { removeCookieToken } from "../cookie/Cookie.tsx";

const RENEW = gql`
    mutation Renew ($refreshToken: String!) {
        renew(refreshToken: $refreshToken)
    }
`;

export const handleGraphQLError = (err: ResponseError) => {

  const gqlError = err.graphQLErrors[0];
  const code = gqlError.extensions.http.code;
  // const status = gqlError.extensions.http.status;
  // const message  = gqlError.extensions.http.message;

  if (code === 'ACCESS_TOKEN_NOT_PROVIDED' || code === 'INVALID_ACCESS_TOKEN') {
    const refreshToken = getCookieToken();

    if (refreshToken) {
      client.mutate({
        mutation: RENEW,
        variables: {
          refreshToken: refreshToken,
        },
      }).then((res: any) => {
        if (res.data.renew) {
          const data =  JSON.parse(res.data.renew);
          const renewedToken = data.renewedToken;
          store.dispatch(SET_TOKEN(renewedToken));
          
          /* 우선 페이지 reload - 나중에 로직 수정 필요 */
          alert('로그인이 만료되었습니다.');
          window.location.reload;
        } else {
          store.dispatch(DELETE_TOKEN());
          removeCookieToken();
        }
      }).catch((error: any) => console.log('[ERROR] ', error));
    } else {
      store.dispatch(DELETE_TOKEN);
      removeCookieToken();
    }
  }

  if (code === 'MEMBER_ID_NULL') {
    alert('회원정보가 없습니다. 다시 로그인 해주세요.');
    store.dispatch(DELETE_TOKEN);
    removeCookieToken();
    location.href='/login'
  }
}