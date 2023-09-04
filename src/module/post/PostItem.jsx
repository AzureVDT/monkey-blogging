import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostTitle from "./PostTitle";
import PostMeta from "./PostMeta";
import PostImage from "./PostImage";
import PropTypes from "prop-types";
const PostItemStyles = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .post {
        &-image {
            height: 202px;
            margin-bottom: 20px;
            display: block;
            width: 100%;
            border-radius: 16px;
        }
        &-category {
            margin-bottom: 16px;
        }
        &-title {
            margin-bottom: 12px;
        }
    }
`;

const PostItem = ({ data }) => {
    return (
        <PostItemStyles>
            <PostImage
                url={data?.image}
                alt={data?.image_name}
                to={`${data?.slug}`}
            ></PostImage>
            <PostCategory to={`${data?.category?.slug}`}>
                {data?.category.name}
            </PostCategory>
            <PostTitle to={`${data?.slug}`}>{data?.title}</PostTitle>
            <PostMeta
                date={new Date(
                    data?.user?.createdAt?.seconds * 1000
                ).toLocaleDateString("vi-VI")}
                authorName={data?.user?.fullName}
                to={`${data?.user?.username}`}
            ></PostMeta>
        </PostItemStyles>
    );
};
PostItem.propTypes = {
    data: PropTypes.object,
};

export default PostItem;
