import ToolTip from '@/ui/Tooltip';
import Trans from '@/utils/translation_util';

function JobIcon(props) {
  return (
    <div style={{ marginRight: '20px' }} className="icon-lang">
      <ToolTip text={Trans('Job Titles')}>
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
          <g id="Mask_Group_119" data-name="Mask Group 119">
            <g id="top">
              <g id="Group_7605" data-name="Group 7605">
                <g id="Group_7604" data-name="Group 7604">
                  <path
                    id="Path_18880"
                    data-name="Path 18880"
                    d="M11.875,8.125H7.5a.625.625,0,0,1,0-1.25h4.375a.625.625,0,0,1,0,1.25Z"
                    fill="#8E8E8E"
                  />
                </g>
              </g>
              <g id="Group_7607" data-name="Group 7607">
                <g id="Group_7606" data-name="Group 7606">
                  <path
                    id="Path_18881"
                    data-name="Path 18881"
                    d="M14.375,11.25H7.5A.625.625,0,0,1,7.5,10h6.875a.625.625,0,0,1,0,1.25Z"
                    fill="#8E8E8E"
                  />
                </g>
              </g>
              <g id="Group_7609" data-name="Group 7609">
                <g id="Group_7608" data-name="Group 7608">
                  <path
                    id="Path_18882"
                    data-name="Path 18882"
                    d="M11.875,14.375H7.5a.625.625,0,0,1,0-1.25h4.375a.625.625,0,0,1,0,1.25Z"
                    fill="#8E8E8E"
                  />
                </g>
              </g>
              <path
                id="Path_18883"
                data-name="Path 18883"
                d="M13.906,1.25H7.969A1.1,1.1,0,0,0,6.875,2.344V3.906A1.1,1.1,0,0,0,7.969,5h5.938A1.1,1.1,0,0,0,15,3.906V2.344A1.1,1.1,0,0,0,13.906,1.25Z"
                fill="#8E8E8E"
              />
              <path
                id="Path_18884"
                data-name="Path 18884"
                d="M5.476,2.781,3.288.75a.469.469,0,0,0-.788.344V2.5H.625a.625.625,0,0,0,0,1.25H2.5V5.156a.47.47,0,0,0,.281.43.48.48,0,0,0,.188.039A.471.471,0,0,0,3.288,5.5L5.476,3.469a.47.47,0,0,0,0-.687Z"
                fill="#8E8E8E"
              />
            </g>
          </g>
        </svg>
      </ToolTip>
    </div>
  );
}

export default JobIcon;
