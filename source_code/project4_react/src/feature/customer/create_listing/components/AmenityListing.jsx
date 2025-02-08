import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AmenityRequest } from "@/shared/api/amenityClientAp";
import { useEffect } from "react";

const Container = styled.div``;

const Header = styled.div`
  margin-bottom: 1.5rem;

  p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const Right = styled.div`
  position: sticky;
  top: 0;

  height: fit-content;

  > div {
    padding: 2rem;

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const AmenityContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const AmenityItem = styled.button`
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  padding: 20px 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);

  > div {
    width: 30px;
  }

  &:hover {
    border: 2px solid black;
  }

  ${(props) => {
    if (props.$active == true) {
      return css`
        border: 2px solid black;
      `;
    }
  }}

  ${(props) => {
    if (props.$unavailable == true) {
      return css`
        text-decoration: line-through;
      `;
    }
  }}
`;

export default function AmenityListing() {
  const [state, dispatch, ACTIONS] = useOutletContext();
  const amenity = AmenityRequest();

  useEffect(() => {
    console.log(state);
  }, []);

  return (
    <>
      <Container>
        <Header>
          <h2>Tell guests what your place has to offer</h2>
          <p>You can add more amenities after you publish your listing.</p>
        </Header>
        <Body>
          <Left>
            {amenity.isSuccess &&
              amenity.data.data
                .reduce((prev, current) => {
                  if (!prev.includes(current.type)) {
                    prev.push(current.type);
                    return prev;
                  } else {
                    return prev;
                  }
                }, [])
                .map((type, typeIndex) => {
                  return (
                    <div key={typeIndex}>
                      <h2>{type}</h2>
                      <AmenityContainer>
                        {amenity.data.data
                          .filter((amenityItem) => amenityItem.type == type)
                          .filter(
                            (amenity) =>
                              amenity.status == true || state.propertyAmenities.includes(amenity.id)
                          )
                          .map((amenityItem, index) => (
                            <AmenityItem
                              $unavailable={
                                amenityItem.status == false &&
                                state.propertyAmenities.includes(amenityItem.id)
                              }
                              $active={state.propertyAmenities.includes(amenityItem.id)}
                              onClick={() => {
                                if (!state.propertyAmenities.includes(amenityItem.id)) {
                                  dispatch({
                                    type: ACTIONS.CHANGE_PROPERTY_AMENITIES,
                                    next: [...state.propertyAmenities, amenityItem.id],
                                  });
                                } else {
                                  dispatch({
                                    type: ACTIONS.CHANGE_PROPERTY_AMENITIES,
                                    next: state.propertyAmenities.filter(
                                      (item) => item != amenityItem.id
                                    ),
                                  });
                                }
                              }}
                              key={index}
                            >
                              <div>
                                <img src={amenityItem.image} />
                              </div>
                              {amenityItem.name}
                            </AmenityItem>
                          ))}
                      </AmenityContainer>
                    </div>
                  );
                })}
          </Left>
          <Right></Right>
        </Body>
      </Container>
    </>
  );
}
