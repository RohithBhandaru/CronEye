import React from "react";
import ContentLoader from "react-content-loader";

const JobsSnapshotSkeletonLoader = (props) => (
    <ContentLoader
        speed={2}
        viewBox={`0 0 ${props.width} ${props.height}`}
        backgroundColor="#ededeb"
        foregroundColor="#d1d0cd"
        {...props}
    >
        <rect x="10" y="15" rx="5" ry="5" width="10%" height="20" />
        <rect x="10" y="40" rx="5" ry="5" width="5%" height="15" />
        <rect x="15%" y="15" rx="5" ry="5" width="85%" height="40" />
    </ContentLoader>
);

export default JobsSnapshotSkeletonLoader;
