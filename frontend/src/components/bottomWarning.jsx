import { Link } from "react-router-dom";

export function ButtomWarning(props) {
  return (
    <>
      <div className="text-blue-900 pt-3">
        <label>{props.warning}</label>
        <Link className="cursor-pointer underline" to={props.to}>
          {props.text}
        </Link>
      </div>
    </>
  );
}
