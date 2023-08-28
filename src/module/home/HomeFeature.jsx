import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostFeatureItem from "../post/PostFeatureItem";
import React from "react";
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            where("status", "==", 1),
            where("hot", "==", true),
            limit(3)
        );
        onSnapshot(queries, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setPosts(results);
        });
    }, []);
    if (posts.length <= 0) return null;
    return (
        <HomeFeatureStyles className="home-block">
            <div className="container">
                <Heading>Feature</Heading>
                <div className="grid-layout">
                    {posts.map((post) => (
                        <PostFeatureItem
                            key={post.id}
                            data={post}
                        ></PostFeatureItem>
                    ))}
                </div>
            </div>
        </HomeFeatureStyles>
    );
};

export default HomeFeature;
