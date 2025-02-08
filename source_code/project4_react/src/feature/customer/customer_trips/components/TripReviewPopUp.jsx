import styled, { css } from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import Avatar from "react-avatar";
import { IoIosStarOutline } from "react-icons/io";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { RateByCustomerRequest } from "../api/customerTripApi";

const PopUpStyled = styled(PopUp)`
  padding: 0;

  width: 35rem;
  border-radius: 15px;
`;

const ReviewBodyStyled = styled.div`
  padding: 1rem;

  max-height: 40rem;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }

  > div:nth-of-type(1) {
    text-align: center;
    font-size: 20px;
  }

  > div:nth-of-type(2) {
    border: 1px solid rgba(0, 0, 0, 0.3);
    padding: 1rem;

    display: flex;
    align-items: center;
    gap: 1rem;
    border-radius: 15px;
  }

  > div:nth-of-type(3) {
    display: flex;
    padding: 1rem;
  }

  > div:nth-of-type(5) {
    display: flex;
    align-items: center;
    gap: 1rem;
    cursor: pointer;
  }

  > div:nth-of-type(6),
  > div:nth-of-type(7),
  > div:nth-of-type(8),
  > div:nth-of-type(9) {
    & h4 {
      text-decoration: underline;
    }

    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 1rem;

    > div {
      display: flex;
    }
  }
`;

const AdditionalStarStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 10px;
  cursor: pointer;

  & p {
    color: rgba(0, 0, 0, 0.6);
  }

  svg {
    font-size: 35px;
  }

  ${(props) => {
    if (props.$hover) {
      return css`
        svg {
          color: yellow;
        }
      `;
    }

    if (props.$active) {
      return css`
        svg {
          color: yellow;
        }
      `;
    }
  }}
`;

const StarStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 10px;
  cursor: pointer;

  & p {
    color: rgba(0, 0, 0, 0.6);
  }

  svg {
    font-size: 50px;
  }

  ${(props) => {
    if (props.$hover) {
      return css`
        svg {
          color: yellow;
        }
      `;
    }

    if (props.$active) {
      return css`
        svg {
          color: yellow;
        }
      `;
    }
  }}
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 3px;
  width: 100%;
  height: 10rem !important;

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

  resize: none;
`;

