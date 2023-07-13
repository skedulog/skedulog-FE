import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Member } from "../../interfaces/Member";
import { useForm } from "antd/es/form/Form";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { useApolloClient } from "@apollo/client";
import { removeCookieToken } from "../../cookie/Cookie";
import { DELETE_TOKEN } from "../../redux/Auth";
import styles from "./MemberUpdate.module.scss"
import dayjs from "dayjs";
import PageTitle from "../../components/pagetitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hashPassword } from "../../crypto/Crypto";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const GET_MEMBER = gql`
    query Member {
        member {
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

const UPDATE_MEMBER = gql`
    mutation UpdateMember($id: Int!, $password: String, $fullName: String, $gender: String, $dateOfBirth: Date) {
        updateMember(id: $id, password: $password, fullName: $fullName, gender: $gender, dateOfBirth: $dateOfBirth) {
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

const DELETE_MEMBER = gql`
    mutation DeleteMember {
        deleteMember
    }
`;

const MemberUpdate: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('회원정보');
    })
    
    const [form] = useForm();
    const [member, setMember] = useState<Member>();
    const client = useApolloClient();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const worker = {
        ...member,
        dateOfBirth: dayjs(member?.dateOfBirth),
        password: '********',
        confirmPassword: '********'
    };

    const { data:getMemberData, loading: getMemberLoading } = useQuery(GET_MEMBER);
    const [updateMember, { data: updateMemberData }] = useMutation(UPDATE_MEMBER);
    const [deleteMember, { data: deleteMemberData }] = useMutation(DELETE_MEMBER);

    useEffect(() => {
        if (getMemberData) {
            setMember(getMemberData.member);
        }
    }, [getMemberData])

    useEffect(() => {
        if (updateMemberData) {
            setMember(updateMemberData.updateMember);
        }
    }, [updateMemberData])

    useEffect(() => {
        if (deleteMemberData) {
            if (deleteMemberData.deleteMember === true) {
                dispatch(DELETE_TOKEN());
                removeCookieToken();
                client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'member' })
                client.cache.gc();
                navigate('/');
            } else {
                alert("알 수 없는 오류가 발생 하였습니다.");
            }
        }
    }, [deleteMemberData])

    const validatePassword = (_: object, password: string) => {

        if (!password) {
            form.setFieldValue('password', '********')
            return Promise.resolve();
        }

        if (password?.length < 8 || password?.length > 20) {
            return Promise.reject(new Error('비밀번호는는 8자 이상 20자 이하여야 합니다.'))
        }

        const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (password !== '********') {
            if (!regExp.test(password)) {
                return Promise.reject(new Error('비밀번호는 영어, 숫자, 특수문자를 모두 포함하여야 합니다.'))
            }
        }

        return Promise.resolve();
    }

    const validateConfirmPassword = (_: object, confirmPassword: string) => {

        if (confirmPassword === '') {
            form.setFieldValue('confirmPassword', '********');
            confirmPassword = form.getFieldValue('confirmPassword');
        }

        const password = form.getFieldValue('password');
        if (confirmPassword !== password) {
            return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'))
        }
        return Promise.resolve();
    }

    const handleUpdateMember = (data: Member) => {

        if (!data.username || !data.password) {
            throw new Error('username and password cannot be null');
        }

        const dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');
        const hashedPassword = hashPassword(data.username ?? '', data.password ?? '');

        if (data.fullName === member?.fullName 
            && data.gender === member?.gender 
            && dateOfBirth === String(member?.dateOfBirth) 
            && (data.password === '********' || hashedPassword === member?.password)) {
                alert("수정사항을 입력하여 주세요.");
                return false;
        }

        if (window.confirm("회원 정보를 수정하시겠습니까?") && member) {
            const variables: Member = {id: member.id};
            if (data.fullName !== member.fullName) variables.fullName = data.fullName;
            if (data.gender !== member.gender) variables.gender = data.gender;
            if (dateOfBirth !== String(member.dateOfBirth)) variables.dateOfBirth = data.dateOfBirth;
            if (data.password !== '********' && hashedPassword !== member.password) variables.password = hashedPassword;
            updateMember({variables: variables});
            client.cache.evict({ id: `Member:${member.id}` });
        }
    }

    const handleUpdateMemberFailed = (error: any) => {
        console.log('[ERROR]', error);
    }

    const handleDelete = () => {
        if (window.confirm("탈퇴 하시겠습니까?")) {
            deleteMember();
        }
    }

    return (
        <>
            {getMemberLoading || !member ? <></> : (
                <div className={styles.member_update_form_container}>
                    <PageTitle title="회원정보" />
                    <div className={styles.member_update_form}>
                        <Form 
                            requiredMark={false} 
                            form={form} 
                            name="memberUpdateForm" 
                            layout="vertical" 
                            initialValues={worker} 
                            onFinish={handleUpdateMember} 
                            onFinishFailed={handleUpdateMemberFailed}
                        >
                            <Form.Item 
                                name="fullName" 
                                label="이름" 
                                rules={[
                                    {
                                        required: true,
                                        message: "이름은 필수입력 항목입니다."
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input 
                                    placeholder="이름을 입력하여 주세요." 
                                    maxLength={10} 
                                />
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label="성별"
                                rules={[
                                    { 
                                        required: true, 
                                        message: '성별은 필수입력 항목입니다.' 
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Select
                                    placeholder="성별을 선택하여 주세요."
                                    options={[
                                        {value: "MALE", label: "남성"},
                                        {value: "FEMALE", label: "여성"},
                                        {value: "OTHER", label: "선택안함"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="dateOfBirth" 
                                label="생년월일" 
                                rules={[
                                    {
                                        type: 'object' as const, 
                                        required: true, 
                                        message: '생년월일은 필수입력 항목입니다.'
                                    }
                                ]}
                            >
                                <DatePicker 
                                    placeholder="생년월일을 선택하여 주세요." 
                                    className={styles.date_picker}
                                />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                label="아이디"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Input
                                    readOnly
                                />
                            </Form.Item>
                            <Form.Item 
                                name="password" 
                                label="비밀번호" 
                                rules={[
                                    {
                                        validator: validatePassword,
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input
                                    type="password"
                                    placeholder="비밀번호를 입력하여 주세요" 
                                    maxLength={20}
                                    onClick={() => {
                                        const password = form.getFieldValue('password');
                                        if (password === '********') {
                                            form.setFieldValue('password', '');
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="confirmPassword" 
                                label="비밀번호 확인" 
                                rules={[
                                    {
                                        validator: validateConfirmPassword,
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input
                                    type="password"
                                    placeholder="비밀번호 확인을 입력하여 주세요" 
                                    maxLength={20}
                                    onClick={() => {
                                        const confirmPassword = form.getFieldValue('confirmPassword');
                                        if (confirmPassword === '********') {
                                            form.setFieldValue('confirmPassword', '');
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button block size="large" type="primary" htmlType="submit">회원정보 수정</Button> 
                                <Button block danger size="large" type="primary" onClick={handleDelete}>회원 탈퇴</Button> 
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
}

export default MemberUpdate;