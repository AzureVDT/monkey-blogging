import { useController } from "react-hook-form";
import PropTypes from "prop-types";
const Radio = ({ checked, children, control, name, ...rest }) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <label>
            <input
                onChange={() => {}}
                checked={checked}
                type="radio"
                className="hidden-input"
                {...field}
                {...rest}
            />
            <div className="flex items-center gap-x-3 font-medium cursor-pointer">
                <div
                    className={`w-7 h-7 rounded-full ${
                        checked ? "bg-green-400" : "bg-gray-200"
                    }`}
                ></div>
                <span>{children}</span>
            </div>
        </label>
    );
};
Radio.propTypes = {
    checked: PropTypes.bool,
    children: PropTypes.node,
    control: PropTypes.object,
    name: PropTypes.string,
};

export default Radio;
