import styled from "styled-components";
import { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import Radio from "@/shared/components/Input/RadioInput";
import Avatar from "react-avatar";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  h4 {
    font-size: 18px;
  }
`;

const BodyStyled = styled.div`
  padding: 1rem 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h4 {
    font-size: 17px;
    font-weight: 600;
    padding: 0.5rem 0;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    > div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`;

export default function DiscountListingSelectionPopUp({
  action,
  listings,
  chosenProperty,
  setChosenProperty,
}) {
  return (
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h4>Property list</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        {listings
          .filter(
            (property) =>
              property.status != "PENDING" &&
              property.status != "DENIED" &&
              property.status != "PROGRESS"
          )
          .map((property, index) => (
            <div key={index}>
              <div>
                <Avatar name="_" round={10} size="70" src={property.propertyImages[0]} />
                {property.propertyTitle
                  ? property.propertyTitle
                  : `Your listing started at ${formatDate(property.createdAt)}`}
              </div>
              <div>
                <InputCheckBox
                  onChange={() =>
                    setChosenProperty((prev) => {
                      if (prev.find((item) => item.id == property.id)) {
                        return prev.filter((item) => item.id != property.id);
                      }
                      return [property, ...prev];
                    })
                  }
                  checked={chosenProperty.find((item) => item.id == property.id)}
                  name={"chosenListing"}
                />
              </div>
            </div>
          ))}
      </BodyStyled>
    </PopUpStyled>
  );
}
