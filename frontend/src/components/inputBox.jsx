export function InputBox(props) {
  return (
    <>
      <div className="text-start m-1.5 mb-4">
        <label className=" -semibold">
          {props.inputHead}
          <div>
            <input
              onChange={(e) => {
                props.set(e.target.value);
              }}
              className="border border-gray-200 rounded-md pl-2 p-1 w-72 shadow-sm m-1 ml-0"
              type="text"
              placeholder={props.placehead}
            ></input>
          </div>
        </label>
      </div>
    </>
  );
}
