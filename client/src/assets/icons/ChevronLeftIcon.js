const ChevronLeftIcon = (props) => (
    <svg
        width={`${props.width}`}
        height={`${props.height}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...props?.style }}
        onClick={() => props?.onClick({ event_type: props?.onClickEvent })}
    >
        <g clipPath="url(#clip0_729_477)">
            <path d="M10 16L20 6L21.4 7.4L12.8 16L21.4 24.6L20 26L10 16Z" fill={`${props.color}`} />
        </g>
        <defs>
            <clipPath id="clip0_729_477">
                <rect width="32" height="32" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default ChevronLeftIcon;
