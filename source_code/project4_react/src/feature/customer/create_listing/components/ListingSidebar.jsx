import styled, { css } from "styled-components";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & button {
    cursor: pointer;
  }

  position: sticky;
  top: 0;
`;

const Item = styled.div`
  cursor: pointer;
  > button {
    background-color: white;
    border: none;
    font-weight: 600;
  }

  ${(props) => {
    if (props.$active) {
      return css`
        > button {
          background-color: #f3f3f3;
        }
      `;
    }
  }}
`;

const ItemDropDown = styled.div`
  > button {
    background-color: white;
    border: none;
    font-weight: 600;
  }

  ${(props) => {
    if (props.$active) {
      return css`
        > button {
          background-color: #f3f3f3;
        }
      `;
    }
  }}
`;

const DropDown = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
  padding: 20px 0;

  > button {
    text-align: left;
    padding: 10px 0;
    padding-left: 2rem;
    background-color: white;
    border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

const DropDownButton = styled.button`
  display: grid;
  grid-template-columns: 2fr 4fr;
  align-items: center;
  gap: 2rem;

  ${(props) => {
    if (props.$active == true) {
      return css`
        font-weight: 600;
        border-left: 2px solid black !important;
      `;
    }
  }}
`;

const Active = styled.span`
  &::before {
    background-color: red;
    border-color: #78d965;
    box-shadow: 0px 0px 6px 1.5px #94e185;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

export default function ListingSidebar({ listing, state }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropDown, setIsDropDOwn] = useState(true);

  return (
    <Container>
      <Item $active={location.pathname == `/become_a_host/${listing.data.data.id}`}>
        <button onClick={() => navigate("/become_a_host/" + listing.data.data.id)}>Overview</button>
      </Item>
      <ItemDropDown $active={isDropDown}>
        <button onClick={() => setIsDropDOwn((prev) => !prev)}>Listing details</button>
        {isDropDown && (
          <DropDown>
            <DropDownButton
              $active={location.pathname.includes("category")}
              onClick={() => navigate(listing.data.data.id + "/category")}
            >
              <span> Category</span>
              {(state.propertyType == null || state.propertyCategoryID == null) && <Active />}
            </DropDownButton>
            <DropDownButton
              $active={location.pathname.includes("location")}
              onClick={() => navigate(listing.data.data.id + "/location")}
            >
              <span>Location</span>
              {(!state.addressCode || !state.addressDetail || !state.coordinatesX) && <Active />}
            </DropDownButton>
            <DropDownButton
              $active={location.pathname.includes("basic")}
              onClick={() => navigate(listing.data.data.id + "/basic")}
            >
              <span>Listing basics</span>
              {(state.maximumGuest == 0 ||
                state.numberOfBathRoom == 0 ||
                state.numberOfBed == 0) && <Active />}
            </DropDownButton>
            <DropDownButton
              $active={location.pathname.includes("detail")}
              onClick={() => navigate(listing.data.data.id + "/detail")}
            >
              <span>Listing details</span>
              {(state.propertyTitle.length == 0 || state.aboutProperty.length == 0) && <Active />}
            </DropDownButton>
            <DropDownButton
              $active={location.pathname.includes("amenity")}
              onClick={() => navigate(listing.data.data.id + "/amenity")}
            >
              <span>Amenities</span> {state.propertyAmenities.length == 0 && <Active />}
            </DropDownButton>
            <DropDownButton
              $active={location.pathname.includes("photo")}
              onClick={() => navigate(listing.data.data.id + "/photo")}
            >
              <span>Photos</span> {state.propertyImages.length < 5 && <Active />}
            </DropDownButton>
            {/* <DropDownButton>Accessibility</DropDownButton>
            <DropDownButton>Guest safety</DropDownButton> */}
          </DropDown>
        )}
      </ItemDropDown>
      <Item $active={location.pathname.includes("pricing")}>
        <button onClick={() => navigate(listing.data.data.id + "/pricing")}>
          Pricing and availability
        </button>
      </Item>
      <Item $active={location.pathname.includes("policy")}>
        <button onClick={() => navigate(listing.data.data.id + "/policy")}>
          Policies and rules
        </button>
      </Item>
    </Container>
  );
}
