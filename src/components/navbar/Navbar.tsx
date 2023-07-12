import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "../../interfaces/Menu";
import { Typography } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { removeCookieToken } from "../../cookie/Cookie";
import { DELETE_TOKEN } from "../../redux/Auth";
import { useNavigate } from "react-router-dom";
import logo from "../../images/skedulog_no_bg_underline.png";
import searchImage from "../../images/magnifier.png";
import styles from "./Navbar.module.scss";
import { RootState } from "../../interfaces/RootState";
import useCheckToken from "../../hooks/useCheckToken";
import { useApolloClient } from "@apollo/client";

const signUp: Menu = {
    key: "signUp",
    link: "/signup",
    text: "회원가입"
}

const logIn: Menu = {
    key: "logIn",
    link: "/login",
    text: "로그인"
}

const logOut: Menu = {
    key: "logOut",
    link: "/",
    text: "로그아웃"
}

const member: Menu = {
    key: "member",
    link: "/member",
    text: "회원정보"
}

const Navbar: React.FC = () => {

    const [menu, setMenu] = useState<Menu[]>([signUp, logIn]);
    const isAuthenticated = useSelector((state: RootState) => state.authToken.authenticated)
    const { checkAuth } = useCheckToken();
    const { Text } = Typography;
    const client = useApolloClient();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        checkAuth();
    }, [checkAuth])

    useEffect(() => {
        isAuthenticated ? setMenu([logOut,member]) : setMenu([signUp, logIn]);
    }, [isAuthenticated])

    const handleMouseEnter = (e: React.MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        target.classList.add(styles.underline);
    };
      
    const handleMouseLeave = (e: React.MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        target.classList.remove(styles.underline);
    };

    const handleSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;

            // 검색 처리 로직
            console.log(target.value);
        }
    }

    const handleLogOut = () => {
        dispatch(DELETE_TOKEN());
        removeCookieToken();
        client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'member' })
        client.cache.gc();
        navigate('/');
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <img src={logo} />
                </Link>
            </div>
            <div className={styles.search_box}>
                <div>
                    <img className={styles.search_icon} src={searchImage} alt="" />
                </div>
                <div className={styles.search_input_container}>
                    <input className={styles.search_input} type="text" placeholder="키워드를 입력하세요" onKeyDown={handleSearch} />
                </div>
            </div>
            <div className={styles.menu}>
                {menu.map((each: Menu, index: number) => {
                    return (
                        <Link 
                            key={index} 
                            to={isAuthenticated && each.key === 'logOut' ? '' : each.link} 
                            className={styles.menu_item} 
                            onMouseOver={handleMouseEnter} 
                            onMouseLeave={handleMouseLeave}
                            onClick={isAuthenticated && each.key === 'logOut' ? handleLogOut : undefined}
                        >
                            <Text className={styles.menu_item_text}>
                                {each.text}
                            </Text>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

export default Navbar;