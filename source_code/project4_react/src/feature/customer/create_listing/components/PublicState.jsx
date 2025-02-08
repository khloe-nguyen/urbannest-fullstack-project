import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import Avatar from "react-avatar";
import Pagination from "@/shared/components/Pagination/Pagination";
import BookingDetail from "../../hosting/components/BookingDetail";
import PopUp from "@/shared/components/PopUp/PopUp";
import { UserRequest } from "@/shared/api/userApi";
import { GetPropertyReviewRequest } from "../api/createListingApi";
import { CiSquareInfo } from "react-icons/ci";
import { Link } from "react-router-dom";

const ViewDetailStyled = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 4px;
  font-size: 16px;
`;

const ReviewContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyListBooking = styled.div`
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 15rem;
  margin: 2rem 0;

  gap: 1.5rem;
  & p {
    width: 15rem;
    text-align: center;
  }

  svg {
    font-size: 45px;
  }
`;

const CommentContainerStyled = styled.div`
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 1rem;

  display: grid;
  grid-template-columns: 12rem 1fr;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    gap: 5px;

    & button {
      background-color: black;
      color: white;
      border-radius: 15px;
      padding: 5px 10px;
      cursor: pointer;
    }

    & button:active {
      transform: scale(0.9);
    }
  }

  & p {
    font-weight: 600;
  }
`;

const ReviewContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem;

  > div:nth-of-type(1) {
    > div:nth-of-type(1) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  > div:nth-of-type(2) {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const PopUpContainer = styled(PopUp)`
  padding: 2rem;

  height: 40rem;
  width: 50rem;
  overflow: auto;

  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FilterHeader = styled.div`
  padding: 1rem 0;
  display: flex;
  gap: 1rem;

  & button {
    padding: 0.5rem 1rem;
    border-radius: 15px;
    cursor: pointer;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
`;

const StatusButtonStyled = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        outline: 2px solid red;
        color: red;
        font-weight: 600;
        border: 1px solid rgba(255, 0, 0, 0.5);
      `;
    }
  }}
`;

function ReviewPopUp({ action, id }) {
  const user = UserRequest();
  const [status, setStatus] = useState("own");
  const [currentPage, setCurrentPage] = useState(1);
  const getPropertyReview = GetPropertyReviewRequest(currentPage, 10, status, id);
  const [showBookingDetail, setShowBookingDetail] = useState(false);

  return (
    <PopUpContainer action={action}>
      <FilterHeader>
        <StatusButtonStyled $active={status == "own"} onClick={() => setStatus("own")}>
          Your review
        </StatusButtonStyled>
        <StatusButtonStyled $active={status == "other"} onClick={() => setStatus("other")}>
          Other people review
        </StatusButtonStyled>
      </FilterHeader>

      {getPropertyReview.isSuccess && getPropertyReview.data.data.length == 0 && (
        <EmptyListBooking>
          <CiSquareInfo />
          {status == "own" && <p>You don’t have any comment .</p>}
          {status == "other" && <p>You don’t have any comment by other.</p>}
        </EmptyListBooking>
      )}

      {getPropertyReview.isSuccess && getPropertyReview.data.data.length > 0 && (
        <ReviewContainerStyled>
          {getPropertyReview.data.data.map((review, index) => {
            if (status == "own") {
              return (
                <CommentContainerStyled key={index}>
                  <div>
                    <Avatar round={15} src={review.user.avatar} />

                    <button onClick={() => setShowBookingDetail(review.booking.id)}>
                      Booking detail
                    </button>
                  </div>
                  <ReviewContentStyled>
                    <div>
                      <div>
                        <div>
                          <ReactStars
                            edit={false}
                            onChange={() => {}}
                            size={20}
                            count={5}
                            color="black"
                            activeColor="#FFD700"
                            value={review.totalScore}
                            isHalf={true}
                            emptyIcon={<FaRegStar />}
                            halfIcon={<FaStarHalfStroke />}
                            filledIcon={<FaStar />}
                          />
                        </div>
                        {formatDate(review.createdAt)}
                      </div>
                      <div>{review.review}</div>
                    </div>
                    <div>
                      {review.booking.property.user.id == user.data.data.id ? (
                        <p>
                          Your review of {review.toUser.firstName} after their stay at your property
                        </p>
                      ) : (
                        <p>
                          Your review of {review.toUser.firstName} and your experience staying at
                          their property
                        </p>
                      )}
                    </div>
                  </ReviewContentStyled>
                </CommentContainerStyled>
              );
            } else {
              return (
                <CommentContainerStyled key={index}>
                  <div>
                    <Avatar round src={review.user.avatar} name={review.user.firstName} />
                    <p>
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <button onClick={() => setShowBookingDetail(review.booking)}>
                      Booking detail
                    </button>
                  </div>

                  <ReviewContentStyled>
                    <div>
                      <div>
                        <ReactStars
                          edit={false}
                          onChange={() => {}}
                          size={20}
                          count={5}
                          color="black"
                          activeColor="#FFD700"
                          value={review.totalScore}
                          isHalf={true}
                          emptyIcon={<FaRegStar />}
                          halfIcon={<FaStarHalfStroke />}
                          filledIcon={<FaStar />}
                        />{" "}
                        {formatDate(review.createdAt)}
                      </div>
                      <div>{review.review}</div>
                    </div>
                    <div>
                      {review.booking.property.user.id == user.data.data.id ? (
                        <p>
                          This is feedback from {review.user.firstName} who have booked your
                          property
                        </p>
                      ) : (
                        <p>This is feedback from hosts regarding my stay at their property</p>
                      )}
                    </div>
                  </ReviewContentStyled>
                </CommentContainerStyled>
              );
            }
          })}
        </ReviewContainerStyled>
      )}

      {getPropertyReview.isSuccess && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={getPropertyReview.data.totalPages}
        />
      )}

      {showBookingDetail && (
        <BookingDetail
          bookingsFetch={getPropertyReview}
          booking={showBookingDetail}
          action={() => setShowBookingDetail()}
        />
      )}
    </PopUpContainer>
  );
}

export default function PublicState({ state, dispatch, ACTIONS }) {
  const [showReview, setShowReview] = useState(false);

  const [isInstruction, setIsInstruction] = useState(state.selfCheckInInstruction ? true : false);

  return (
    <>
      <ViewDetailStyled>
        <h4>View property booking</h4>
        <Link to={"/hosting/calendar"}>View</Link>
      </ViewDetailStyled>
      <ViewDetailStyled>
        <h4>View property rating</h4>
        <Link onClick={() => setShowReview(true)}>View</Link>
      </ViewDetailStyled>
      {showReview && <ReviewPopUp id={state.id} action={() => setShowReview(false)} />}
    </>
  );
}
