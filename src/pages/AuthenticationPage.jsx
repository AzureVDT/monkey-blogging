import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
const AuthenticationStyles = styled.div`
    min-height: 100vh;
    padding: 40px;
    .logo {
        margin: 0 auto 20px;
    }
    .heading {
        text-align: center;
        color: ${(props) => props.theme.primary};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 60px;
    }
    .form {
        max-width: 800px;
        margin: 0 auto;
    }
    .have-account {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0 8px;
        span {
            color: ${(props) => props.theme.grayDark};
            font-weight: 500;
            font-size: 16px;
        }
        a {
            display: inline-block;
            font-weight: 400;
            text-decoration: none;
            color: ${(props) => props.theme.primary};
            &:hover {
                text-decoration: underline;
            }
        }
    }
`;
const AuthenticationPage = ({ children }) => {
    return (
        <AuthenticationStyles>
            <div className="container">
                <NavLink to={"/"}>
                    <img
                        srcSet="./logo.png 2x"
                        alt="Monkey-Blogging"
                        className="logo"
                    />
                </NavLink>
                <h1 className="heading">Monkey Blogging</h1>
                {children}
            </div>
            {}
        </AuthenticationStyles>
    );
};

AuthenticationPage.propTypes = {
    children: PropTypes.node,
};

export default AuthenticationPage;
