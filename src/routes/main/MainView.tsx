import { Space, Typography, Button } from "antd";
import { useState } from "react";
import logo from "../../images/skedulog_no_bg_underline.png"
import styles from "../../styles/routes/main/MainView.module.scss";
import { Link } from "react-router-dom";

export default function MainView() {

    const { Title, Text } = Typography;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <div className={styles.main_container}>
            <div className={styles.main_content}>
                <div className={styles.main_logo}>
                    <img src={logo} />
                </div>
                <div className={styles.main_text}>
                    <Title level={1}>스케줄을 효율적으로 관리하세요!</Title>
                    <Space direction="vertical">
                        <Text type="secondary" className={styles.bullet_points}>일별 일정 관리</Text>
                        <Text type="secondary" className={styles.bullet_points}>친구들과 일정 공유</Text>
                        <Text type="secondary" className={styles.bullet_points}>키워드로 스케줄 관리</Text>
                        <Text type="secondary" className={styles.bullet_points}>키워드별 통계</Text>
                        <Text type="secondary" className={styles.bullet_points}>인기 키워드 및 연관 키워드</Text>
                    </Space>
                </div>
                <div className={styles.main_button}>
                    <Button size="large" className={hovered ? styles.hovered_button : ""} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}><Link to="/signup">회원가입</Link></Button>
                </div>
            </div>
        </div>
    )
}