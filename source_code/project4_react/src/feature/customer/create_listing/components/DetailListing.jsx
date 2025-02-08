import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AddMinusButton from "@/shared/components/Button/AddMinusButton";
import TextInput from "@/shared/components/Input/TextInput";
import TextEditor from "@/shared/components/editor/TextEditor";

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

const CustomTextInput = styled.textarea`
  padding: 8px;
  border-radius: 3px;
  width: 100%;
  height: 10rem;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

const Description = styled.div`
  p {
    color: rgba(0, 0, 0, 0.5);
    text-align: justify;
  }
`;

export default function DetailListing() {
  const [state, dispatch, ACTIONS] = useOutletContext();

  return (
    <>
      <Container>
        <Header>
          <h2>Now, let's give your listing a title</h2>
          <p>Short titles work best. Have fun with it—you can always change it later</p>
        </Header>
        <Body>
          <Left>
            <div>
              <TextInput
                state={state.propertyTitle}
                setState={(value) => {
                  if (value.length <= 50) {
                    dispatch({ type: ACTIONS.CHANGE_PROPERTY_TITLE, next: value });
                  }
                }}
              />
              {state.propertyTitle.length} / 50
            </div>
            <hr />
            <Description>
              <h4>Listing description</h4>
              <p>
                Give guest a sense of what it's like to live in your space, including why they'll
                love staying there
              </p>
              <TextEditor
                state={state.aboutProperty}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_ABOUT_PROPERTY, next: value })}
              />
            </Description>
            <hr />
            <Description>
              <h4>Guest access (Optional)</h4>
              <p>Let guests know which parts of the space they'll be able to access</p>
              <TextEditor
                state={state.guestAccess}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_GUEST_ACCESS, next: value })}
              />
            </Description>
            <hr />
            <Description>
              <h4>Other details to note (Optional)</h4>
              <p>
                Include any special info you want potential guests to know before booking that isn't
                covered in other settings
              </p>
              <TextEditor
                state={state.detailToNote}
                setState={(value) => dispatch({ type: ACTIONS.CHANGE_DETAIL_TO_NOTE, next: value })}
              />
            </Description>
          </Left>
          <Right></Right>
        </Body>
      </Container>
    </>
  );
}
