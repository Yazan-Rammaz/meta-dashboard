

function SmallIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
      <g id="Group_4782" data-name="Group 4782" transform="translate(-243 -171)">
        <rect id="Rectangle_4606" data-name="Rectangle 4606" width="15" height="15" rx="2" transform="translate(243 171)" fill="#404040" />
        <text id="AR" transform="translate(250.5 181.5)" fill="#f7f7f7" fontSize="9" letterSpacing="0.025em">
          <tspan x="-5.6" y="0">{props.icon}</tspan></text>
      </g>
    </svg>

  )
}

export default SmallIcon
