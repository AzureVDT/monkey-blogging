import styled from "styled-components";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
const InputStyles = styled.div`
    position: relative;
    width: 100%;
    input {
        width: 100%;
        padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
        background: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        transition: all 0.2 linear;
        border: 1px solid transparent;
    }
    input:focus {
        background: #fff;
        border-color: ${(props) => props.theme.primary};
    }
    input::-webkit-input-placeholder {
        color: #84878b;
    }
    input::-moz-input-placeholder {
        color: #84878b;
    }
    .input-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;
const Input = ({ name = "", type = "text", children, control, ...props }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <InputStyles>
            <input
                type={type}
                id={name}
                {...props}
                {...field}
                autoComplete="false"
            />
            {children ? <div className="input-icon">{children}</div> : null}
        </InputStyles>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    children: PropTypes.node,
    control: PropTypes.object,
};

export default Input;
