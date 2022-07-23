import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoadableAuth from "../auth/components/LoadableAuth";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<h1>Default</h1>} />
                    <Route path="auth">
                        <Route path=":action" element={<LoadableAuth />} />
                        <Route index element={<h1>Not Found</h1>} />
                    </Route>
                    <Route path="*" element={<h1>Not Found</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
