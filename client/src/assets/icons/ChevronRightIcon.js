const ChevronRightIcon = (props) => (
    <svg
        width={`${props.width}`}
        height={`${props.height}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...props?.style }}
        onClick={() => props?.onClick(props?.onClickEvent)}
    >
        <g clip-path="url(#clip0_729_480)">
            <path d="M22 16L12 26L10.6 24.6L19.2 16L10.6 7.4L12 6L22 16Z" fill={`${props.color}`} />
        </g>
        <defs>
            <clipPath id="clip0_729_480">
                <rect width="32" height="32" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default ChevronRightIcon;
