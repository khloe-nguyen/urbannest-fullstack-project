import React from "react";
import "./switch.css";

export default function Switch({ state, setState }) {
  return (
    <label className="switch-btn">
      <input
        type="checkbox"
        defaultChecked={true}
        checked={state}
        value={state}
        onChange={setState}
      />
      <span></span>
    </label>
  );
}
