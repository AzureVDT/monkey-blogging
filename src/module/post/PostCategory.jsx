import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
const PostCategoryStyles = styled.div`
    display: inline-block;
    padding: 8px 12px;
    border-radius: 10px;
    color: ${(props) => props.theme.gray6B};
    font-size: 14px;
    font-weight: 600;
    background-color: #f3f3f3;
    a {
        display: block;
    }
    ${(props) =>
        props.type === "primary" &&
        css`
            background: ${(props) => props.theme.grayF3};
        `};
    ${(props) =>
        props.type === "secondary" &&
        css`
            background: white;
        `};
`;

const PostCategory = ({
    children,
    type = "primary",
    className = "",
    to = "",
}) => {
    return (
        <PostCategoryStyles
            type={type}
            className={`post-category ${className}`}
        >
            <Link to={`/category/${to}`}>{children}</Link>
        </PostCategoryStyles>
    );
};

PostCategory.propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    className: PropTypes.string,
    to: PropTypes.string,
};

export default PostCategory;
