import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Heading from "../components/layout/Heading";
import PostItem from "../module/post/PostItem";
import useUserPost from "../hooks/useUserPost";
import { useAuth } from "../context/auth-context";
import { userRole } from "../utils/constants";

const AuthorPage = () => {
    const params = useParams();
    const { userInfo } = useAuth();
    console.log("AuthorPage ~ userInfo:", userInfo);
    const posts = useUserPost(params);
    if (posts.length <= 0) return null;
    return (
        <Layout>
            <div className="container">
                <div className="flex items-center justify-center gap-x-5">
                    <div className="w-full h-[300px] rounded-lg">
                        <img
                            src={userInfo?.avatar}
                            alt=""
                            className="object-cover w-full h-full rounded-lg"
                        />
                    </div>
                    <div className="flex flex-col gap-y-5">
                        <h3 className="text-3xl font-bold">
                            {userInfo?.fullName}
                        </h3>
                        <p className="text-sm font-normal leading-relaxed">
                            {userInfo?.description}
                        </p>
                        <span>
                            Date of birth:{" "}
                            <strong>
                                {userInfo?.birthday
                                    ? userInfo?.birthday
                                    : "null"}
                            </strong>
                        </span>
                        <span>
                            Phone:{" "}
                            <strong>
                                {userInfo?.phone ? userInfo?.phone : "null"}
                            </strong>
                        </span>
                        <span>
                            Role in Monkey Blogging:{" "}
                            <strong>
                                {userInfo?.role === userRole.ADMIN
                                    ? "ADMIN"
                                    : "USER"}
                            </strong>
                        </span>
                        <span>
                            Create account in:{" "}
                            <strong>
                                {new Date(
                                    userInfo?.createdAt?.seconds * 1000
                                ).toLocaleDateString("vi-VI")}
                            </strong>
                        </span>
                    </div>
                </div>
                <div className="pt-10">
                    <Heading>Danh mục bài viết của: {params.slug}</Heading>
                    <div className="grid-layout grid-layout--primary">
                        {posts.map((item) => (
                            <PostItem key={item.id} data={item}></PostItem>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthorPage;
