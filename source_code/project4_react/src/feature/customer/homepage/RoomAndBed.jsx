import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

const StyleTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;
const StyleItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0;
`;

const StyleQuantity = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 1rem;
  }
`;

const StyleButtonLeft = styled.button`
  background: none;
  padding: 0.5rem;

  border: 0.5px gray solid;
  border-radius: 50%;

  cursor: pointer;
  color: #333;

  display: ${(props) => (props.hidden ? "none" : "block")};
  transition: display 1s ease;

  &:hover {
    box-shadow: 0px 10px 20px #dadada;
  }
`;

const StyleButtonRight = styled(StyleButtonLeft)``;

export const RoomAndBed = ({
  selectedRoom,
  selectedBed,
  selectedBathRoom,
  setSelectedRoom,
  setSelectedBed,
  setSelectedBathRoom,
}) => {
  const [quantities, setQuantities] = useState({
    Rooms: selectedRoom,
    Bedrooms: selectedBed,
    Bathrooms: selectedBathRoom,
  });

  //key (name), delta (amount to change)
  const updateQuantity = (key, delta) => {
    setQuantities((prev) => ({
      //this callback receive receives the previous state (prev)
      ...prev, // Spread operator to copy all current key-value pairs, ensures all other properties in the quantities object remain unchanged.
      [key]: prev[key] + delta, // Update  specific key with new value
    }));
    if (key == "Rooms") {
      setSelectedRoom(quantities[key] + delta);
    } else if (key == "Bedrooms") {
      return setSelectedBed(quantities[key] + delta);
    } else {
      return setSelectedBathRoom(quantities[key] + delta);
    }
  };

  //to update clearAll
  useEffect(() => {
    setQuantities({
      Rooms: selectedRoom,
      Bedrooms: selectedBed,
      Bathrooms: selectedBathRoom,
    });
  }, [selectedRoom, selectedBed, selectedBathRoom]);

  //   Calling Object.entries(quantities) would result in:
  // [
  //   ["Rooms", 1],
  //   ["Bedrooms", 2],
  //   ["Bathrooms", 3],
  // ]

  return (
    <div>
      <StyleTitle>Rooms And Beds</StyleTitle>
      {Object.entries(quantities).map(([key, value]) => (
        <StyleItem key={key}>
          <div>{key}</div>
          <StyleQuantity>
            <StyleButtonLeft
              onClick={() => updateQuantity(key, -1)}
              hidden={value === 1}
            >
              <FiMinus />
            </StyleButtonLeft>
            <p>{value}+</p>
            <StyleButtonRight
              onClick={() => updateQuantity(key, 1)}
              hidden={value === 16}
            >
              <FiPlus />
            </StyleButtonRight>
          </StyleQuantity>
        </StyleItem>
      ))}
    </div>
  );
};
