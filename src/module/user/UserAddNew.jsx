import { useForm } from "react-hook-form";
import DashboardHeading from "../dashboard/DashboardHeading";
import { Field, FieldCheckboxes } from "../../components/field";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { Radio } from "../../components/checkbox";
import { Button } from "../../components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userRole, userStatus } from "../../utils/constants";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-app/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ImageUpload } from "../../components/image";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import slugify from "slugify";
const schema = yup.object({
    fullName: yup.string().required("Please enter your full name!"),
    email: yup
        .string()
        .email("Please enter valid email address")
        .required("Please enter your email address"),
    password: yup
        .string()
        .min(8, "Your password must be at least 8 character or greater")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            {
                message:
                    "Your password must have at least with one lowercase, uppercase, digit and special character",
            }
        )
        .required("Please enter your password"),
});
const UserAddNew = () => {
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        formState: { isSubmitting, isValid, errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            image: "",
            status: userStatus.PENDING,
            role: userRole.USER,
            createdAt: new Date(),
        },
    });
    const {
        image,
        progress,
        handleSelectImage,
        handleDeleteImage,
        handleResetUpload,
    } = useFirebaseImage(setValue, getValues);
    const watchStatus = watch("status");
    const watchRole = watch("role");
    const handleAddNewUser = async (values) => {
        if (!isValid) return;
        const cloneValues = { ...values };
        cloneValues.status = Number(values.status);
        cloneValues.role = Number(values.role);
        try {
            await createUserWithEmailAndPassword(
                auth,
                cloneValues.email,
                cloneValues.password
            );
            await addDoc(collection(db, "users"), {
                fullName: cloneValues.fullName,
                email: cloneValues.email,
                password: cloneValues.password,
                avatar: image,
                createdAt: serverTimestamp(),
                username: slugify(
                    cloneValues.username || cloneValues.fullName,
                    {
                        lower: true,
                        replacement: " ",
                        trim: true,
                    }
                ),
                status: userStatus.ACTIVE,
                role: userRole.USER,
            });
            toast.success(
                `Create new user with email: ${cloneValues.email} successfully!`
            );
            reset({
                fullName: "",
                username: "",
                email: "",
                password: "",
                image: "",
                status: userStatus.PENDING,
                role: userRole.USER,
                createdAt: new Date(),
            });
            handleResetUpload();
        } catch (error) {
            console.log(error);
            toast.error("Can not create new user");
        }
    };
    useEffect(() => {
        const arrayErrors = Object.values(errors);
        if (arrayErrors.length > 0) {
            toast.error(arrayErrors[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    return (
        <div>
            <DashboardHeading
                title="New user"
                desc="Add new user to system"
            ></DashboardHeading>
            <form onSubmit={handleSubmit(handleAddNewUser)}>
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
                <Button
                    kind="primary"
                    className="mx-auto w-[200px]"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Add new user
                </Button>
            </form>
        </div>
    );
};

export default UserAddNew;
