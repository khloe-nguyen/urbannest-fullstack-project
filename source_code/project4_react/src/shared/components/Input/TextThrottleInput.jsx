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

export default function TextThrottleInput({
  state,
  setState,
  placeholder,
  type,
  className,
  readOnly,
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

    setFakeText(value);

    timeOutRef.current = setTimeout(() => {
      setState(value);
      setIsChanged(true);
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
      readOnly={readOnly}
      className={className}
      type={type}
      placeholder={placeholder}
      value={fakeText}
      onChange={onChange}
    />
  );
}
