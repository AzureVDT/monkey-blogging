import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
const PostImageStyles = styled.div`
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }
`;

const PostImage = ({ className = "", url = "", alt = "", to = "" }) => {
    if (to)
        return (
            <Link to={`/${to}`} style={{ display: "block" }}>
                <PostImageStyles className={`post-image ${className}`}>
                    <img
                        src={url}
                        alt={alt}
                        className={className}
                        loading="lazy"
                    />
                </PostImageStyles>
            </Link>
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
