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
import { ImageUpload } from "../../components/image";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/toggle/Toggle";
import { useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
    const { control, watch, setValue, handleSubmit, getValues } = useForm({
        mode: "onChange",
        defaultValues: {
            title: "",
            slug: "",
            status: 2,
            category: "",
            hot: false,
        },
    });
    const addPostHandler = async (values) => {
        const cloneValue = { ...values };
        cloneValue.slug = slugify(values.slug || values.title);
        cloneValue.status = Number(values.status);
        // handleUploadImage(cloneValue.image);
        console.log("addPostHandler ~ cloneValue:", cloneValue);
    };
    const { image, progress, handleSelectImage, handleDeleteImage } =
        useFirebaseImage(setValue, getValues);
    const watchHot = watch("hot");
    const watchStatus = watch("status");
    // const watchCategory = watch("category");
    useEffect(() => {
        async function getData() {
            const colRef = collection(db, "categories");
            const q = query(colRef, where("status", "==", 1));
            const querySnapshot = await getDocs(q);
            let result = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                result.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
        }
        getData();
    }, []);
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
                        <ImageUpload
                            name="image"
                            onChange={handleSelectImage}
                            progress={progress}
                            image={image}
                            className="h-[250px]"
                            handleDeleteImage={handleDeleteImage}
                        ></ImageUpload>
                    </Field>
                    <Field>
                        <Label>Category</Label>
                    </Field>
                    <Field>
                        <Label>Feature post</Label>
                        <Toggle
                            on={watchHot === true}
                            onClick={() => setValue("hot", !watchHot)}
                        ></Toggle>
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
                    {/* <Field>
                        <Label htmlFor="author">Author</Label>
                        <Input
                            control={control}
                            placeholder="Find the author"
                            name="author"
                        ></Input>
                    </Field> */}
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Feature post</Label>
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
