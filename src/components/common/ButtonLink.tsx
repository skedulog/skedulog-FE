import { Link } from "react-router-dom";

interface ButtonLinkProps {
    text?: string,
    link: string
}

const ButtonLink: React.FC<ButtonLinkProps> = (props) => {

    return (
        <button>
            <Link to={props.link}>
                {props.text}
            </Link>
        </button>
    );
}

export default ButtonLink;