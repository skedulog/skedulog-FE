import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Member } from "../../interfaces/Member";
import ButtonLink from "../../components/common/ButtonLink";


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

const UPDATE_MEMBER = gql`
    mutation UpdateMember($updateMemberId: Int!, $password: String, $fullName: String) {
        updateMember(id: $updateMemberId, password: $password, fullName: $fullName) {
            id
            username
            password
            fullName
            createdAt
            updatedAt
        }
    }  
`;

export default function MemberUpdate() {
    const { id } = useParams();
    const [member, setMember] = useState<Member>();
    const [updatedMember, setUpdatedMember] = useState<Member>({
        id: 0,
        username: "",
        password: "",
        fullName: ""
    });

    const { data:getMemberData, loading: getMemberLoading } = useQuery(GET_MEMBER, {
        variables: {memberId: Number(id)}
    });

    const [updateMember, { data: updateMemberData }] = useMutation(UPDATE_MEMBER);

    useEffect(() => {
        if (getMemberData !== undefined) {
            setMember(getMemberData.member);
            setUpdatedMember(getMemberData.member);
        }
    }, [getMemberData])

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedMember((current) => {
            return {...current, fullName: event.target.value}
        });
    }

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedMember((current) => {
            return {...current, username: event.target.value}
        });
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedMember((current) => {
            return {...current, password: event.target.value}
        });
    }

    useEffect(() => {
        if (updateMemberData !== undefined) {
            location.href = "/member/"+updateMemberData.updateMember.id;
        }
    }, [updateMemberData])

    const confirmupdateMember = () => {
        if (updatedMember === member) {
            alert("수정사항을 입력하여 주세요.");
            return false;
        }
        if (window.confirm("회원 정보를 수정하시겠습니까?") && member !== undefined) {
            updateMember({variables:{updateMemberId: updatedMember.id, password: updatedMember.password, fullName: updatedMember.fullName}});
        }
    }


    if (getMemberLoading || member === undefined) {
        return <></>;
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" value={updatedMember.fullName} onChange={onNameChange} /></td>
                    </tr>
                    <tr>
                        <th>아이디</th>
                        <td><input readOnly disabled type="text" value={updatedMember.username} onChange={onUsernameChange} /></td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td><input type="password" value={updatedMember.password} onChange={onPasswordChange} /></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={confirmupdateMember}>완료</button>
            <ButtonLink link={"/member/"+member.id} text="뒤로" />
        </div>
    );
}