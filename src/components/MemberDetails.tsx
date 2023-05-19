import { Member } from "../interfaces/Member";
import { Link } from "react-router-dom"

const MemberDetails: React.FC<Member> = (props) => {
    return (
        <ul key={props.id}>
            {props.id ? <li><Link to={"/member/"+props.id}>id : {props.id}</Link></li> : null}
            {props.username ? <li>username : {props.username}</li> : null}
            {props.password ? <li>password : {props.password}</li> : null}
            {props.fullName ? <li>fullName : {props.fullName}</li> : null}
            {props.createdAt ? <li>createdAt : {props.createdAt.toString()}</li> : null}
            {props.updatedAt ? <li>updatedAt : {props.updatedAt.toString()}</li> : null}
        </ul>
    )
}

export default MemberDetails;