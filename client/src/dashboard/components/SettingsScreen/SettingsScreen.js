import React from "react";

import ProjectSettings from "./ProjectSettings";
import AuthSettings from "./AuthSettings";

const SettingsScreen = (props) => {
    return (
        <div className="main-container">
            <div className="settings-container">
                <ProjectSettings />
                <AuthSettings />
            </div>
        </div>
    );
};

export default SettingsScreen;
