const EditIcon = (props) => (
    <svg
        width={`${props.width}`}
        height={`${props.height}`}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ ...props?.style }}
        onClick={() => props?.onClick()}
    >
        <g clip-path="url(#clip0_754_474)">
            <path d="M30 26H2V28H30V26Z" fill={`${props.color}`} />
            <path
                d="M25.4 9C26.2 8.2 26.2 7 25.4 6.2L21.8 2.6C21 1.8 19.8 1.8 19 2.6L4 17.6V24H10.4L25.4 9ZM20.4 4L24 7.6L21 10.6L17.4 7L20.4 4ZM6 22V18.4L16 8.4L19.6 12L9.6 22H6Z"
                fill={`${props.color}`}
            />
        </g>
    </svg>
);

export default EditIcon;
