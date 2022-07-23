import React from "react";
import { useParams } from "react-router-dom";

import "../styles/styles.scss";

const Auth = (props) => {
    let { action } = useParams();

    return (
        <div>
            <h1>{action}</h1>
        </div>
    );
};

export default Auth;
