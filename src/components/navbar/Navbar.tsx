import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "../../interfaces/Menu";
import { Typography } from "antd"; 
import logo from "../../images/skedulog_no_bg_underline.png";
import searchImage from "../../images/magnifier.png";
import styles from "../../styles/components/Navbar.module.scss";

const signUp: Menu = {
    key: "signUp",
    link: "/signup",
    text: "회원가입"
}

const logIn: Menu = {
    key: "logIn",
    link: "/member/list",
    text: "로그인"
}

const logOut: Menu = {
    key: "logOut",
    link: "/member/list",
    text: "로그아웃"
}

const Navbar: React.FC = () => {
    const [menu, setMenu] = useState<Menu[]>([signUp, logIn]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const { Text } = Typography;

    useEffect(() => {
        isLoggedIn ? setMenu([logOut]) : setMenu([signUp, logIn]);
    }, [isLoggedIn])

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
                        <Link key={index} to={each.link} className={styles.menu_item} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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