import React from "react";
import { useSelector } from "react-redux";

import Option from "./Option";

import { logsFiltersSelector } from "../../../dashboard/selectors/dashboardSelector";

const Dropdown = ({ name, toggleModal }) => {
    const filters = useSelector((state) => logsFiltersSelector(state, name));

    return (
        <>
            <div className="cancel-canvas" onClick={() => toggleModal(false)}></div>
            <div className="centered">
                <div className="modal">
                    {filters.map((filter) => (
                        <Option name={name} value={filter} key={filter} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dropdown;
