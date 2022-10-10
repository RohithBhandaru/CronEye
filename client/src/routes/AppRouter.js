import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoadableAuth from "../auth/components/LoadableAuth";
import HomeLayout from "../common/components/HomeLayout";
import ProtectedLayout from "../dashboard/components/ProtectedLayout";
import Analytics from "../dashboard/components/SnapshotScreen/AnalyticsScreen";
import Logs from "../dashboard/components/LogsScreen/LogsScreen";
import Settings from "../dashboard/components/SettingsScreen/SettingsScreen";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<h1>Default</h1>} />
                    <Route path="auth" element={<HomeLayout />}>
                        <Route path=":action" element={<LoadableAuth />} />
                        <Route index element={<h1>Not Found</h1>} />
                    </Route>
                    <Route path="dashboard" element={<ProtectedLayout />}>
                        <Route path="logs" element={<Logs />} />
                        <Route path="snapshot" element={<Analytics />} />
                    </Route>
                    <Route path="settings" element={<ProtectedLayout />}>
                        <Route index element={<Settings />} />
                    </Route>
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
