

function OutlineIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <g id="Group_4785" data-name="Group 4785" transform="translate(-1126.434 -198)">
        <text id="AR" transform="translate(1131.434 202)" fill="#404040" fontSize="31" fontFamily="SegoeUI, Segoe UI" letterSpacing="0.02em">
          <tspan x="0" y="33">{props.icon}</tspan></text>
        <g id="Rectangle_4624" data-name="Rectangle 4624" transform="translate(1126.434 198)" fill="none" stroke="#404040" strokeWidth="1">
          <rect width="50" height="50" rx="10" stroke="none" />
          <rect x="0.5" y="0.5" width="49" height="49" rx="9.5" fill="none" />
        </g>
      </g>
    </svg>

  )
}

export default OutlineIcon