const FooterStyled = styled.div`
  padding: 1rem;

  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

export default function TripReviewPopUp({ action, booking, getHostBooking, getHostBookingCount }) {
  const rateByCustomer = RateByCustomerRequest();
  const [review, setReview] = useState("");

  const [totalRating, setTotalRating] = useState(0);
  const [totalHoverRating, setTotalHoverRating] = useState(0);

  const [cleanliness, setCleanliness] = useState(0);
  const [cleanlinessHoverRating, setCleanlinessHoverRating] = useState(0);

  const [communicationRating, setCommunicationRating] = useState(0);
  const [communicationHoverRating, setCommunicationHoverRating] = useState(0);

  const [accuracyRating, setAccuracyRating] = useState(0);
  const [accuracyHoverRating, setAccuracyHoverRating] = useState(0);

  const [checkInRating, setCheckInRating] = useState(0);
  const [checkInHoverRating, setCheckInHoverRating] = useState(0);
  const [isAdditionalRating, setIsAdditionalRating] = useState(false);

  const onRating = () => {
    if (!cleanliness || !communicationRating || !accuracyRating || !checkInRating) {
      alert("Please leave a rating");
      return;
    }

    if (!review) {
      alert("Please leave a review");
      return;
    }

    const formData = new FormData();

    formData.append("bookingId", booking.id);
    formData.append(
      "totalScore",
      (cleanliness + accuracyRating + checkInRating + communicationRating) / 4
    );
    formData.append("review", review);

    if (cleanliness != 0) {
      formData.append("cleanlinessScore", cleanliness);
    }

    if (accuracyRating != 0) {
      formData.append("accuracyScore", accuracyRating);
    }

    if (checkInRating != 0) {
      formData.append("checkinScore", checkInRating);
    }

    if (communicationRating != 0) {
      formData.append("communicationScore", communicationRating);
    }

    formData.append("toUser", booking.host.id);

    rateByCustomer.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getHostBookingCount.refetch();
          getHostBooking.refetch();
          action();
        }
      },
    });
  };

  return (
    <PopUpStyled action={action}>
      <ReviewBodyStyled>
        <div>
          <h2>
            How was your stay at {booking.host.firstName} {booking.host.lastName} place
          </h2>
        </div>
        <div>
          <Avatar src={booking.host.avatar} name={booking.host.firstName} round={true} size="60" />
          <p>
            Rate your stay at {booking.host.firstName} {booking.host.lastName} place
          </p>
        </div>
        <div>
          {/* {Array.from({ length: 5 }).map((_, index) => {
            return (
              <StarStyled
                onMouseEnter={() => {
                  if (totalRating == 0) {
                    setTotalHoverRating(index + 1);
                  }
                }}
                onMouseLeave={() => setTotalHoverRating()}
                key={index}
                $hover={index < totalHoverRating}
                onClick={() => setTotalRating(index + 1)}
                $active={index < totalRating}
              >
                <div>
                  <IoIosStarOutline />
                </div>
                <p>
                  {index == 0 && "Terrible"}
                  {index == 1 && "Bad"}
                  {index == 2 && "Ok"}
                  {index == 3 && "Good"}
                  {index == 4 && "Great!"}
                </p>
              </StarStyled>
            );
          })} */}
        </div>
        <div>
          <TextArea
            value={review}
            onChange={(ev) => setReview(ev.target.value)}
            placeholder="Share your thought about this host"
          />
        </div>
        <div
          onClick={() => {
            if (isAdditionalRating) {
              setCleanliness(0);
              setCommunicationRating(0);
              setAccuracyRating(0);
              setCheckInRating(0);
            }
            setIsAdditionalRating((prev) => !prev);
          }}
        ></div>

        <>
          <div>
            <h4>Cleanliness</h4>
            <div>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <AdditionalStarStyled
                    onMouseEnter={() => {
                      if (cleanliness == 0) {
                        setCleanlinessHoverRating(index + 1);
                      }
                    }}
                    onMouseLeave={() => setCleanlinessHoverRating()}
                    key={index}
                    $hover={index < cleanlinessHoverRating}
                    onClick={() => setCleanliness(index + 1)}
                    $active={index < cleanliness}
                  >
                    <div>
                      <IoIosStarOutline />
                    </div>
                    <p>
                      {index == 0 && "Terrible"}
                      {index == 1 && "Bad"}
                      {index == 2 && "Ok"}
                      {index == 3 && "Good"}
                      {index == 4 && "Great!"}
                    </p>
                  </AdditionalStarStyled>
                );
              })}
            </div>
          </div>

          <div>
            <h4>Communication</h4>
            <div>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <AdditionalStarStyled
                    onMouseEnter={() => {
                      if (communicationRating == 0) {
                        setCommunicationHoverRating(index + 1);
                      }
                    }}
                    onMouseLeave={() => setCommunicationHoverRating()}
                    key={index}
                    $hover={index < communicationHoverRating}
                    onClick={() => setCommunicationRating(index + 1)}
                    $active={index < communicationRating}
                  >
                    <div>
                      <IoIosStarOutline />
                    </div>
                    <p>
                      {index == 0 && "Terrible"}
                      {index == 1 && "Bad"}
                      {index == 2 && "Ok"}
                      {index == 3 && "Good"}
                      {index == 4 && "Great!"}
                    </p>
                  </AdditionalStarStyled>
                );
              })}
            </div>
          </div>

          <div>
            <h4>Accuracy</h4>
            <div>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <AdditionalStarStyled
                    onMouseEnter={() => {
                      if (accuracyRating == 0) {
                        setAccuracyHoverRating(index + 1);
                      }
                    }}
                    onMouseLeave={() => setAccuracyHoverRating()}
                    key={index}
                    $hover={index < accuracyHoverRating}
                    onClick={() => setAccuracyRating(index + 1)}
                    $active={index < accuracyRating}
                  >
                    <div>
                      <IoIosStarOutline />
                    </div>
                    <p>
                      {index == 0 && "Terrible"}
                      {index == 1 && "Bad"}
                      {index == 2 && "Ok"}
                      {index == 3 && "Good"}
                      {index == 4 && "Great!"}
                    </p>
                  </AdditionalStarStyled>
                );
              })}
            </div>
          </div>

          <div>
            <h4>Check-in, Check out</h4>
            <div>
              {Array.from({ length: 5 }).map((_, index) => {
                return (
                  <AdditionalStarStyled
                    onMouseEnter={() => {
                      if (checkInRating == 0) {
                        setCheckInHoverRating(index + 1);
                      }
                    }}
                    onMouseLeave={() => setCheckInHoverRating()}
                    key={index}
                    $hover={index < checkInHoverRating}
                    onClick={() => setCheckInRating(index + 1)}
                    $active={index < checkInRating}
                  >
                    <div>
                      <IoIosStarOutline />
                    </div>
                    <p>
                      {index == 0 && "Terrible"}
                      {index == 1 && "Bad"}
                      {index == 2 && "Ok"}
                      {index == 3 && "Good"}
                      {index == 4 && "Great!"}
                    </p>
                  </AdditionalStarStyled>
                );
              })}
            </div>
          </div>
        </>
      </ReviewBodyStyled>
      <hr />
      <FooterStyled>
        <button onClick={action}>Cancel</button>
        <button onClick={onRating}>Rating</button>
      </FooterStyled>
    </PopUpStyled>
  );
}
