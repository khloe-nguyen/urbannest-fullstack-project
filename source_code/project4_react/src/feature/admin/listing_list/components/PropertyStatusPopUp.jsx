import styled from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import Avatar from "react-avatar";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfStroke } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";
import getWords from "@/shared/utils/getWords";
import TextEditor from "@/shared/components/editor/TextEditor";
import { ChangeListingStatusRequest } from "../api/listingListApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";

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

const BookStyled = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 1rem;

    > div:nth-of-type(2) {
      & p:nth-of-type(2) {
        color: rgba(0, 0, 0, 0.5);
      }
    }
  }

  & button {
    align-self: center;
    background-color: white;
    padding: 10px;
    border-radius: 25px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const BookContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const FooterStyled = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border-radius: 5px;
  }

  > button:active {
    transform: scale(0.9);
  }

  > button:nth-of-type(2) {
    background-color: black;
    color: white;
  }
`;

const PropertyColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

export default function PropertyStatusPopUp({ action, listing, request }) {
  const [suggestion, setSuggestion] = useState();
  const changeListingStatus = ChangeListingStatusRequest("");

  const onChangeStatus = (status) => {
    const formData = new FormData();
    formData.append("id", listing.id);
    if (suggestion) {
      formData.append("suggestion", suggestion);
    }

    formData.append("status", status);

    changeListingStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          request.refetch();
          action();
        }
      },
    });
  };

  return (
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h4>Change status</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <PropertyColumn>
          <div>
            <Avatar round={12} size="80" src={listing.propertyImages[0]} />
          </div>
          <div>
            <h4>{getWords(listing.propertyTitle, 3)}</h4>
            <ReactStars
              edit={false}
              onChange={() => {}}
              size={20}
              count={5}
              color="black"
              activeColor="#FFD700"
              value={listing.totalScore}
              isHalf={true}
              emptyIcon={<FaRegStar />}
              halfIcon={<FaStarHalfStroke />}
              filledIcon={<FaStar />}
            />
            <p>({listing.totalReview})reviews</p>
          </div>
        </PropertyColumn>

        <hr />
        <div>
          <h4>Suggestion</h4>
          <TextEditor state={suggestion} setState={setSuggestion} />
        </div>
      </BodyStyled>
      <hr />
      <FooterStyled>
        {listing.status == "PENDING" && (
          <>
            <button onClick={() => onChangeStatus("DENIED")}>DENIED</button>
            <button onClick={() => onChangeStatus("PUBLIC")}>PUBLIC</button>
          </>
        )}

        {listing.status == "DENIED" && (
          <>
            <button onClick={() => onChangeStatus("PUBLIC")}>PUBLIC</button>
          </>
        )}

        {listing.status == "PUBLIC" && (
          <>
            <button onClick={() => onChangeStatus("ADMIN_DISABLED")}>DISABLE</button>
          </>
        )}

        {listing.status == "ADMIN_DISABLED" && (
          <>
            <button onClick={() => onChangeStatus("PUBLIC")}>PUBLIC</button>
          </>
        )}
      </FooterStyled>
    </PopUpStyled>
  );
}
