import styled from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";

const PopUpContainer = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  max-width: 40rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Body = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Footer = styled.div``;

export default function UserBadge({ action }) {
  return (
    <PopUpContainer action={action}>
      <Header>
        {" "}
        <h4>Badge assignment</h4>
        <XButton action={action} />
      </Header>
      <hr />
      <Body></Body>
      <Footer></Footer>
    </PopUpContainer>
  );
}
