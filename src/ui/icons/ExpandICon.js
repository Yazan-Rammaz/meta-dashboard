function ExpandICon(props) {
  return (
    <div onClick={() => props.setExpand()} className='expand-cont'>
      <svg className={`${props.expand && "rotate-icon"} expand-icon`} xmlns="http://www.w3.org/2000/svg" width="3.194" height="7.387" viewBox="0 0 3.194 7.387">
        <path id="Path_16054" data-name="Path 16054" d="M0,0,2,2.95,0,6" transform="translate(0.694 0.694)" fill="none" stroke="#8e8e8e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" />
      </svg>
    </div>

  )
}

export default ExpandICon