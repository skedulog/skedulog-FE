import styles from './LogIn.module.scss'
import { LogIn as LogInType } from '../../interfaces/LogIn';
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, Space, Typography } from "antd"
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { setRefreshToken } from "../../cookie/Cookie";
import { SET_TOKEN } from "../../redux/Auth";
import PageTitle from '../../components/pagetitle/PageTitle';

const LOG_IN = gql`
    mutation LogIn(
        $username: String!, 
        $password: String!
        ) {
        login(
            username: $username, 
            password: $password
        )
    }
`;

const LogIn: React.FC = () => {

    const [failed, setFailed] = useState<boolean>(false);
    const [logIn, { data }] = useMutation(LOG_IN);
    const [form] = useForm();
    const { Text } = Typography;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const response = JSON.parse(data.login);
            if (response.ok) {
                setFailed(false);
                setRefreshToken(response.tokens.refreshToken);
                dispatch(SET_TOKEN(response.tokens.accessToken));
                navigate('/');
            } else {
                setFailed(true);
            }
        }
    }, [data])

    const handleFinish = (data: LogInType) => {
        logIn({ variables: { username: data.username, password: data.password }});
    }

    const handleFinishFailed = (error: any) => {
        console.log('[ERROR]' + error);
    }

    return (
        <div className={styles.log_in_form_container}>
            <PageTitle title='로그인' />
            <div className={styles.log_in_form}>
                <Form form={form} name="logInForm" layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
                    <Form.Item
                        name="username" 
                        label="아이디" 
                        rules={[
                            {
                                required: true,
                                message: "아이디를 입력하여 주세요."
                            }
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input 
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password" 
                        label="비밀번호" 
                        rules={[
                            {
                                required: true,
                                message: "비밀번호를 입력하여 주세요."
                            }
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input
                            type='password'
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block size='large' type='primary' htmlType='submit'>로그인</Button>
                    </Form.Item>
                </Form>
                {failed ? (
                        <div className={styles.login_fail_notice}>
                            <Space direction='vertical'>
                                <Text>아이디 또는 비밀번호를 잘못 입력했습니다.</Text>
                                <Text>입력하신 내용을 다시 확인해주세요.</Text>
                            </Space>
                        </div>
                    ) : <></>
                }
            </div>
        </div>
    )
}

export default LogIn;