import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import Heading from "../components/layout/Heading";
import PostItem from "../module/post/PostItem";

const AuthorPage = () => {
    const [posts, setPosts] = useState([]);
    const params = useParams();
    useEffect(() => {
        async function fetchData() {
            const docRef = query(
                collection(db, "posts"),
                where("user.username", "==", params.slug)
            );
            onSnapshot(docRef, (snapshot) => {
                const results = [];
                snapshot.forEach((doc) => {
                    results.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                setPosts(results);
            });
        }
        fetchData();
    }, [params.slug]);
    if (posts.length <= 0) return null;
    return (
        <Layout>
            <div className="container">
                <div className="pt-10"></div>
                <Heading>Danh mục bài viết của username: {params.slug}</Heading>
                <div className="grid-layout grid-layout--primary">
                    {posts.map((item) => (
                        <PostItem key={item.id} data={item}></PostItem>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default AuthorPage;
