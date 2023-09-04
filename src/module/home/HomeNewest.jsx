import styled from "styled-components";
import Heading from "../../components/layout/Heading";
import PostNewestLarge from "../post/PostNewestLarge";
import PostNewestItem from "../post/PostNewestItem";
import { v5 } from "uuid";
import React from "react";
import {
    collection,
    limit,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";

const HomeNewestStyles = styled.div`
    .layout {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-gap: 40px;
        margin-bottom: 64px;
        align-items: start;
    }
    .sidebar {
        padding: 28px 20px;
        background-color: #f3edff;
        border-radius: 16px;
    }
`;

const HomeNewest = () => {
    const [posts, setPosts] = React.useState([]);
    React.useEffect(() => {
        const colRef = collection(db, "posts");
        const queries = query(
            colRef,
            where("status", "==", 1),
            where("hot", "==", false),
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
    const [first, ...orther] = posts;
    return (
        <HomeNewestStyles className="home-block">
            <div className="container">
                <Heading>Newest update</Heading>
                <div className="layout">
                    <PostNewestLarge data={first}></PostNewestLarge>
                    <div className="sidebar">
                        {orther.length > 0 &&
                            orther.map((item) => (
                                <PostNewestItem
                                    key={v5}
                                    data={item}
                                ></PostNewestItem>
                            ))}
                    </div>
                </div>
            </div>
        </HomeNewestStyles>
    );
};

export default HomeNewest;
