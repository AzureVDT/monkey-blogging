import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../dashboard/DashboardHeading";
import { ImageUpload } from "../../components/image";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { userRole, userStatus } from "../../utils/constants";
import { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { Textarea } from "../../components/textarea";

const UserUpdate = () => {
    const [params] = useSearchParams();
    const userId = params.get("id");
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            image: "",
            fullName: "",
            username: "",
            email: "",
            password: "",
            status: 2,
            role: 4,
            description: "",
        },
    });
    useEffect(() => {
        async function fetchData() {
            if (!userId) return;
            const colRef = doc(db, "users", userId);
            const docData = await getDoc(colRef);
            reset(docData && docData.data());
        }
        fetchData();
    }, [reset, userId]);
    const imageURL = getValues("avatar");
    const imageRegex = /%2F(\S+)\?/gm.exec(imageURL);
    const imageName = imageRegex?.length > 0 ? imageRegex[1] : "";
    const deleteAvatar = async () => {
        const colRef = doc(db, "users", userId);
        await updateDoc(colRef, {
            avatar: "",
        });
    };
    const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
        useFirebaseImage(setValue, getValues, imageName, deleteAvatar);
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, "users", userId);
            await updateDoc(colRef, {
                ...values,
                avatar: image,
                role: Number(values.role),
                status: Number(values.status),
            });
            toast.success("Update user information successfully!");
            navigate("/manage/user");
        } catch (error) {
            console.log(error);
            toast.error("Update user failed!");
        }
    };
    useEffect(() => {
        setImage(imageURL);
    }, [imageURL, setImage]);
    return (
        <div>
            <DashboardHeading
                title="Update user"
                desc={`Update your user id: ${userId}`}
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
                <div className="w-[200px] h-[200px] rounded-full mx-auto mb-10">
                    <ImageUpload
                        className="!rounded-full h-full"
                        name="image"
                        onChange={handleSelectImage}
                        progress={progress}
                        image={image}
                        handleDeleteImage={handleDeleteImage}
                    ></ImageUpload>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Fullname</Label>
                        <Input
                            name="fullName"
                            placeholder="Enter your fullname"
                            control={control}
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            placeholder="Enter your username"
                            control={control}
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            placeholder="Enter your email"
                            control={control}
                            type="email"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Password</Label>
                        <InputPasswordToggle
                            control={control}
                        ></InputPasswordToggle>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Status</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === userStatus.ACTIVE
                                }
                                value={userStatus.ACTIVE}
                            >
                                Active
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === userStatus.PENDING
                                }
                                value={userStatus.PENDING}
                            >
                                Pending
                            </Radio>
                            <Radio
                                name="status"
                                control={control}
                                checked={
                                    Number(watchStatus) === userStatus.BANNED
                                }
                                value={userStatus.BANNED}
                            >
                                Banned
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                    <Field>
                        <Label>Role</Label>
                        <FieldCheckboxes>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.ADMIN}
                                value={userRole.ADMIN}
                            >
                                Admin
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={
                                    Number(watchRole) === userRole.MODERATOR
                                }
                                value={userRole.MODERATOR}
                            >
                                Moderator
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.EDITOR}
                                value={userRole.EDITOR}
                            >
                                Editor
                            </Radio>
                            <Radio
                                name="role"
                                control={control}
                                checked={Number(watchRole) === userRole.USER}
                                value={userRole.USER}
                            >
                                User
                            </Radio>
                        </FieldCheckboxes>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            control={control}
                        ></Textarea>
                    </Field>
                </div>
                <Button
                    kind="primary"
                    className="mx-auto w-[200px]"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Update user
                </Button>
            </form>
        </div>
    );
};

export default UserUpdate;
