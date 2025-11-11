interface AddPdfProps {
  action: () => void;
}

function AddPdf(props: AddPdfProps) {
  return (
    <svg onClick={() => props.action()} xmlns="http://www.w3.org/2000/svg" width="50" height="70" viewBox="0 0 50 70">
            <g id="Group_7761" data-name="Group 7761" transform="translate(-908 -525)">
                <g id="Rectangle_4537" data-name="Rectangle 4537" transform="translate(908 525)" fill="none" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" strokeDasharray="2 3">
                    <rect width="50" height="70" rx="10" stroke="none" />
                    <rect x="0.25" y="0.25" width="49.5" height="69.5" rx="9.75" fill="none" />
                </g>
                <g id="Group_7760" data-name="Group 7760" transform="translate(923 546)">
                    <path id="Path_19057" data-name="Path 19057" d="M-7.259-2.646V0h-.82V-7h1.924a2.539,2.539,0,0,1,1.741.547A1.953,1.953,0,0,1-3.8-4.912a2.122,2.122,0,0,1-.686,1.631,2.621,2.621,0,0,1-1.853.635Zm0-3.613v2.871H-6.4a1.921,1.921,0,0,0,1.3-.388,1.374,1.374,0,0,0,.447-1.1q0-1.387-1.641-1.387ZM-2.229,0V-7H-.3q3.7,0,3.7,3.413a3.439,3.439,0,0,1-1.028,2.6A3.813,3.813,0,0,1-.374,0Zm.82-6.26V-.742H-.364A2.966,2.966,0,0,0,1.78-1.479a2.764,2.764,0,0,0,.767-2.09q0-2.69-2.861-2.69Zm10,0H5.853v2.422H8.382V-3.1H5.853V0h-.82V-7H8.587Z" transform="translate(10 26)" fill="#8e8e8e" />
                    <path id="add-3" d="M8.824,3.81H6.19V1.176a1.191,1.191,0,0,0-2.381,0V3.81H1.176a1.191,1.191,0,0,0,0,2.381H3.81V8.824a1.191,1.191,0,0,0,2.381,0V6.19H8.824a1.191,1.191,0,0,0,0-2.381Z" transform="translate(5)" fill="#8e8e8e" />
                </g>
            </g>
        </svg>
  )
}
export default AddPdf