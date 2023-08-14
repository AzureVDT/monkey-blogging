import styled from "styled-components";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useForm } from "react-hook-form";
import { Field } from "../components/field";
import React from "react";
import { IconEyeClose, IconEyeOpen } from "../components/icon";
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
const SignUpPage = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        watch,
    } = useForm({});
    const handleSignUp = (values) => {
        console.log("handleSignUp ~ values:", values);
    };
    const [togglePassword, setTogglePassword] = React.useState(false);
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
                </form>
            </div>
        </SignUpPageStyles>
    );
};

export default SignUpPage;
