import React from "react";

const Option = (props) => {
    return (
        <div className="s-option" onClick={() => props?.onClick()}>
            {props.value}
        </div>
    );
};

export default Option;
