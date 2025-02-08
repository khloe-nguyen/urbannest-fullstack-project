import React, { useEffect, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import styled from "styled-components";
import { Range } from "react-range";
import RangeSlider from "./RangeSlider";
import PropertyType from "./PropertyType";
import { RoomAndBed } from "./RoomAndBed";
import { Options } from "./Options";
import { PropertiesRequest } from "@/feature/customer/homepage/api/propertyClientApi";
import { FilterAmenity } from "./FilterAmenity";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";

//npm add react-range

const StylePopUp = styled(PopUp)`
  width: 37rem;
  height: 90vh;
  overflow-y: auto;
  padding: 0;
`;

const StyleTitle = styled.div`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid lightgray;
  position: sticky; /* Đổi thành sticky */
  top: 0; /* Dính vào đầu */
  background-color: white; /* Đảm bảo nền cho phần dính */
  z-index: 10; /* Đảm bảo phần này nằm trên các phần khác */
`;

const StyleSubmit = styled.div`
  position: sticky; /* Đổi thành sticky */
  bottom: 0; /* Dính vào cuối */
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid lightgray;
  background-color: white; /* Đảm bảo nền cho phần dính */
  z-index: 10; /* Đảm bảo phần này nằm trên các phần khác */
`;
const StyleBody = styled.div`
  padding: 0 2rem;
`;
const StyleShowButton = styled.div`
  padding: 1rem 1rem;
  border-radius: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
`;
const StyleClearAll = styled.div`
  padding: 1rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f5f0f0;
  }
`;

export const FilterPopUp = ({
  properties,
  selectedAmenity,
  selectedPropertyType,
  isInstant,
  isPetAllow,
  isSelfCheckin,
  selectedPrice,
  selectedRoom,
  selectedBed,
  selectedBathRoom,
  setSelectedAmenity,
  setSelectedPropertyType,
  setIsInstant,
  setIsPetAllow,
  setIsSelfCheckin,
  setSelectedPrice,
  setSelectedRoom,
  setSelectedBed,
  setSelectedBathRoom,
  action,
}) => {
  // const [priceRange, setPriceRange] = useState(selectedPrice);

  //CLEAR ALL
  const HandleClear = () => {
    setSelectedAmenity([]);
    setSelectedPropertyType(null);
    setIsInstant(null);
    setIsPetAllow(null);
    setIsSelfCheckin(null);
    setSelectedPrice([0, 1000]);
    setSelectedRoom(1);
    setSelectedBed(1);
    setSelectedBathRoom(1);
  };
  const HandleSubmit = () => {
    action();
  };

  return (
    <StylePopUp action={action}>
      <StyleTitle>Filters</StyleTitle>
      <StyleBody>
        <PropertyType
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
        />
        <RangeSlider
          min={0}
          max={1000}
          step={0.1}
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          onChange={(value) => {
            setSelectedPrice(value);
          }}
        />
        <RoomAndBed
          selectedRoom={selectedRoom}
          selectedBed={selectedBed}
          selectedBathRoom={selectedBathRoom}
          setSelectedRoom={setSelectedRoom}
          setSelectedBed={setSelectedBed}
          setSelectedBathRoom={setSelectedBathRoom}
        />
        <FilterAmenity selectedAmenity={selectedAmenity} setSelectedAmenity={setSelectedAmenity} />
        <Options
          isInstant={isInstant}
          isPetAllow={isPetAllow}
          isSelfCheckin={isSelfCheckin}
          setIsInstant={setIsInstant}
          setIsPetAllow={setIsPetAllow}
          setIsSelfCheckin={setIsSelfCheckin}
        />
      </StyleBody>
      <StyleSubmit>
        <StyleClearAll onClick={() => HandleClear()}>Clear all</StyleClearAll>
        <StyleShowButton onClick={() => HandleSubmit()}>
          Show {properties.isSuccess && properties.data.pages[0].totalCount} places
        </StyleShowButton>
      </StyleSubmit>
    </StylePopUp>
  );
};
