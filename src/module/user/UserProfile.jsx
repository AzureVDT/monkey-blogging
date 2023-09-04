import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../dashboard/DashboardHeading";
import { ImageUpload } from "../../components/image";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import InputPasswordToggle from "../../components/input/InputPasswordToggle";
import { useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { Textarea } from "../../components/textarea";
import { useAuth } from "../../context/auth-context";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
const schema = yup.object({
    fullName: yup.string().required("Please enter your full name!"),
    username: yup.string().required("Please enter your user name!"),
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
const UserUpdate = () => {
    const { userInfo } = useAuth();
    const userId = userInfo.uid;
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { isSubmitting, isValid, errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            image: "",
            fullName: "",
            username: "",
            password: "",
            description: "",
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
    useEffect(() => {
        const arrayErrors = Object.values(errors);
        if (arrayErrors.length > 0) {
            toast.error(arrayErrors[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
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
    const handleUpdateUser = async (values) => {
        if (!isValid) return;
        try {
            const colRef = doc(db, "users", userId);
            await updateDoc(colRef, {
                ...values,
                avatar: image,
                role: userInfo.role,
                status: userInfo.status,
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
                        <Label>New Password</Label>
                        <InputPasswordToggle
                            control={control}
                            name="password"
                            placeholder="Enter your password"
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
