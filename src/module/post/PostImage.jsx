import styled from "styled-components";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
const PostImageStyles = styled.div`
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }
`;

const PostImage = ({ className = "", url = "", alt = "", to = null }) => {
    if (to)
        return (
            <NavLink to={to} style={{ display: "block" }}>
                <PostImageStyles className={`post-image ${className}`}>
                    <img
                        src={url}
                        alt={alt}
                        className={className}
                        loading="lazy"
                    />
                </PostImageStyles>
            </NavLink>
        );
    return (
        <PostImageStyles className={`post-image ${className}`}>
            <img src={url} alt={alt} className={className} loading="lazy" />
        </PostImageStyles>
    );
};

PostImage.propTypes = {
    className: PropTypes.string,
    url: PropTypes.string,
    alt: PropTypes.string,
    to: PropTypes.string,
};

export default PostImage;
