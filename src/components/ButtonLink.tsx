import { Link } from "react-router-dom";

interface buttonProps {
    text?: string,
    link: string
}

const ButtonLink: React.FC<buttonProps> = (props) => {

    return (
        <button>
            <Link to={props.link}>
                {props.text}
            </Link>
        </button>
    );
}

export default ButtonLink;