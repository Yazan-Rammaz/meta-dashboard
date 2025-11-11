import ToolTip from '@/ui/Tooltip';
import Trans from '@/utils/translation_util';

function RolesIcon(props) {
  return (
    <div style={{ marginRight: '20px' }} className="icon-lang">
      <ToolTip text={Trans('Roles')}>
        <svg
          id="_15x15_photo_back"
          className={`${props.active && 'activated-hrm'}`}
          data-name="15x15 photo back"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="15"
          height="15"
          viewBox="0 0 15 15"
        >
          <g id="Mask_Group_278" data-name="Mask Group 278">
            <g id="form" transform="translate(-0.5 -0.5)">
              <path
                id="Path_21279"
                data-name="Path 21279"
                d="M1.665,2.99v8.955a2.5,2.5,0,0,0,2.49,2.49h3.37a3.508,3.508,0,0,1,.3-1,3.816,3.816,0,0,1,2.04-1.96A2.448,2.448,0,0,1,8.8,9.455,2.477,2.477,0,0,1,11.28,6.98a2.359,2.359,0,0,1,.7.105,2.452,2.452,0,0,1,1,.58V2.99A2.49,2.49,0,0,0,10.5.5H4.155a2.493,2.493,0,0,0-2.49,2.49Zm3.02-.01h5.28a.5.5,0,0,1,0,1H4.685a.5.5,0,0,1,0-1Zm0,2.66h5.28a.5.5,0,0,1,0,1H4.685a.5.5,0,0,1,0-1Zm0,2.655h2.4a.5.5,0,0,1,0,1h-2.4a.5.5,0,0,1,0-1Z"
                fill="#8e8e8e"
              />
              <circle
                id="Ellipse_370"
                data-name="Ellipse 370"
                cx="1.725"
                cy="1.725"
                r="1.725"
                transform="translate(9.555 7.73)"
                fill="#8e8e8e"
              />
              <path
                id="Path_21280"
                data-name="Path 21280"
                d="M8.73,15.5h5.1a.5.5,0,0,0,.5-.5A3.053,3.053,0,1,0,8.23,15a.5.5,0,0,0,.5.5Z"
                fill="#8e8e8e"
              />
            </g>
          </g>
        </svg>
      </ToolTip>
    </div>
  );
}

export default RolesIcon;
