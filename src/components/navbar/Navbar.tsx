import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "../../interfaces/Menu";
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
    const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

    useEffect(() => {
        isSignedIn ? setMenu([logOut]) : setMenu([signUp, logIn]);
    }, [isSignedIn])

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
                <Link to="/"><span style={{fontWeight:"bolder", fontSize:"25px", fontStyle:"oblique", color:"#1677ff"}}>SKEDULOG</span></Link>
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
                    return <Link key={index} to={each.link} className={styles.menuItem} onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>{each.text}</Link>
                })}
            </div>
        </div>
    );
}

export default Navbar;