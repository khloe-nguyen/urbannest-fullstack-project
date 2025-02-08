import styled, { keyframes } from "styled-components";
import { useRef } from "react";
import { useEffect } from "react";

const initBox = keyframes`
  from {
    transform: scale(100%);
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
  background-color: rgba(0, 0, 0, 0.3) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

export default function PopUp({ className, children, action }) {
  const popUpRef = useRef();

  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  });

  const onClick = (ev) => {
    if (!popUpRef.current.contains(ev.target)) {
      action();
    }
  };

  return (
    <Layout className="layout" onClick={onClick}>
      <PopUpBox useRef={popUpRef} className={className} children={children} />
    </Layout>
  );
}

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  padding: 2rem 2rem;
`;

const PopUpBox = ({ className, children, useRef }) => {
  return (
    <Container ref={useRef} className={className}>
      {children}
    </Container>
  );
};
