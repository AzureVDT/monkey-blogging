import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase-app/firebase-config";

const useUserPost = (params = "") => {
    const [posts, setPosts] = useState([]);
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
    return posts;
};

export default useUserPost;
