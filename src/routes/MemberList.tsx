import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Member } from "../interfaces/Member";
import ButtonLink from "../components/ButtonLink";
import MemberDetails from "../components/MemberDetails";

const GET_ALL_MEMBERS = gql`
query AllMembers {
    allMembers {
        id
        username
        password
        fullName
        createdAt
        updatedAt
    }
}
`

export default function MemberList() {
    const [memberList, setMemberList] = useState<Member[] | null>([]);

    const { data, loading } = useQuery(GET_ALL_MEMBERS);

    useEffect(() => {
        if (!loading) {
            setMemberList(data.allMembers);
        }
    }, [data])

    console.log(memberList, memberList===null, memberList===undefined)

    return (
        <div>
            {loading ? <></> :
                <div>
                    {memberList === null? null : memberList.map((member: Member) => {
                        return (
                            <MemberDetails 
                                id={member.id}
                                username={member.username}
                                password={member.password}
                                fullName={member.fullName}
                                createdAt={member.createdAt}
                                updatedAt={member.updatedAt}
                            />
                        );
                    })}
                </div>
            }
            <ButtonLink text="회원가입" link="/signup" />
        </div>
    );
}