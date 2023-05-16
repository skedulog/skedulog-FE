import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import * as types from "../types/member";


export default function MemberList() {
    const [memberList, setMemberList] = useState<types.member[] | null>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const client = new ApolloClient({
        uri: "http://localhost:4000/graphql",
        cache: new InMemoryCache(),
    });
    const getMemberList = () => {
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
        }).then((res) => res.data.allMembers)
        .then((members : types.member[]) => setMemberList(members))
        setLoading(false);
    }
    useEffect(() => {
        getMemberList();
    }, [])
console.log(memberList);
    return (
        <div>
            {loading ? <h1>Loading page...</h1> :
                <div>
                    {memberList === null? null : memberList.map((member: types.member) => {
                        return (
                            <ul key={member.id}>
                                <li>id: {member.id}</li>
                                <li>username: {member.username}</li>
                                <li>password: {member.password}</li>
                                <li>fullName: {member.fullName}</li>
                            </ul>
                        );
                    })}
                </div>
            }
        </div>);
}