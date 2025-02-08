import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import AlertIcon from "../AnimationIcon/AlertIcon";

const initBox = keyframes`
  from {
    transform: scale(110%);
  }

  to {
    transform: scale(100%);
  }
`;

const initLayout = keyframes`
  from {
    background-color: rgba(0, 0, 0, 0.0);
  }

  to {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Layout = styled.div`
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${initLayout} 0.15s linear;
  z-index: 99999;
`;

export default function ConfirmPopUp({ header, message, confirm, cancel }) {
  return (
    <Layout>
      <PopUp header={header} message={message} cancel={cancel} confirm={confirm} />
    </Layout>
  );
}

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  border-radius: 3px;
  padding: 2rem 2rem;
  min-width: 30rem;
  animation: ${initBox} 0.15s linear;
`;

const IconContainer = styled.div``;

const BodyContainer = styled.div`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    cursor: pointer;
    background-color: #67bae9;
    border: none;
    border-radius: 3px;
    padding: 5px 15px;
    color: white;
    font-weight: 500;
  }
`;

const PopUp = ({ header, message, confirm, cancel }) => {
  const onCLickCancel = (ev) => {
    ev.preventDefault();
    cancel();
  };

  const onClickConfirm = (ev) => {
    ev.preventDefault();
    confirm();
  };

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  return (
    <Container>
      <IconContainer>
        <AlertIcon />
      </IconContainer>
      <BodyContainer>
        <h4>{header}</h4>
        <p>{message}</p>
      </BodyContainer>
      <ButtonContainer>
        <button onClick={(ev) => onClickConfirm(ev)}>Ok</button>
        <button onClick={(ev) => onCLickCancel(ev)}>Cancel</button>
      </ButtonContainer>
    </Container>
  );
};
