import React from "react";

function ElectionIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ? props.width : "77"}
      height={props.height ? props.height : "47"}
      fill="none"
      viewBox={`0 0 ${props.width ? props.width : 77} ${props.height ? props.height : 47}`}
    >
      <path
        // stroke={"#323232"}
        stroke={props.color ? props.color : '#323232'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="2"
        d="M48.436 23.912c5.258 0 9.521-4.43 9.521-9.894 0-5.465-4.263-9.895-9.521-9.895-5.259 0-9.522 4.43-9.522 9.895 0 5.464 4.263 9.894 9.522 9.894zM7.452 32.673l13.133-9.5s3.085-2.047 5.12 0c2.036 2.047 20.61 19.413 20.61 19.413s2.194 2.51 5.517 0c2.624-1.982 17.716-15.718 17.716-15.718"
      ></path>
    </svg>
  );
}

export default ElectionIcon;
