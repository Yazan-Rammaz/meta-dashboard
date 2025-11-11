import ToolTip from '@/ui/Tooltip';
import Trans from '@/utils/translation_util';

function WorkFormIcon(props) {
  return (
    <div style={{ marginRight: '20px' }} className="icon-lang">
      <ToolTip text={Trans('Work Forms')}>
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
          <g id="Mask_Group_117" data-name="Mask Group 117">
            <path
              id="office-push-pin"
              d="M14.82,4.3,10.637.113a.387.387,0,0,0-.547,0l-.018.018a1.357,1.357,0,0,0-.228,1.617L5.468,5.5a1.826,1.826,0,0,0-2.507.072L2.935,5.6a.387.387,0,0,0,0,.547L5.44,8.655,3,11.095c-.049.05-1.2,1.241-1.963,2.188-.723.9-.866,1.067-.874,1.076a.387.387,0,0,0,.546.546c.006-.006.168-.146,1.076-.874.947-.759,2.137-1.915,2.191-1.967L6.413,9.627,8.784,12a.387.387,0,0,0,.547,0l.026-.026a1.826,1.826,0,0,0,.072-2.507l3.756-4.376A1.357,1.357,0,0,0,14.8,4.861l.018-.018A.387.387,0,0,0,14.82,4.3Z"
              fill="#8E8E8E"
            />
          </g>
        </svg>
      </ToolTip>
    </div>
  );
}

export default WorkFormIcon;
