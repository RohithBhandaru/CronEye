import React, { Suspense } from "react";

const Auth = React.lazy(() => import("./Auth"));

const LoadableAuth = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Auth />
            </Suspense>
        </div>
    );
};

export default LoadableAuth;
