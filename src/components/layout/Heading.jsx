import styled from "styled-components";
import PropTypes from "prop-types";
const HeadingStyles = styled.h2`
    color: ${(props) => props.theme.tertiary};
    font-size: 28px;
    position: relative;
    margin-bottom: 30px;
    font-weight: 700;
    &:before {
        content: "";
        width: 50px;
        height: 4px;
        background-color: ${(props) => props.theme.accent};
        position: absolute;
        top: -4px;
        left: 0;
        transform: translate(0, -150%);
    }
`;
const Heading = ({ className = "", children }) => {
    return <HeadingStyles className={className}>{children}</HeadingStyles>;
};
Heading.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Heading;
