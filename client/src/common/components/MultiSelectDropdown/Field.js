import React, { useState } from "react";

import Dropdown from "./Dropdown";

const Field = ({ name }) => {
    const [modal, toggleModal] = useState(false);

    return (
        <div>
            <div className="ms-field" onClick={() => toggleModal(true)}>
                Select {name}
            </div>
            {modal && <Dropdown name={name} toggleModal={toggleModal} />}
        </div>
    );
};

export default Field;
