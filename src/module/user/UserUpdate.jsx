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
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { Textarea } from "../../components/textarea";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
    fullName: yup.string().required("Please enter your full name!"),
    username: yup.string().required("Please enter your user name!"),
});
const UserUpdate = () => {
    const [params] = useSearchParams();
    const userId = params.get("id");
    const [changePassword, setChangePassword] = useState(false);
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
            password: "",
            status: 2,
            role: 4,
            description: "",
            phone: "",
            newPassword: "",
            confirmPassword: "",
            birthday: "",
        },
        resolver: yupResolver(schema),
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
        if (!values.newPassword && !values.confirmPassword) {
            try {
                const colRef = doc(db, "users", userId);
                await updateDoc(colRef, {
                    avatar: image,
                    role: Number(values.role),
                    status: Number(values.status),
                    description: values.description,
                    phone: values.phone,
                    birthday: values.birthday,
                });
                toast.success("Update user information successfully!");
            } catch (error) {
                console.log(error);
                toast.error("Update user failed!");
            }
        } else if (values.newPassword) {
            if (values.newPassword === values.password) {
                toast.error("New password must be different to Old password!");
                return;
            }
            if (values.newPassword !== values.confirmPassword) {
                toast.error("Confirm password must be match new password!");
                return;
            }
            if (values.newPassword === values.confirmPassword) {
                const regex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                const newPassword = String(values.newPassword);
                if (regex.test(newPassword)) {
                    try {
                        const colRef = doc(db, "users", userId);
                        await updateDoc(colRef, {
                            avatar: image,
                            role: Number(values.role),
                            status: Number(values.status),
                            description: values.description,
                            phone: values.description,
                            birthday: values.birthday,
                            password: values.newPassword,
                        });
                        toast.success("Update user information successfully!");
                    } catch (error) {
                        console.log(error);
                        toast.error("Update user failed!");
                    }
                } else {
                    toast.error(
                        "Your password must have at least with one lowercase, uppercase, digit and special character!"
                    );
                    return;
                }
            }
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
                        <Label>Date of Birth</Label>
                        <Input
                            control={control}
                            name="birthday"
                            placeholder="dd/mm/yyyy"
                        ></Input>
                    </Field>
                    <Field>
                        <Label>Mobile Number</Label>
                        <Input
                            control={control}
                            name="phone"
                            placeholder="Enter your phone number"
                        ></Input>
                    </Field>
                </div>
                <div className="form-layout">
                    <Field>
                        <Label>Password</Label>
                        <InputPasswordToggle
                            control={control}
                            name="password"
                            disabled
                        ></InputPasswordToggle>
                    </Field>
                    <span
                        className="mr-auto translate-y-1/3 cursor-pointer"
                        onClick={() => setChangePassword(!changePassword)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    </span>
                </div>
                {changePassword && (
                    <div className="form-layout">
                        <Field>
                            <Label>New Password</Label>
                            <InputPasswordToggle
                                control={control}
                                name="newPassword"
                                placeholder="Enter your new password"
                            ></InputPasswordToggle>
                        </Field>
                        <Field>
                            <Label>Confirm Password</Label>
                            <InputPasswordToggle
                                control={control}
                                name="confirmPassword"
                                placeholder="Enter your confirm password"
                            ></InputPasswordToggle>
                        </Field>
                    </div>
                )}
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
