import { useState } from "react";
import styled from "styled-components";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { PiLightningFill } from "react-icons/pi";
import { PiLightningSlashBold } from "react-icons/pi";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import TextEditor from "@/shared/components/editor/TextEditor";

const Container = styled.div`
  padding: 1rem 3rem 0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  & svg {
    color: yellow;
    font-size: 20px;
  }
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

const RightStyled = styled.div`
  display: flex;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    padding-right: 5rem;
  }

  > div:nth-of-type(2) {
    h4 {
      color: red;
      font-size: 17px;
    }
  }

  > div:nth-of-type(1) {
    gap: 1rem;
  }

  & p {
    text-decoration: underline;
    font-size: 17px;
  }
`;

const ButtonContainerStyled = styled.div`
  > button {
    background-color: white;
    border: none;
    cursor: pointer;
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 15px;
    color: white;
    background-color: black;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

export default function CreateListingHeader({ state, listing }) {
  const [viewSuggestion, setViewSuggestion] = useState(false);

  return (
    <>
      <Container>
        <h1>
          {state.propertyTitle
            ? state.propertyTitle
            : `Your new listing started at ${formatDate(listing.data.data.createdAt)}`}
        </h1>
        <RightStyled>
          <ButtonContainerStyled>
            {" "}
            {listing.data.data.suggestion && (
              <button onClick={() => setViewSuggestion(true)}>View suggestion</button>
            )}
          </ButtonContainerStyled>
          <div>
            {state.bookingType && (
              <>
                {state.bookingType == "instant" ? <PiLightningFill /> : <PiLightningSlashBold />}
                <p>Instant book {state.bookingType == "instant" ? "on" : "off"}</p>
              </>
            )}
          </div>

          <div>
            <Active /> <h4>{listing.data.data.status}</h4>
          </div>
        </RightStyled>
      </Container>
      {viewSuggestion && (
        <SuggestionPopUp
          suggestion={listing.data.data.suggestion}
          action={() => setViewSuggestion(false)}
        />
      )}
    </>
  );
}

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
`;

const SuggestionContainerStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 15px;
  min-height: 15rem;
`;

function SuggestionPopUp({ action, suggestion }) {
  const theObj = { __html: suggestion };

  return (
    <PopUpStyled>
      <HeaderStyled>
        <h4>Suggestion</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <SuggestionContainerStyled>
          <div dangerouslySetInnerHTML={theObj} />
        </SuggestionContainerStyled>
      </BodyStyled>
    </PopUpStyled>
  );
}
