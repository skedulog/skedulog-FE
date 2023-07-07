import { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { Member } from "../../interfaces/Member";
import ButtonLink from "../../components/common/ButtonLink";
import MemberDetails from "../../components/member/MemberDetails";

const GET_ALL_MEMBERS = gql`
    query AllMembers {
        allMembers {
            id
            username
            password
            fullName
            gender
            dateOfBirth
            createdAt
            updatedAt
        }
    }
`;

export default function MemberList() {

    const [memberList, setMemberList] = useState<Member[] | null>([]);

    const { data, loading } = useQuery(GET_ALL_MEMBERS);

    useEffect(() => {
        if (!loading) {
            setMemberList(data.allMembers);
        }
    }, [data, loading])

    return (
        <div>
            {loading ? <></> :
                <div>
                    {memberList === null ? null : memberList.map((member: Member, index: number) => {
                        return (
                            <MemberDetails 
                                key={index}
                                id={member.id}
                                username={member.username}
                                password={member.password}
                                fullName={member.fullName}
                                gender={member.gender}
                                dateOfBirth={member.dateOfBirth}
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