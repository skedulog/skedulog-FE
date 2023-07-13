import { useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import PageTitle from "../../components/pagetitle/PageTitle";
import styles from "./PasswordCheck.module.scss";
import { Button, Form, Input } from "antd";
import { Member } from "../../interfaces/Member";
import { hashPassword } from "../../crypto/Crypto";
import { getUsername } from "../../cookie/Cookie";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const PASSWORD_CHECK = gql`
    mutation PasswordCheck($password: String!) {
        passwordCheck(password: $password)
    }
`;

const PassWordCheck: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('회원정보');
    })
    
    const [form] = useForm();
    const navigate = useNavigate();
    const [ passwordCheck, { data } ] = useMutation(PASSWORD_CHECK);

    useEffect(() => {
        if (data) {
            data.passwordCheck === true ? navigate('/member/me') : alert("비밀번호를 확인하여 주세요.")
        }
    }, [data])

    const handleFinish = (data: Member) => {
        const password = data.password;
        passwordCheck({ variables: { password: hashPassword(getUsername(), password ?? '') } })
    }

    const handleFinishFailed = (error: any) => {
        console.log('[ERROR]', error);
    }

    return (
        <div className={styles.password_check_form_container}>
            <PageTitle title="회원정보" />
            <div className={styles.password_check_form}>
                <Form 
                    form={form} 
                    name="passwordCheckForm"
                    requiredMark={false}
                    layout="vertical"
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                >
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "비밀번호는 필수입력 항목입니다."
                            }
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            placeholder="비밀번호를 입력하여 주세요."
                            type="password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" size="large" htmlType="submit">인증</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default PassWordCheck;