import styled from "styled-components";
import PropTypes from "prop-types";
import { LoadingSpinner } from "../loading";
import { NavLink } from "react-router-dom";
const ButtonStyles = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0 25px;
    line-height: 1;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 18px;
    width: 100%;
    height: ${(props) => props.height || "66px"};
    background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
    );
    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;
const Button = ({
    type = "button",
    onClick = () => {},
    children,
    ...props
}) => {
    const { isLoading, to } = props;
    const child = isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    if (to !== "" && typeof to === "string")
        return (
            <NavLink to={to}>
                <ButtonStyles type={type} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        );
    return (
        <ButtonStyles type={type} onClick={onClick} {...props}>
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]).isRequired,
    onClick: PropTypes.func,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    to: PropTypes.string,
};

export default Button;
