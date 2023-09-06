import { useState } from "react";
import { IconEyeClose, IconEyeOpen } from "../icon";
import Input from "./Input";
import PropTypes from "prop-types";
const InputPasswordToggle = ({ control, name = "password", disabled }) => {
    const [togglePassword, setTogglePassword] = useState(false);
    if (!control) return null;
    return (
        <>
            <Input
                name={name}
                type={togglePassword ? "text" : "password"}
                placeholder="Enter your password"
                control={control}
                disabled={disabled}
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
    name: PropTypes.string,
    disabled: PropTypes.bool,
};

export default InputPasswordToggle;
