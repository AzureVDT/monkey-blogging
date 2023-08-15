import styled from "styled-components";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import React from "react";
import { IconEyeClose, IconEyeOpen } from "../components/icon";
import { Button } from "../components/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
const SignUpPageStyles = styled.div`
    min-height: 100vh;
    padding: 40px;
    .logo {
        margin: 0 auto 20px;
    }
    .heading {
        text-align: center;
        color: ${(props) => props.theme.primary};
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 60px;
    }
    .form {
        max-width: 800px;
        margin: 0 auto;
    }
`;
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
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, isValid, errors },
    } = useForm({ resolver: yupResolver(schema) });
    const handleSignUp = (values) => {
        console.log(Object.values(errors));
        if (!isValid) return;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
                console.log("handleSignUp ~ values:", values);
            }, 5000);
        });
    };
    const [togglePassword, setTogglePassword] = React.useState(false);
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
        <SignUpPageStyles>
            <div className="container">
                <img
                    srcSet="./logo.png 2x"
                    alt="Monkey-Blogging"
                    className="logo"
                />
                <h1 className="heading">Monkey Blogging</h1>
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
                        <Input
                            name="password"
                            type={togglePassword ? "text" : "password"}
                            placeholder="Enter your password"
                            control={control}
                        >
                            {togglePassword ? (
                                <IconEyeOpen
                                    onClick={() => {
                                        setTogglePassword(false);
                                    }}
                                ></IconEyeOpen>
                            ) : (
                                <IconEyeClose
                                    onClick={() => {
                                        setTogglePassword(true);
                                    }}
                                ></IconEyeClose>
                            )}
                        </Input>
                    </Field>
                    <Button
                        type="submit"
                        style={{
                            maxWidth: 300,
                            margin: "0 auto",
                        }}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
