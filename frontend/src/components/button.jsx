export function Button(props) {
  return (
    <>
      <button onClick={props.onclick} className={props.class}>
        {props.text}
      </button>
    </>
  );
}
