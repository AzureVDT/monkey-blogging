import styled from "styled-components";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
const TextareaStyles = styled.div`
    position: relative;
    width: 100%;
    textarea {
        width: 100%;
        padding: 16px 20px;
        background: ${(props) => props.theme.grayLight};
        border-radius: 8px;
        transition: all 0.2 linear;
        border: 1px solid transparent;
        resize: none;
        min-height: 200px;
    }
    textarea:focus {
        background: #fff;
        border-color: ${(props) => props.theme.primary};
    }
    textarea::-webkit-input-placeholder {
        color: #84878b;
    }
    textarea::-moz-input-placeholder {
        color: #84878b;
    }
`;
const Textarea = ({ name = "", type = "text", control, ...props }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <TextareaStyles>
            <textarea
                type={type}
                id={name}
                {...props}
                {...field}
                autoComplete="off"
            />
        </TextareaStyles>
    );
};

Textarea.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    control: PropTypes.object,
};

export default Textarea;
