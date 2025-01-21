export function Heading(props) {
  return (
    <>
      <div className={props.class}>
        <h1>{props.title}</h1>
      </div>
    </>
  );
}
