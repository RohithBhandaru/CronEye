import React from "react";

const FlashMessage = (props) => {
    return (
        props.flash && (
            <div className={`flash-msg ${props.serverMessageType}`}>
                <div className="flash-msg__msg">{props.serverMessage}</div>
                <div className="flash-msg-modal-close" onClick={() => props.toggleFlash(false)}>
                    &times;
                </div>
            </div>
        )
    );
};

export default FlashMessage;
