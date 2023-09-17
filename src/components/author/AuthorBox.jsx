import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { db } from "../../firebase-app/firebase-config";
const AuthorBox = ({ userId = "" }) => {
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
        async function fetchUserData() {
            const docRef = doc(db, "users", userId);
            const docSnapshot = await getDoc(docRef);
            setUserInfo(docSnapshot.data());
        }
        fetchUserData();
    }, [userId]);
    if (!userId || !userInfo?.username) return null;
    return (
        <div className="author">
            <div className="cursor-pointer author-image">
                <img src={userInfo?.avatar} alt="" />
            </div>
            <div className="author-content">
                <h3 className="cursor-pointer author-name">
                    {userInfo?.fullName}
                </h3>
                <p className="author-desc">{userInfo?.description}</p>
            </div>
        </div>
    );
};
AuthorBox.propTypes = {
    userId: PropTypes.string,
};

export default AuthorBox;
