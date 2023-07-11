import { PageInformation } from "../../interfaces/PageInformation";
import { Typography } from "antd";
import styles from "./PageTitle.module.scss";

const PageTitle: React.FC<PageInformation> = ({ title }) => {

    const { Title } = Typography;

    return (
        <div className={styles.page_title_container}>
            <Title level={2}>{title}</Title>
        </div>
    )
}

export default PageTitle;