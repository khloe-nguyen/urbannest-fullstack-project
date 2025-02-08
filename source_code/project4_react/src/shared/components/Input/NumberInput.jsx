import styled from "styled-components";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const Input = styled.input`
  padding: 8px;
  border-radius: 3px;
  width: 100%;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

const regex = /^-?\d+(\.\d+)?$/;

export default function NumberInput({
  state,
  min,
  max,
  setState,
  placeholder,
  readOnly,
  className,
}) {
  const [fakeText, setFakeText] = useState(state);
  const [isChanged, setIsChanged] = useState(false);
  const timeOutRef = useRef();

  const onChange = (ev) => {
    if (timeOutRef.current != null) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = null;
    }

    const value = ev.target.value;

    if (regex.test(value) || value == "") {
      setFakeText(value);
    }

    timeOutRef.current = setTimeout(() => {
      if (regex.test(value) || value == "") {
        setState(value);
        setIsChanged(true);
      }
    }, 500);
  };

  useEffect(() => {
    if (isChanged) {
      setFakeText(state);
      setIsChanged(false);
    }
  }, [isChanged, state]);

  return (
    <Input
      min={min}
      max={max}
      className={className}
      readOnly={readOnly}
      placeholder={placeholder}
      value={fakeText}
      onChange={onChange}
    />
  );
}
