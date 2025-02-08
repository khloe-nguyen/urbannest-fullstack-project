import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";

const IoMdCloseStyled = styled(IoMdClose)`
  cursor: pointer;
  height: 1.7rem;
  width: 1.7rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  border-radius: 50%;
`;

export default function XButton({ action, className }) {
  return <IoMdCloseStyled className={className} onClick={action} />;
}
