const ErrorStatusUnfilledIcon = (props) => (
    <svg
        width={`${props.width}`}
        height={`${props.height}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clip-path="url(#clip0_70_708)">
            <path
                d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z"
                fill="#B50808"
            />
        </g>
        <defs>
            <clipPath id="clip0_70_708">
                <rect width={`${props.width}`} height={`${props.height}`} fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default ErrorStatusUnfilledIcon;
