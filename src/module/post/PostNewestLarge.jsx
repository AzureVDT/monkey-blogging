import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import PropTypes from "prop-types";
const PostNewestLargeStyles = styled.div`
    .post {
        &-image {
            display: block;
            margin-bottom: 16px;
            height: 433px;
            border-radius: 16px;
        }
        &-category {
            margin-bottom: 10px;
        }
        &-title {
            margin-bottom: 10px;
        }
    }
`;

const PostNewestLarge = ({ data }) => {
    if (!data.id) return null;
    return (
        <PostNewestLargeStyles>
            <PostImage
                url={data?.image}
                alt="unsplash"
                to={data?.slug}
            ></PostImage>
            <PostCategory to={data?.category?.slug}>
                {data?.category?.name}
            </PostCategory>
            <PostTitle to={data?.slug} size="big">
                {data?.title}
            </PostTitle>
            <PostMeta
                date={new Date(
                    data?.user?.createdAt?.seconds * 1000
                ).toLocaleDateString("vi-VI")}
                authorName={data?.user?.fullName}
                to={`${data?.user?.username}`}
            ></PostMeta>
        </PostNewestLargeStyles>
    );
};
PostNewestLarge.propTypes = {
    data: PropTypes.object,
};

export default PostNewestLarge;
