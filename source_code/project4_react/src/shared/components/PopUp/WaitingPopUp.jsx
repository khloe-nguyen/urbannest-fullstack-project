import styled, { keyframes } from "styled-components";
import WaitingIcon from "../AnimationIcon/WaitingIcon";
import { useEffect } from "react";

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

export default function WaitingPopUp() {
  return (
    <Layout>
      <PopUp />
    </Layout>
  );
}

const Container = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  border-radius: 3px;
  padding: 7rem 2rem;
  min-width: 30rem;
  animation: ${initBox} 0.15s linear;
  align-items: center;
`;

const PopUp = () => {
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  return (
    <Container>
      <WaitingIcon />
    </Container>
  );
};
