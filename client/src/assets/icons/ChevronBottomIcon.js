const ChevronBottomIcon = (props) => (
    <svg
        width={`${props.width}`}
        height={`${props.height}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_513_99)">
            <path d="M16 22L6 12L7.4 10.6L16 19.2L24.6 10.6L26 12L16 22Z" fill={`${props.color}`} />
        </g>
        <defs>
            <clipPath id="clip0_513_99">
                <rect width="32" height="32" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default ChevronBottomIcon;
