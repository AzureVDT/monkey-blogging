import styled from "styled-components";
import { Button } from "../button";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
const menuLinks = [
    {
        url: "/#",
        title: "Home",
    },
    {
        url: "/blog",
        title: "Blog",
    },
    {
        url: "/contact",
        title: "Contact",
    },
];
const HeaderStyles = styled.div`
    padding: 40px 0;
    .header-main {
        display: flex;
        align-items: center;
    }
    .logo {
        display: inline-block;
        max-width: 50px;
    }
    .menu {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-left: 40px;
        list-style: none;
        font-weight: 500;
    }
    .search {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding: 15px 25px;
        border-radius: 8px;
        border: 1px solid #ccc;
        width: 100%;
        max-width: 320px;
        position: relative;
        margin-right: 20px;
    }
    .search-input {
        flex: 1;
        padding-right: 45px;
        border: none;
        font-weight: 500;
        cursor: pointer;
    }
    .search-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 25px;
    }
    .header-button {
        margin-left: 20px;
        max-width: 200px;
    }
    .header-auth {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
const Header = () => {
    const { userInfo } = useAuth();
    console.log("Header ~ userInfo:", userInfo);
    return (
        <HeaderStyles>
            <div className="container">
                <div className="header-main">
                    <NavLink to="/">
                        <img
                            srcSet="/logo.png 2x"
                            alt="monkey-blogging"
                            className="logo"
                        />
                    </NavLink>
                    <ul className="menu">
                        {menuLinks.map((item) => (
                            <li key={item.title} className="menu-item">
                                <NavLink to={item.url}>{item.title}</NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="search-posts..."
                            className="search-input"
                        />
                        <span className="search-icon">
                            <svg
                                width="18"
                                height="17"
                                viewBox="0 0 18 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <ellipse
                                    cx="7.66669"
                                    cy="7.05161"
                                    rx="6.66669"
                                    ry="6.05161"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                                    stroke="#999999"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </div>
                    {!userInfo ? (
                        <Button
                            type="submit"
                            className="header-button"
                            height="56px"
                            to="/sign-up"
                        >
                            Sign Up
                        </Button>
                    ) : (
                        <div className="header-auth">
                            <strong className="text-primary">
                                {userInfo?.displayName}
                            </strong>
                        </div>
                    )}
                </div>
            </div>
        </HeaderStyles>
    );
};

export default Header;
