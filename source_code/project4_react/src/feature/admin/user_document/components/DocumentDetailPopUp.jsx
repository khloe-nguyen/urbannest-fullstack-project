import XButton from "@/shared/components/Button/XButton";
import PopUp from "@/shared/components/PopUp/PopUp";
import { useState } from "react";
import Avatar from "react-avatar";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaAddressBook, FaPhoneAlt } from "react-icons/fa";
import BlackButton from "@/shared/components/Button/BlackButton";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  width: 50rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BodyStyled = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  height: 30rem;
  overflow: auto;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }

  & .active-link {
    color: red;
    background-color: blue;
  }
`;

const UserStyled = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 1rem;

    > div:nth-of-type(2) {
      display: flex;
      flex-direction: column;

      h3 {
        cursor: pointer;
      }

      p {
        color: rgba(0, 0, 0, 0.7);
      }
    }

    > div:nth-of-type(2):hover {
      text-decoration: underline;
    }
  }
`;

const SendMessageButtonStyled = styled.button`
  align-self: center;
  padding: 0;
  background-color: white;
  padding: 10px 1rem;
  border-radius: 25px;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }
`;

const IdentityContainerCard = styled.div``;

const DriverLicenseContainer = styled.div``;

const HeaderShow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  & h4 {
    font-size: 17px;
  }
`;

const IdentityCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 10px;

  > p {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-weight: bold;

    & svg {
      font-size: 30px;
      color: #a34247;
    }
  }
`;

const Footer = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`;

export default function DocumentDetailPopUp({ action, detail, handleButtonActionClick }) {
  const navigate = useNavigate();

  const [showIdentityCard, setShowIdentityCard] = useState(false);
  const [showDriverCard, setShowDriverCard] = useState(false);

  return (
    <PopUpStyled>
      <HeaderStyled>
        <h4>Document detail</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <UserStyled>
          <div>
            <div>
              <Avatar size={70} src={detail.user.avatar} name={detail.user.firstName} round />
            </div>
            <div>
              <h3>
                {detail.user.firstName} {detail.user.lastName}
              </h3>
              <p>{detail.user.email}</p>
            </div>
          </div>
          <SendMessageButtonStyled
            onClick={() =>
              navigate("/admin/messages", {
                state: { userId: detail.user.id },
              })
            }
          >
            Send message
          </SendMessageButtonStyled>
        </UserStyled>
        <hr />
        <DetailRow>
          <p>
            <FaAddressBook />
            {detail.address}
          </p>
          <p>
            <FaPhoneAlt /> {detail.phoneNumber}
          </p>
        </DetailRow>

        <hr />
        <IdentityContainerCard>
          <HeaderShow onClick={() => setShowIdentityCard((prev) => !prev)}>
            <h4>Identity Card</h4>
            {!showIdentityCard ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
          </HeaderShow>

          {showIdentityCard && (
            <IdentityCard>
              <div>
                <h5>Front</h5>
                <div>
                  <img src={detail.identityCardFrontUrl} />
                </div>
              </div>
              <div>
                <h5>Back</h5>
                <div>
                  <img src={detail.identityCardBackUrl} />
                </div>
              </div>
            </IdentityCard>
          )}
        </IdentityContainerCard>
        <hr />
        <DriverLicenseContainer>
          <HeaderShow onClick={() => setShowDriverCard((prev) => !prev)}>
            <h4>Driver Card</h4>
            {!showDriverCard ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
          </HeaderShow>

          {showDriverCard && (
            <IdentityCard>
              <div>
                <h5>Front</h5>
                <div>
                  <img src={detail.driverLicenseFrontUrl} />
                </div>
              </div>
              <div>
                <h5>Back</h5>
                <div>
                  <img src={detail.driverLicenseBackUrl} />
                </div>
              </div>
            </IdentityCard>
          )}
        </DriverLicenseContainer>
      </BodyStyled>
      <hr />
      {!(detail.status == "ACCEPTED" || detail.status == "DENY") && (
        <Footer>
          <BlackButton onClick={() => handleButtonActionClick(detail.id, 1)}>Accept</BlackButton>
          <BlackButton onClick={() => handleButtonActionClick(detail.id, 2)}>Deinied</BlackButton>
        </Footer>
      )}
    </PopUpStyled>
  );
}
``;
