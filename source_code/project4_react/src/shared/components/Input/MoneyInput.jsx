import React from "react";
import styled from "styled-components";
import { useState } from "react";

const Input = styled.input`
  padding: 8px;
  border-radius: 3px;
  width: 100%;

  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }

  &:active {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }
`;

const regex = /^-?\d+(\.\d+)?$/;

export default function MoneyInput({ state, setState, placeholder }) {
  const [display, setDisplay] = useState("");

  const handleBlur = () => {
    setState("displayState");
  };

  return <Input placeholder={placeholder} value={display} onChange={setDisplay} />;
}
