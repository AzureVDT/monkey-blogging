import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import React from "react";

const useFirebaseImage = (
    setValue = () => {},
    getValues = () => {},
    imageName = null,
    cb = null
) => {
    const [progress, setProgress] = React.useState(0);
    const [image, setImage] = React.useState("");
    if (!setValue || !getValues) return;
    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progressPercent =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent);
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        console.log("Nothing at all");
                }
            },
            (error) => {
                console.log("handleUploadImage ~ error:", error);
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImage(downloadURL);
                });
            }
        );
    };

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image_name", file.name);
        handleUploadImage(file);
    };
    const handleDeleteImage = () => {
        const storage = getStorage();
        const imageRef = ref(
            storage,
            "images/" + imageName || getValues("image_name")
        );

        // Delete the file
        deleteObject(imageRef)
            .then(() => {
                console.log("Remove image successfully");
                setImage("");
                setProgress(0);
                cb && cb();
            })
            .catch((error) => {
                console.log("handleDeleteImage ~ error:", error);
                console.log("Can not delete image");
            });
    };
    const handleResetUpload = () => {
        setImage("");
        setProgress(0);
    };
    return {
        progress,
        image,
        setProgress,
        setImage,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    };
};

export default useFirebaseImage;
