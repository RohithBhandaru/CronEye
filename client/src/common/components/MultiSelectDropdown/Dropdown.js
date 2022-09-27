import React from "react";
import { useSelector } from "react-redux";

import Option from "./Option";

import { logsFiltersSelector } from "../../../dashboard/selectors/dashboardSelector";

const Dropdown = ({ name, toggleModal, length }) => {
    const filters = useSelector((state) => logsFiltersSelector(state, name));

    return (
        <>
            <div className="cancel-canvas" onClick={() => toggleModal(false)}></div>
            <div className="centered">
                <div className={"modal" + (length === "big" ? " modal-big" : "")}>
                    {filters.map((filter) => (
                        <Option name={name} value={filter} key={filter} length={length} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dropdown;
