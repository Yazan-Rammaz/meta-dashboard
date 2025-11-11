import ToolTip from '@/ui/Tooltip';
import Trans from '@/utils/translation_util';

function DepartmentIcon(props) {
  return (
    <div style={{ marginRight: '20px' }} className="icon-lang">
      <ToolTip text={Trans('Departments')}>
        <svg
          className={`${props.active && 'activated-hrm'}`}
          id="_15x15_photo_back"
          data-name="15x15 photo back"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="15"
          height="15"
          viewBox="0 0 15 15"
        >
          <defs></defs>
          <g id="Mask_Group_118" data-name="Mask Group 118">
            <g id="sitemap">
              <g id="Group_7603" data-name="Group 7603">
                <path
                  id="Path_18879"
                  data-name="Path 18879"
                  d="M14.219,10.171h-.435V8.48a1.211,1.211,0,0,0-1.21-1.21H7.929V5.443h2.189a.633.633,0,0,0,.633-.633V2.173a.633.633,0,0,0-.633-.633H4.881a.633.633,0,0,0-.633.633V4.81a.633.633,0,0,0,.633.633H7.071V7.27H2.425a1.211,1.211,0,0,0-1.21,1.21v1.691H.781A.781.781,0,0,0,0,10.952V12.68a.781.781,0,0,0,.781.781H2.509a.781.781,0,0,0,.781-.781V10.952a.781.781,0,0,0-.781-.781H2.074V8.48a.352.352,0,0,1,.351-.351H7.071v2.043H6.636a.781.781,0,0,0-.781.781V12.68a.781.781,0,0,0,.781.781H8.364a.781.781,0,0,0,.781-.781V10.952a.781.781,0,0,0-.781-.781H7.929V8.128h4.645a.352.352,0,0,1,.351.351v1.691h-.435a.781.781,0,0,0-.781.781V12.68a.781.781,0,0,0,.781.781h1.728A.781.781,0,0,0,15,12.68V10.952A.781.781,0,0,0,14.219,10.171Z"
                  fill="#8e8e8e"
                />
              </g>
            </g>
          </g>
        </svg>
      </ToolTip>
    </div>
  );
}

export default DepartmentIcon;
