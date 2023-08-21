import { useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../icon";
import Input from "./Input";
import PropTypes from "prop-types";
const InputPasswordToggle = ({ control }) => {
    const [togglePassword, setTogglePassword] = useState(false);
    if (!control) return null;
    return (
        <>
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
        </>
    );
};
InputPasswordToggle.propTypes = {
    control: PropTypes.object,
};

export default InputPasswordToggle;
