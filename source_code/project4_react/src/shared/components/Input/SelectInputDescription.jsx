import React, { useRef } from "react";
import styled from "styled-components";
import Select from "react-select";
import { useEffect } from "react";

const Input = styled(Select)`
  border-radius: 3px !important;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  & * {
    cursor: pointer;
    outline: none !important;
    border: none !important;
  }
`;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "3px", // Changed to 3px
    borderColor: state.isFocused ? "#FF385C" : "rgba(0, 0, 0, 0.1)",
    boxShadow: state.isFocused ? "0 0 0 1px rgba(255, 56, 92, 0.5)" : "none",
    "&:hover": {
      borderColor: "#FF385C",
    },
    padding: "4px",
    transition: "border-color 0.3s",
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#FF385C" : "#333",
    backgroundColor: state.isFocused ? "#f7f7f7" : "#fff",
    cursor: "pointer",
    padding: "10px 20px",
    "&:hover": {
      backgroundColor: "#f7f7f7",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
};

const customOption = ({ label, description }) => (
  <div>
    <strong>{label}</strong>
    <br />
    <small style={{ color: "gray" }}>{description}</small>
  </div>
);

export default function SelectInputDescription({
  state,
  setState,
  options,
  selectRef,
  placeholder,
  className,
  isDisable,
}) {
  return (
    <Input
      styles={customStyles}
      className={className}
      placeholder={placeholder}
      ref={selectRef}
      value={state}
      onChange={setState}
      options={options}
      isSearchable
      formatOptionLabel={customOption}
      isDisabled={isDisable}
    />
  );
}
