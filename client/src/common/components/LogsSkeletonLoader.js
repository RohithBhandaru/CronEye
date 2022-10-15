import React from "react";
import ContentLoader from "react-content-loader";

const LogsSkeletonLoader = (props) => (
    <ContentLoader
        speed={2}
        width={"100%"}
        height={150}
        viewBox="0 0 100% 150"
        backgroundColor="#ededeb"
        foregroundColor="#d1d0cd"
        {...props}
    >
        <rect x="25" y="15" rx="5" ry="5" width="10%" height="30" />
        <rect x="calc(15% + 10px)" y="15" rx="5" ry="5" width="10%" height="30" />
        <rect x="30%" y="15" rx="5" ry="5" width="10%" height="30" />
        <rect x="calc(50% - 20px)" y="15" rx="5" ry="5" width="10%" height="30" />
        <rect x="calc(70% - 40px)" y="15" rx="5" ry="5" width="5%" height="30" />
        <rect x="calc(80% - 50px)" y="15" rx="5" ry="5" width="10%" height="30" />
    </ContentLoader>
);

export default LogsSkeletonLoader;
