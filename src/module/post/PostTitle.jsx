import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const PostTitleStyles = styled.h3`
    font-weight: 600;
    line-height: 1.5;
    display: block;
    a {
        display: block;
    }
    ${(props) =>
        props.size === "normal" &&
        css`
            font-size: 18px;
        `};
    ${(props) =>
        props.size === "big" &&
        css`
            font-size: 22px;
        `};
`;

const PostTitle = ({ children, className, size = "normal", to = "" }) => {
    return (
        <PostTitleStyles className={`post-title ${className}`} size={size}>
            <Link to={`/${to}`}>{children}</Link>
        </PostTitleStyles>
    );
};
PostTitle.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    size: PropTypes.string,
    to: PropTypes.string,
};

export default PostTitle;
