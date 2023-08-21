import styled, { css } from "styled-components";
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
    border-radius: 8px;
    font-weight: 600;
    font-size: 18px;
    height: ${(props) => props.height || "66px"};
    ${(props) =>
        props.kind === "secondary" &&
        css`
            background: white;
            color: ${(props) => props.theme.primary};
        `};
    ${(props) =>
        props.kind === "primary" &&
        css`
            background-image: linear-gradient(
                to right bottom,
                ${(props) => props.theme.primary},
                ${(props) => props.theme.secondary}
            );
            color: white;
        `};
    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }
`;
const Button = ({
    type = "button",
    onClick = () => {},
    children,
    kind = "secondary",
    className = "",
    ...props
}) => {
    const { isLoading, to } = props;
    const child = isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    if (to !== "" && typeof to === "string")
        return (
            <NavLink to={to} style={{ display: "inline-block" }}>
                <ButtonStyles type={type} kind={kind} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        );
    return (
        <ButtonStyles
            className={className}
            type={type}
            kind={kind}
            onClick={onClick}
            {...props}
        >
            {child}
        </ButtonStyles>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit"]),
    onClick: PropTypes.func,
    children: PropTypes.node,
    isLoading: PropTypes.bool,
    to: PropTypes.string,
    kind: PropTypes.oneOf(["primary", "secondary"]),
    className: PropTypes.string,
};

export default Button;
