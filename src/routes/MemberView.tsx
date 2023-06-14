import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Member } from "../interfaces/Member";
import { useParams } from "react-router-dom";
import ButtonLink from "../components/ButtonLink";
import MemberDetails from "../components/MemberDetails";

const GET_MEMBER = gql`
query Member($memberId: Int!) {
    member(id: $memberId) {
      id
      username
      password
      fullName
      createdAt
      updatedAt
    }
  }
`;

const DELETE_MEMBER = gql`
mutation DeleteMember($deleteMemberId: Int!) {
    deleteMember(id: $deleteMemberId)
  }
`;

export default function MemberView() {
    const { id } = useParams();
    const [member, setMember] = useState<Member>();

    const { data: getMemberData, loading: getMemberLoading } = useQuery(GET_MEMBER, {
        variables: { memberId: Number(id)}
    });

    useEffect(() => {
        if (getMemberData !== undefined) {
            setMember(getMemberData.member);
        }
    }, [getMemberData]);

    const [deleteMember, { data: deleteMemberData }] = useMutation(DELETE_MEMBER);

    const confirmDeleteMember = () => {
        if (window.confirm("회원을 삭제하시겠습니까?")) {
            deleteMember({variables: {deleteMemberId: member?.id}})
        }
    }

    useEffect(() => {
        if (deleteMemberData !== undefined ) {
            deleteMemberData.deleteMember ? location.href="/member/list" : alert("회원 삭제에 실패하였습니다.");
        }
    }, [deleteMemberData])

    if (getMemberLoading || member === undefined) {
        return <></>;
    }

    return (
        <div>
            <MemberDetails
                id={member.id}
                username={member.username}
                password={member.password}
                fullName={member.fullName}
                createdAt={member.createdAt}
                updatedAt={member.updatedAt}
            />
            <ButtonLink link={"/member/update/"+member.id} text="수정" />
            <ButtonLink link="/member/list" text="뒤로" />
            <button onClick={confirmDeleteMember}>삭제</button>
        </div>
    );
}