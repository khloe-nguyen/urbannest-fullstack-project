import styled from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import { GetBookingConflictList } from "../api/hostReservationApi";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import BookingDetail from "../../hosting/components/BookingDetail";
import Avatar from "react-avatar";
import { useState } from "react";
import { AcceptReservationRequest } from "../api/hostReservationApi";
import { DenyReservationRequest } from "../api/hostReservationApi";

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

export default function ConflictPopUp({ action, book, getHostReservation }) {
  const acceptReservation = AcceptReservationRequest();
  const denyReservation = DenyReservationRequest();
  const [showBookDetail, setShowBookDetail] = useState();
  const getBookingConflictList = GetBookingConflictList(book.id);

  const onAcceptReservation = () => {
    if (getBookingConflictList.isSuccess) {
      const formData = new FormData();
      formData.append("bookingId", book.id);
      getBookingConflictList.data.data.forEach((book) =>
        formData.append("cancelBookingIds", book.id)
      );

      acceptReservation.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            getHostReservation.refetch();
            action();
          }
        },
      });
    }
  };

  const onDenyReservation = () => {
    if (getBookingConflictList.isSuccess) {
      const formData = new FormData();
      formData.append("bookingId", book.id);

      denyReservation.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            getHostReservation.refetch();
            action();
          }
        },
      });
    }
  };

  return (
    <>
      <PopUpStyled action={() => {}}>
        <HeaderStyled>
          <h4>Change or cancel</h4>
          <XButton action={action} />
        </HeaderStyled>
        <hr />
        <BodyStyled>
          <h4>Chosen book</h4>
          <BookStyled>
            <div>
              <div>
                <Avatar src={book.customer.avatar} round size={60} name={book.customer.firstName} />
              </div>
              <div>
                <p>
                  {formatDate(book.checkInDay)} - {formatDate(book.checkOutDay)}
                </p>
                <p>{book.totalPerson} guests</p>
              </div>
            </div>
            <div>
              <button onClick={() => setShowBookDetail(book)}>Book detail</button>
            </div>
          </BookStyled>
          <hr />
          <h4>In conflict with</h4>
          <BookContainerStyled>
            {getBookingConflictList.isSuccess &&
              getBookingConflictList.data.data.map((book, index) => {
                return (
                  <BookStyled key={index}>
                    <div>
                      <div>
                        <Avatar
                          src={book.customer.avatar}
                          round
                          size={60}
                          name={book.customer.firstName}
                        />
                      </div>
                      <div>
                        <p>
                          {formatDate(book.checkInDay)} - {formatDate(book.checkOutDay)}
                        </p>
                        <p>{book.totalPerson} guests</p>
                      </div>
                    </div>
                    <div>
                      <button onClick={() => setShowBookDetail(book)}>Book detail</button>
                    </div>
                  </BookStyled>
                );
              })}
            {getBookingConflictList.isSuccess && getBookingConflictList.data.data.length == 0 && (
              <p>This booking has no conflict </p>
            )}
          </BookContainerStyled>
        </BodyStyled>
        <hr />
        <FooterStyled>
          <button onClick={onDenyReservation}>Deny</button>
          <button onClick={onAcceptReservation}>Accept this booking</button>
        </FooterStyled>
      </PopUpStyled>
      {showBookDetail && (
        <BookingDetail action={() => setShowBookDetail()} booking={showBookDetail} />
      )}
    </>
  );
}
