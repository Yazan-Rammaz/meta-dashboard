function FillIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <g id="Group_4787" data-name="Group 4787" transform="translate(-1071 -198)">
        <g id="Rectangle_4623" data-name="Rectangle 4623" transform="translate(1071 198)" fill="#404040" stroke="#404040" strokeWidth="1">
          <rect width="50" height="50" rx="10" stroke="none" />
          <rect x="0.5" y="0.5" width="49" height="49" rx="9.5" fill="none" />
        </g>
        <text id="AR" transform="translate(1076 202)" fill="#f7f7f7" fontSize="31" letterSpacing="0.02em">
          <tspan x="0" y="33">{props.icon}</tspan></text>
      </g>
    </svg>

  )
}

export default FillIcon