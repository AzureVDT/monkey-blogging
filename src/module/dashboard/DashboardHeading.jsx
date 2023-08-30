import PropTypes from "prop-types";
const DashboardHeading = ({ title = "", desc = "", children }) => {
    return (
        <div className="flex justify-between">
            <div className="mb-10">
                <h1 className="dashboard-heading">{title}</h1>
                <p className="dashboard-short-desc">{desc}</p>
            </div>
            {children}
        </div>
    );
};
DashboardHeading.propTypes = {
    title: PropTypes.string,
    desc: PropTypes.string,
    children: PropTypes.node,
};

export default DashboardHeading;
