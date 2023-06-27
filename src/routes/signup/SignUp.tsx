import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Member } from "../../interfaces/Member";
import ButtonLink from "../../components/common/ButtonLink";

const CREATE_MEMBER = gql`
    mutation Mutation($createMemberUsername: String!, $createMemberPassword: String!, $createMemberFullName: String!) {
        createMember(username: $createMemberUsername, password: $createMemberPassword, fullName: $createMemberFullName) {
            id
            username
            password
            fullName
        }
    }
`;

export default function SignUp() {

    const [member, setMember] = useState<Member>({
        id: 0,
        username: "",
        password: "",
        fullName: ""
    });

    const [createMember, { data }] = useMutation(CREATE_MEMBER);

    useEffect(() => {
        if (data !== undefined) {
            location.href="/member/"+data.createMember.id;
        }
    }, [data]);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMember((current) => {
            return {...current, fullName: event.target.value}
        });
    }

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMember((current) => {
            return {...current, username: event.target.value}
        });
    }

    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMember((current) => {
            return {...current, password: event.target.value}
        });
    }

    const confirmCreateMember = () => {
        if (window.confirm("회원 가입을 진행 하시겠습니까?")) {
            createMember({variables: { createMemberUsername: member.username, createMemberPassword: member.password, createMemberFullName: member.fullName }});
        }
    }
    
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>이름</th>
                        <td><input type="text" value={member.fullName} onChange={onNameChange} /></td>
                    </tr>
                    <tr>
                        <th>아이디</th>
                        <td><input type="text" value={member.username} onChange={onUsernameChange} /></td>
                    </tr>
                    <tr>
                        <th>비밀번호</th>
                        <td><input type="password" value={member.password} onChange={onPasswordChange} /></td>
                    </tr>
                </tbody>
            </table>
            <button onClick={confirmCreateMember}>완료</button>
            <ButtonLink link="/member/list" text="뒤로" />
        </div>
    );
}