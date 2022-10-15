import React from "react";
import ContentLoader from "react-content-loader";

const SummaryCardSkeletonLoader = (props) => (
    <ContentLoader
        speed={2}
        viewBox={`0 0 ${props.width} ${props.height}`}
        backgroundColor="#ededeb"
        foregroundColor="#d1d0cd"
        {...props}
    >
        <rect x="0" y="0" rx="5" ry="5" width={props.width} height={props.height} />
    </ContentLoader>
);

export default SummaryCardSkeletonLoader;
