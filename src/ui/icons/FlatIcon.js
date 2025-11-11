

function FlatIcon(props) {
  return (
    <>
      {props.blur ?
        <svg className={`${props.blur && "blured-image"}`} xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14">
          <text id="Ar" transform="translate(0 11)" fill="#cecdcd" fontSize="10" fontFamily="SegoeUI, Segoe UI" letterSpacing="0.025em"><tspan style={{ fontSize: '10px' }} x="0" y="0">{props.icon}</tspan></text>
        </svg>

        : <svg className={`${props.blur && "blured-image"}`} xmlns="http://www.w3.org/2000/svg" width={props.thir ? "70" : "50"} height="50" viewBox={props.thir ? "0 0 70 50" : "0 0 50 50"}>
          <g id="Group_4786" data-name="Group 4786" transform="translate(-1191 -198)">
            <rect id="Rectangle_4606" data-name="Rectangle 4606" width="50" height="50" rx="10" transform="translate(1191 198)" fill="none" />
            <text id="AR" transform="translate(1196 202)" fill="#404040" fontSize="31" fontFamily="SegoeUI, Segoe UI" letterSpacing="0.02em">
              <tspan x="0" y="33" >{props.icon}</tspan></text>
          </g>
        </svg>}
    </>


  )
}

export default FlatIcon