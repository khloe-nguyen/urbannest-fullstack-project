import { useEffect, useState } from "react";
import styled from "styled-components";
import { AmenityRequest } from "../../../shared/api/amenityClientAp";
import { css } from "styled-components";
import React from "react";

const StyleTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;
const StyleLitteTitle = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 600;
`;

const StyleItem = styled.div`
  display: inline-flex;
  flex-direction: row;
  margin: 0.5rem 0%.5rem;
  margin-right: 0.5rem;
  width: fit-content;
  border-radius: 30px;
  outline: 1px solid lightgray;
  padding: 0.7rem 1rem;
  cursor: pointer;
  align-items: center;

  &:hover {
    outline: 2px solid black;
  }

  ${(props) =>
    props.selected &&
    css`
      outline: 2px solid black;
    `}

  > div:nth-child(1) {
    //style image
    margin: 0 auto;
    width: 1.5rem;
  }
  > div:nth-child(2) {
    //style name
    margin: 0 auto;

    padding: 0.5rem;
  }
`;

export const FilterAmenity = ({ selectedAmenity, setSelectedAmenity }) => {
  const amenities = AmenityRequest();

  const handleClick = (amenityID) => {
    setSelectedAmenity((prevSelectedItems) => {
      // Kiểm tra xem amenity đã được chọn chưa
      if (prevSelectedItems.includes(amenityID)) {
        // Nếu đã chọn, loại bỏ nó
        return prevSelectedItems.filter((item) => item !== amenityID);
      } else {
        // Nếu chưa chọn, thêm nó vào danh sách đã chọn
        return [...prevSelectedItems, amenityID];
      }
    });
  };

  useEffect(() => {
    if (amenities.isSuccess) {
      // console.log(
      //   amenities.data.data.reduce((prev, item) => {
      //     if (!prev.includes(item.type)) {
      //       prev.push(item.type);
      //     }
      //     return prev;
      //   }, [])
      // );
    }
  }, [amenities.isSuccess]); //amenities.isSuccess có 2 trạng thái là true/false nên useEffect sẽ chạy 2 lần, nên phải check thêm if(true) thì mới thực hiện xxx

  return (
    <div>
      <StyleTitle>Amenity</StyleTitle>
      <div>
        {amenities.isSuccess &&
          amenities.data.data
            .reduce((prev, item) => {
              if (!prev.includes(item.type)) {
                prev.push(item.type);
              }
              return prev;
            }, [])
            .map((type, index) => {
              return (
                <React.Fragment key={index}>
                  <StyleLitteTitle>{type}</StyleLitteTitle>
                  {amenities.data.data
                    .filter((amenity) => amenity.type === type)
                    .map((amenity, index) => {
                      return (
                        <StyleItem
                          onClick={() => handleClick(amenity.id)}
                          selected={selectedAmenity.includes(amenity.id)} // Kiểm tra nếu amenity có trong selectedItems
                          key={index}
                        >
                          <div>
                            <img src={amenity.image} alt={amenity.name} />
                          </div>
                          <div> {amenity.name}</div>
                        </StyleItem>
                      );
                    })}
                </React.Fragment>
              );
            })}
      </div>
    </div>
  );
};
