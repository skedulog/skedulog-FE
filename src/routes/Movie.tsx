import { useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function Movie() {

    const client = new ApolloClient({
        uri: "http://localhost:4000/graphql",
        cache: new InMemoryCache(),
    });
    const getMovie = () => {
        client.query({
            query: gql`
                query AllMembers {
                    allMembers {
                        id
                        username
                        password
                        fullName
                    }
                }
            `
        }).then((data) => console.log(data))
    }
    useEffect(() => {
        getMovie();
    }, [])

    return <h1>Page to be deleted</h1>;
}