import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddMinusButton from "@/shared/components/Button/AddMinusButton";

const Container = styled.div`
  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

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

const InfoItem = styled.div`
  display: flex;
  flex-direction: row !important;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-weight: 500;
  }
`;

export default function BasicListing() {
  const [state, dispatch, ACTIONS] = useOutletContext();

  const [guests, setGuests] = useState(1);
  const [bedRooms, setBedRooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathRooms, setBathRooms] = useState(1);

  return (
    <>
      <Container>
        <Header>
          <h2>How many guests can your place accommodate</h2>
          <p>Check that you have enough beds to accommodates all your guests confortably</p>
        </Header>
        <Body>
          <Left>
            <InfoItem>
              <h3>Guest</h3>
              <AddMinusButton
                state={state.maximumGuest}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_MAXIMUM_GUEST, next: value })}
                min={1}
                max={20}
              />
            </InfoItem>
            <hr />
            <InfoItem>
              <h3>Bedrooms</h3>
              <AddMinusButton
                state={state.numberOfBedRoom}
                setState={(value) =>
                  dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BEDROOM, next: value })
                }
                min={0}
                max={20}
              />
            </InfoItem>
            <hr />
            <InfoItem>
              <h3>Beds</h3>
              <AddMinusButton
                state={state.numberOfBed}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BED, next: value })}
                min={1}
                max={20}
              />
            </InfoItem>
            <hr />
            <InfoItem>
              <h3>Bathrooms</h3>
              <AddMinusButton
                state={state.numberOfBathRoom}
                setState={(value) =>
                  dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BATHROOM, next: value })
                }
                min={1}
                max={20}
              />
            </InfoItem>
          </Left>
          <Right></Right>
        </Body>
      </Container>
    </>
  );
}
