import { useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, Select, DatePicker } from "antd"
import { Member } from "../../interfaces/Member";
import styles from "./SignUp.module.scss"
import { useNavigate } from "react-router";
import PageTitle from "../../components/pagetitle/PageTitle"
import { hashPassword } from '../../crypto/Crypto';
import useDocumentTitle from "../../hooks/useDocumentTitle";

const SIGN_UP = gql`
    mutation SignUp(
        $createMemberUsername: String!,
        $createMemberPassword: String!,
        $createMemberFullName: String!,
        $createMemberGender: String!,
        $createMemberDateOfBirth: Date!
    ) {
        createMember(
            username: $createMemberUsername, 
            password: $createMemberPassword, 
            fullName: $createMemberFullName,
            gender: $createMemberGender,
            dateOfBirth: $createMemberDateOfBirth
        ) {
            id
            username
            password
            fullName
            gender
            dateOfBirth
        }
    }
`;

const CHECK_USERNAME_DUPLICACY = gql`
    mutation CheckUsernameDuplicacy(
        $username: String!
    ) {
        checkUsernameDuplicacy(
            username: $username
        )
    }
`;

const SignUp: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('회원가입');
    })

    const [createMember, { data }] = useMutation(SIGN_UP);
    const [checkUsernameDuplicacy] = useMutation(CHECK_USERNAME_DUPLICACY);

    const [form] = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (data !== undefined) {
            navigate('/login');
        }
    }, [data]);

    const validateUsername = async (_: object, username: string) => {
        if (username?.length < 6 || username?.length > 20) {
            return Promise.reject(new Error('아이디는 6자 이상 20자 이하여야 합니다.'));
        }

        if (username) {        
            const { data } = await checkUsernameDuplicacy({ variables: { username } });

            if (data?.checkUsernameDuplicacy) {
                return Promise.reject(new Error('중복된 아이디 입니다.'));
            }
        }

        return Promise.resolve();
    }

    const validatePassword = (_: object, password: string) => {
        if (password?.length < 8 || password?.length > 20) {
            return Promise.reject(new Error('비밀번호는는 8자 이상 20자 이하여야 합니다.'));
        }
        return Promise.resolve();
    }

    const validateConfirmPassword = (_: object, confirmPassword: string) => {
        const password = form.getFieldValue('password');
        if (confirmPassword !== password) {
            return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
        }
        return Promise.resolve();
    }

    const handleCreateMember = (data: Member) => {
        if (window.confirm("회원 가입을 진행 하시겠습니까?")) {
            createMember({
                variables: { 
                    createMemberUsername: data.username, 
                    createMemberPassword: hashPassword(data.username ?? '', data.password ?? ''), 
                    createMemberFullName: data.fullName,
                    createMemberGender: data.gender,
                    createMemberDateOfBirth: data.dateOfBirth
                }
            });
        }
    }

    const handleFinishFailed = (error: any) => {
        console.log('[ERROR]', error);
    }
    
    return (
        <div className={styles.sign_up_form_container}>
            <PageTitle title="회원가입" />
            <div className={styles.sign_up_form}>
                <Form form={form} name="signUpForm" layout="vertical" onFinish={handleCreateMember} onFinishFailed={handleFinishFailed}>
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
                                required: true,
                                message: "아이디는 필수입력 항목입니다."
                            },
                            {
                                pattern: /^[A-Za-z0-9]+$/,
                                message: '아이디는 영어 대소문자와 숫자로만 이루어져야 합니다.'
                            },
                            {
                                validator: validateUsername,
                            },
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input 
                            placeholder="아이디를 입력하여 주세요" 
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="비밀번호" 
                        rules={[
                            {
                                required: true,
                                message: "비밀번호는 필수입력 항목입니다."
                            },
                            {
                                pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                                message: '비밀번호는 영어, 숫자, 특수문자를 모두 포함하여야 합니다.'
                            },
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
                        />
                    </Form.Item>
                    <Form.Item 
                        name="confirmPassword" 
                        label="비밀번호 확인" 
                        rules={[
                            {
                                required: true,
                                message: "비밀번호 확인은 필수입력 항목입니다."
                            },
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
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block size="large" type="primary" htmlType="submit">회원가입</Button> 
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default SignUp;