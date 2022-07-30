import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoadableAuth from "../auth/components/LoadableAuth";
import HomeLayout from "../common/components/HomeLayout";
import ProtectedLayout from "../dashboard/components/ProtectedLayout";
import Analytics from "../dashboard/components/Analytics";

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
                        <Route index element={<Analytics />} />
                    </Route>
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
