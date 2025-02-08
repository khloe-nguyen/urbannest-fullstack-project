import "./radio.css";

function Radio({ name, checked, onChange }) {
  return (
    <label className="radio-button">
      <input type="radio" name={name} onChange={() => {}} checked={checked} />
      <span onClick={onChange} className="label-visible">
        <span className="fake-radiobutton"></span>
      </span>
    </label>
  );
}

export default Radio;
