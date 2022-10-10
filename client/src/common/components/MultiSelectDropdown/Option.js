import React from "react";
import { connect, useDispatch } from "react-redux";

import { updateLogsForm } from "../../../dashboard/slice/dashboardSlice";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        form: state.dashboard.logs_form,
    };
};

const Option = (props) => {
    const dispatch = useDispatch();
    const updateOption = (event) => {
        const action = event.target.checked ? "add" : "remove";
        dispatch(updateLogsForm({ action, name: props.name, value: props.value }));
    };

    return (
        <label className="ms-option" title={props.value}>
            <input type={"checkbox"} onChange={updateOption} checked={props.form[props.name].includes(props.value)} />
            <span className={"ms-option-value" + (props.length === "big" ? " ms-option-value-big" : "")}>
                {props.display_value}
            </span>
        </label>
    );
};

const ConnectedOption = connect(mapStateToProps)(Option);

export default ConnectedOption;
