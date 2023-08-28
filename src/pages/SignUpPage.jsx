import { Label } from "../components/label";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import React from "react";
import { Button } from "../components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase-app/firebase-config";
import { NavLink, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
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
const SignUpPage = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid, errors },
    } = useForm({ resolver: yupResolver(schema) });
    const handleSignUp = async (values) => {
        if (!isValid) return;
        console.log("handleSignUp ~ values:", values);
        await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        await setDoc(doc(db, "users", auth.currentUser.uid), {
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            username: slugify(values.fullName, { lower: true }),
        });
        await updateProfile(auth.currentUser, { displayName: values.fullName });
        toast.success("Register successfully");
        navigate("/");
    };
    React.useEffect(() => {
        const arrayErrors = Object.values(errors);
        if (arrayErrors.length > 0) {
            toast.error(arrayErrors[0]?.message, {
                pauseOnHover: false,
                delay: 0,
            });
        }
    }, [errors]);
    React.useEffect(() => {
        document.title = "Register Page";
    }, []);
    return (
        <AuthenticationPage>
            <form
                className="form"
                onSubmit={handleSubmit(handleSignUp)}
                autoComplete="false"
            >
                <Field>
                    <Label htmlFor="fullName">FullName</Label>
                    <Input
                        name="fullName"
                        type="text"
                        placeholder="Enter your fullName"
                        control={control}
                    ></Input>
                </Field>
                <Field>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        control={control}
                    ></Input>
                </Field>
                <Field>
                    <Label htmlFor="password">Password</Label>
                    <InputPasswordToggle
                        control={control}
                    ></InputPasswordToggle>
                </Field>
                <Button
                    type="submit"
                    kind="primary"
                    className="w-full max-w-[300px] mx-auto"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                >
                    Sign Up
                </Button>
                <div className="have-account">
                    <span>Already have account?</span>
                    <NavLink to={"/sign-in"}>Login</NavLink>
                </div>
            </form>
        </AuthenticationPage>
    );
};

export default SignUpPage;
