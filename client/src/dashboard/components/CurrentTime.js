import React, { useState, useEffect } from "react";
import moment from "moment";

const CurrentTime = () => {
    const [time, setTime] = useState(moment());

    useEffect(() => {
        let timer = setInterval(() => setTime(moment(), 1000));

        return () => {
            clearInterval(timer);
        };
    });

    return (
        <div className="card-container">
            <div className="card-title">Time</div>
            <div className="card-title" style={{ fontWeight: "600" }}>
                {time.format("h:mm A - D MMM'YY")}
            </div>
        </div>
    );
};

export default CurrentTime;
