import React, { useEffect } from "react";
import { useAuth } from "../context/auth-context";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationPage from "./AuthenticationPage";
import { Field } from "../components/field";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { Button } from "../components/button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import InputPasswordToggle from "../components/input/InputPasswordToggle";
const schema = yup.object({
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
const SignInPage = () => {
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = "Login Page";
        if (userInfo?.email) navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid, errors },
    } = useForm({ resolver: yupResolver(schema) });
    const handleSignIn = async (values) => {
        if (!isValid) return;
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast.success("Login successfully", {
            pauseOnHover: false,
            delay: 0,
        });
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
    return (
        <AuthenticationPage>
            <form
                className="form"
                onSubmit={handleSubmit(handleSignIn)}
                autoComplete="off"
            >
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
                    className="w-full max-w-[300px] mx-auto"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    kind="primary"
                >
                    Sign In
                </Button>
                <div className="have-account">
                    <span>Not registered yet?</span>
                    <NavLink to={"/sign-up"}>Create an Account</NavLink>
                </div>
            </form>
        </AuthenticationPage>
    );
};

export default SignInPage;
