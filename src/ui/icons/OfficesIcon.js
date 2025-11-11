import ToolTip from '@/ui/Tooltip';
import Trans from '@/utils/translation_util';

function OfficesIcon(props) {
  return (
    <div style={{ marginRight: '20px' }} className="icon-lang">
      <ToolTip text={Trans('Offices')}>
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
          <g id="Mask_Group_122" data-name="Mask Group 122">
            <g id="business-and-trade" transform="translate(0 -0.055)">
              <path
                id="Path_18896"
                data-name="Path 18896"
                d="M8.144,1.169,1.275.125A1.108,1.108,0,0,0,.387.369,1.118,1.118,0,0,0,0,1.206V14.375A.627.627,0,0,0,.625,15H2.656V11.719A1.091,1.091,0,0,1,3.75,10.625H5.313a1.091,1.091,0,0,1,1.094,1.094V15H9.063V2.25a1.094,1.094,0,0,0-.919-1.081ZM3.437,9.219H2.5a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H2.5a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H2.5a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H2.5a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938ZM6.563,9.219H5.625a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H5.625a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H5.625a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875H5.625a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Z"
                fill="#8E8E8E"
              />
              <path
                id="Path_18897"
                data-name="Path 18897"
                d="M14.138,6.776l-4.45-.932V15h4.219A1.1,1.1,0,0,0,15,13.906V7.845A1.088,1.088,0,0,0,14.138,6.776Zm-1.481,6.349h-.937a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875h-.937a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Zm0-1.875h-.937a.469.469,0,0,1,0-.937h.938a.469.469,0,0,1,0,.938Z"
                fill="#8E8E8E"
              />
            </g>
          </g>
        </svg>
      </ToolTip>
    </div>
  );
}

export default OfficesIcon;
