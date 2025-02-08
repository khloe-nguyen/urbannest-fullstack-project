import React, { useState } from "react";
import styled from "styled-components";
import { css } from "styled-components";

const StyleTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const StyleProContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0;
  border-radius: 1rem;

  outline: lightgray solid 1px;
  :hover {
    background-color: #eceaea;
  }
`;

const StyleProItem = styled.div`
  margin: 0.3rem;
  padding: 1rem;
  border-radius: 1rem;
  width: 30%;

  text-align: center;
  font-weight: bold;
  cursor: pointer;
  ${(props) =>
    props.selected &&
    css`
      color: black;
      outline: 0.15rem solid black;
      
       /* Tắt hiệu ứng hover */
       &:hover {
        background-color: #fff
    `}
`;

const propertyOptions = [
  {
    value: "sharedroom",
    label: "Shared Room",
    description:
      "A budget-friendly option where guests share a space with others, featuring multiple beds and a social atmosphere.",
  },
  {
    value: "hotel",
    label: "Hotel",
    description:
      "A commercial establishment offering private rooms with amenities like en-suite bathrooms and room service, ideal for travelers seeking comfort and convenience.",
  },
  {
    value: "fullhouse",
    label: "Full House",
    description:
      "A rental providing an entire property for guests, offering privacy and home-like amenities, perfect for families or groups.",
  },
];

function PropertyType({ selectedPropertyType, setSelectedPropertyType }) {
  //handle click/unclick
  const handleClick = (pro) => {
    if (selectedPropertyType != pro.value) {
      setSelectedPropertyType(pro.value);
      return;
    }
    setSelectedPropertyType(null); //gửi đi cái null nghĩa là filter all type
  };
  return (
    <div>
      <StyleTitle>Property Type</StyleTitle>
      <StyleProContainer>
        {propertyOptions.map((pro) => (
          <StyleProItem
            key={pro.value}
            selected={selectedPropertyType == pro.value}
            onClick={() => handleClick(pro)}
          >
            {pro.label}
          </StyleProItem>
        ))}
      </StyleProContainer>
    </div>
  );
}

export default PropertyType;
