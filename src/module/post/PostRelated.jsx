import { useEffect, useState } from "react";
import Heading from "../../components/layout/Heading";
import PostItem from "./PostItem";
import PropTypes from "prop-types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
const PostRelated = ({ categoryId = "" }) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const docRef = query(
            collection(db, "posts"),
            where("category.id", "==", categoryId)
        );
        onSnapshot(docRef, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push(doc.data());
            });
            setPosts(results);
        });
    }, [categoryId]);
    if (!categoryId || posts.length <= 0) return null;
    return (
        <div className="post-related">
            <Heading>Bài viết liên quan</Heading>
            <div className="grid-layout grid-layout--primary">
                {posts.map((post) => (
                    <PostItem key={post.id} data={post}></PostItem>
                ))}
            </div>
        </div>
    );
};
PostRelated.propTypes = {
    categoryId: PropTypes.string,
};

export default PostRelated;
