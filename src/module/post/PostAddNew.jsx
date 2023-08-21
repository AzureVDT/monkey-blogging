import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import slugify from "slugify";
import { postStatus } from "../../utils/constants";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { control, watch, setValue, handleSubmit } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            slug: "",
            status: 2,
            category: "",
        },
    });
    const addPostHandler = async (values) => {
        const cloneValue = { ...values };
        cloneValue.slug = slugify(values.slug || values.title);
        cloneValue.status = Number(values.status);
        // handleUploadImage(cloneValue.image);
        console.log("addPostHandler ~ cloneValue:", cloneValue);
    };

    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
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
                    console.log("File available at", downloadURL);
                });
            }
        );
    };

    const onSelectImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setValue("image", file);
    };
    const watchStatus = watch("status");
    const watchCategory = watch("category");
    return (
        <PostAddNewStyles>
            <h1 className="dashboard-heading">Add new post</h1>
            <form onSubmit={handleSubmit(addPostHandler)}>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            control={control}
                            placeholder="Enter your title"
                            name="title"
                        ></Input>
                    </Field>
                    <Field>
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            control={control}
                            placeholder="Enter your slug"
                            name="slug"
                        ></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label htmlFor="image">Image</Label>
                        <input
                            type="file"
                            name="image"
                            onChange={onSelectImage}
                        />
                    </Field>
                    <Field>
                        <Label>Status</Label>
                        <div className="flex items-center gap-x-5">
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.APPROVED
                                }
                                value={postStatus.APPROVED}
                            >
                                Approved
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.PENDING
                                }
                                value={postStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === postStatus.REJECTED
                                }
                                value={postStatus.REJECTED}
                            >
                                Reject
                            </Radio>
                        </div>
                    </Field>
                    <Field>
                        <Label htmlFor="author">Author</Label>
                        <Input
                            control={control}
                            placeholder="Find the author"
                            name="author"
                        ></Input>
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                            <Dropdown.Option>Knowledge</Dropdown.Option>
                            <Dropdown.Option>Blockchain</Dropdown.Option>
                            <Dropdown.Option>Setup</Dropdown.Option>
                            <Dropdown.Option>Nature</Dropdown.Option>
                            <Dropdown.Option>Developer</Dropdown.Option>
                        </Dropdown>
                    </Field>
                    <Field></Field>
                </div>
                <Button type="submit" kind="primary" className="mx-auto">
                    Add new post
                </Button>
            </form>
        </PostAddNewStyles>
    );
};

export default PostAddNew;
