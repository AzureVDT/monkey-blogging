import { useDropdown } from "./dropdown-context";
import PropTypes from "prop-types";
const Option = (props) => {
    const { onClick } = useDropdown();
    return (
        <div
            className="px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-gray-100"
            onClick={onClick}
        >
            {props.children}
        </div>
    );
};

Option.propTypes = {
    children: PropTypes.node,
};

export default Option;
