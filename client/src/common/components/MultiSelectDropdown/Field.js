import React, { useState } from "react";
import { connect } from "react-redux";

import Dropdown from "./Dropdown";

// Accessible part of the state
const mapStateToProps = (state) => {
    return {
        form: state.dashboard.logs_form,
    };
};

const Field = (props) => {
    const [modal, toggleModal] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            <div
                className={"ms-field" + (props.length === "big" ? " ms-field-big" : "")}
                onClick={() => toggleModal(true)}
            >
                Select {props.name}
            </div>
            {modal && <Dropdown name={props.name} toggleModal={toggleModal} length={props.length} />}
            {props.form[props.name]?.length > 0 && (
                <div className="ms-selected-pop">{props.form[props.name]?.length}</div>
            )}
        </div>
    );
};

const ConnectedField = connect(mapStateToProps)(Field);

export default ConnectedField;
