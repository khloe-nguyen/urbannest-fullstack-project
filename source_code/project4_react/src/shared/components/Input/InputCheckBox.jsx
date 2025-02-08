import "./checkbox.css";

export default function InputCheckBox({ checked, onChange, readOnly }) {
  return (
    <div className="checkbox-wrapper-13">
      <input readOnly={readOnly} checked={checked} onChange={onChange} id="c1-13" type="checkbox" />
    </div>
  );
}
