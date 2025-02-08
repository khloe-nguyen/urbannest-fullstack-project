import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import ChatHeader from "../custome_header/ChatHeader";
import {
  GetUserRefundRequest,
  GetUserReservationRequest,
  GetUserTripsRequest,
} from "./api/customerTripApi";
import { UserRequest } from "@/shared/api/userApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Pagination from "@/shared/components/Pagination/Pagination";
import { CiSquareInfo } from "react-icons/ci";
import formatDollar from "@/shared/utils/FormatDollar";
import dchc from "@/shared/data/dchc";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import TripDetail from "./components/TripDetail";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { useRef } from "react";
import { MdFavoriteBorder, MdOutlineDateRange } from "react-icons/md";
import Calendar from "react-calendar";
import formatDateRange from "@/shared/utils/formatDateRange";
import moment from "moment";
import { IoQrCode } from "react-icons/io5";
import { MdQrCodeScanner } from "react-icons/md";
import TripQrCode from "./components/TripQrCode";
import { GetUserTripsCountRequest } from "./api/customerTripApi";
import TripReviewPopUp from "./components/TripReviewPopUp";
import { GetUserReservedCountRequest } from "./api/customerTripApi";
import { GetUserReviewRequest } from "./api/customerTripApi";
import Avatar from "react-avatar";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import ReactStars from "react-rating-stars-component";
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";
import BookingDetail from "../hosting/components/BookingDetail";
import BlackButton from "@/shared/components/Button/BlackButton";
import Switch from "@/shared/components/Input/Switch";

/* #region   */
const ContainerStyled = styled.div`
  background-color: white;
  min-height: 85vh;
  padding: 2rem 5rem;
`;

const HeaderStyled = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  display: flex;
  justify-content: space-between;

  > div:nth-of-type(1) {
    display: flex;

    gap: 1rem;

    & button {
      font-size: 25px;
      color: rgba(0, 0, 0, 0.8);
      background-color: white;
      border: none;
      border-bottom: 3px solid white;
      cursor: pointer;
      font-weight: 700;
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    align-items: center;
  }
`;

const BodyStyled = styled.div`
  min-height: 20rem;
`;

const FooterStyled = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 3rem;
  justify-content: center;
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

const TripContainerStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 1rem 0;
  padding-bottom: 2rem;
`;

const TripStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > div:nth-of-type(1) {
    height: 300px;
    border-radius: 25px;
    overflow: hidden;
    border: 2px solid red;
    cursor: pointer;
    position: relative;

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  > div:nth-of-type(2) {
    font-weight: 600;
    font-size: 17px;
  }

  > div:nth-of-type(4) {
    font-weight: 600;
    font-size: 17px;
  }

  > div:nth-of-type(5) {
    display: flex;
    gap: 10px;
  }

  & button {
    flex: 1;
    background-color: #ea5e66;
    color: white;
    padding: 5px;
    border-radius: 15px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const BookingOption = styled.div`
  position: absolute;

  top: 0;
  width: 100%;
  padding: 0 10px;

  transform: translate(0, 10px);
  display: flex;
  justify-content: space-between;
  flex-direction: row:  !important;;

  & svg:nth-of-type(1) {
    font-size: 30px;
    color: white;
  }

  & svg:nth-of-type(2) {
    font-size: 25px;
    color: white;
  }
`;

const OptionDropDown = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 25px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

  & button {
    background-color: white;
    color: black;
    border: none;
    width: 10rem;
  }

  & button:hover {
    color: red;
  }
`;

const DateDropDownContainer = styled.div`
  position: relative;

  padding: 1rem 0;
`;

const CustomDateFilterInput = styled.button`
  cursor: pointer;
  background-color: inherit;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;

  > div {
    height: 100%;
    background-color: black;
    padding: 11px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  & svg {
    color: white;
    font-size: 1.4rem;
  }

  & input {
    width: 10rem;
    cursor: pointer;
    border-radius: none !important;
  }
`;

const StyledTextInput = styled.input`
  padding: 8px;
  width: 100%;

  border: 2px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

const DropDownContainer = styled.div`
  z-index: 1;
  background-color: white;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 1rem;
  transform: translate(-10rem, 0.4rem);

  > div:nth-of-type(1) {
    display: flex;
    margin-bottom: 2rem;
    border-bottom: 1px solid red;
    padding-bottom: 1rem;

    gap: 2px;
    > button {
      background-color: white;
      cursor: pointer;
      border-radius: 5px;
      background-color: black;
      color: white;
      font-size: 14px;
    }

    > button:active {
      transform: scale(0.9);
    }
  }

  .react-calendar {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    background: white;
    line-height: 1.125em;
    border: none;
  }
  /* 
  .react-calendar--doubleView {
    width: 500px;
  } */

  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    column-gap: 1.5rem;
    margin: -0.5em;
  }

  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5em;
  }

  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }

  .react-calendar button:enabled:hover {
    cursor: pointer;
  }

  .react-calendar__navigation {
    display: flex;
    height: 44px;
    margin-bottom: 1em;
  }

  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }

  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    text-decoration: none !important; /* Remove underline */
    font-size: 0.8rem;
    font-weight: bold;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }

  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-size: 0.75em;
    font-weight: bold;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2em 0.5em;
  }

  .react-calendar__tile {
    max-width: 100%;
    aspect-ratio: 1;
    background: none;
    margin: 10px;
    text-align: center;
    line-height: 16px;
    font: inherit;
    font-size: 1em;
    transition: background-color 0.3s ease, color 0.3s ease;
    border-radius: 50%;
    @media (max-width: 992px) {
      height: 50px;
    }
  }

  .react-calendar__tile:disabled,
  .react-calendar__tile--disabled {
    background-color: #e2e4e6 !important; /* Màu nền khi disable */
    color: #b0b0b0; /* Màu chữ khi disable */
    cursor: not-allowed !important; /* Đổi con trỏ thành "not-allowed" */
    pointer-events: none; /* Vô hiệu hóa sự kiện chuột */
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Hiệu ứng hover cho từng ô không bị vô hiệu hóa */
  .react-calendar__tile:not(.react-calendar__tile--disabled):hover {
    background-color: rgba(0, 0, 0, 0.5);
    color: black; /* Màu chữ khi hover */
    cursor: pointer; /* Đổi con trỏ thành dạng pointer */
    border-radius: 50%;
  }
  .react-calendar__tile--active:hover,
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: black;
  }
  .react-calendar__tile--active {
    background: black;
    color: white;
  }
  .react-calendar__navigation__label {
    pointer-events: none; /* Chặn click vào phần tháng/năm */
    cursor: default;
    font-size: 1.5rem;
  }
  .react-calendar__navigation button {
    /* Style cho các nút chuyển tháng */
    background-color: transparent;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    font-size: 18px;
    padding: 10px;
    transition: color 0.3s, transform 0.3s;

    &:hover {
      color: #ff0000;
      transform: scale(1);
    }

    &:active {
      transform: scale(1);
    }
  }
`;

const CalendarStyled = styled(Calendar)`
  border: none;
`;

const HeaderButton = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 3px solid red !important;
      `;
    }
  }}
`;

const ReviewContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const WaitingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GroupDateButton = styled.button`
  background-color: white;
  font-weight: bold;
  padding: 10px 1rem;
  border-radius: 15px;
  cursor: pointer;

  ${(props) => {
    if (props.$active) {
      return css`
        background-color: black;
        color: white;
      `;
    }
  }}
`;

const GroupDateStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

/* #endregion */

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CustomerTrips() {
  const navigate = useNavigate();
  const user = UserRequest();
  const [status, setStatus] = useState("upcoming");
  const [reservedStatus, setReservedStatus] = useState("pending");
  const [reviewStatus, setReviewStatus] = useState("own");
  const [headerType, setHeaderType] = useState("trips");

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageReserved, setCurrentPageReserved] = useState(1);
  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [currentPageRefund, setCurrentPageRefund] = useState(1);
  const [tripDetail, setTripDetail] = useState();
  const [bookingDetail, setBookingDetail] = useState();
  const [isOptionDropDown, setIsOptionDropDown] = useState();
  const [isQr, setIsQr] = useState();
  const [review, setReview] = useState();

  const now = new Date();
  const [date, setDate] = useState([
    new Date(2010, 0, 1),
    new Date(now.getFullYear() + 2, 0, 1),
  ]);
  const [isDateDropDown, setIsDateDropDown] = useState(false);
  const dateRef = useRef();
  const dateRefContainer = useRef();
  const [groupDate, setGroupDate] = useState(false);

  const getUserTripsCount = GetUserTripsCountRequest(
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD")
  );

  const getUserTrips = GetUserTripsRequest(
    currentPage - 1,
    12,
    status,
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD"),
    groupDate
  );

  const getUserReservation = GetUserReservationRequest(
    currentPageReserved - 1,
    12,
    reservedStatus,
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD")
  );

  const getUserReservedCount = GetUserReservedCountRequest(
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD")
  );

  const getUserReview = GetUserReviewRequest(
    currentPageReview - 1,
    10,
    reviewStatus
  );

  const getUserRefund = GetUserRefundRequest(
    currentPageRefund - 1,
    12,
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD")
  );

  useEffect(() => {
    const event = (ev) => {
      if (
        dateRefContainer.current &&
        !dateRefContainer.current.contains(ev.target) &&
        !dateRef.current.contains(ev.target)
      ) {
        setIsDateDropDown(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    if (user.isSuccess) {
      setDate([
        new Date(user.data.data.createdAt),
        new Date(now.getFullYear() + 2, 0, 1),
      ]);
    }
  }, [user.isSuccess]);

  if (user.isLoading) {
    return <WaitingPopUp />;
  }

  if (user.isError || (user.isSuccess && user.data.status == 404)) {
    navigate("/");
  }

  return (
    <>
      <ChatHeader padding={"4.5rem"} />
      <ContainerStyled>
        <HeaderStyled>
          <div>
            <HeaderButton
              $active={headerType == "trips"}
              onClick={() => setHeaderType("trips")}
            >
              Trips
            </HeaderButton>
            <HeaderButton
              $active={headerType == "reserved"}
              onClick={() => setHeaderType("reserved")}
            >
              Reservation
            </HeaderButton>
            <HeaderButton
              $active={headerType == "refund"}
              onClick={() => setHeaderType("refund")}
            >
              Refund
            </HeaderButton>
            <HeaderButton
              $active={headerType == "review"}
              onClick={() => setHeaderType("review")}
            >
              Review
            </HeaderButton>
          </div>

          <div>
            {headerType != "review" && (
              <DateDropDownContainer>
                <CustomDateFilterInput
                  ref={dateRef}
                  onClick={() => setIsDateDropDown((prev) => !prev)}
                >
                  <StyledTextInput
                    value={
                      date[0].getFullYear() == date[1].getFullYear()
                        ? formatDateRange(date[0], date[1])
                        : `${formatDate(date[0])} - ${formatDate(date[1])}`
                    }
                    readOnly={true}
                  />
                  <div>
                    <MdOutlineDateRange />
                  </div>
                </CustomDateFilterInput>
                {isDateDropDown && (
                  <DropDownContainer ref={dateRefContainer}>
                    <div>
                      <button
                        onClick={() => {
                          setDate([
                            new Date(user.data.data.createdAt),
                            new Date(now.getFullYear() + 2, 0, 1),
                          ]);
                        }}
                      >
                        ALL
                      </button>
                      <button
                        onClick={() => {
                          const start = new Date(user.data.data.createdAt);
                          if (
                            new Date(now.getFullYear(), now.getMonth(), 1) <
                            start
                          ) {
                            setDate([
                              start,
                              new Date(
                                now.getFullYear(),
                                now.getMonth() + 1,
                                0
                              ),
                            ]);
                          } else {
                            setDate([
                              new Date(now.getFullYear(), now.getMonth(), 1),
                              new Date(
                                now.getFullYear(),
                                now.getMonth() + 1,
                                0
                              ),
                            ]);
                          }
                        }}
                      >
                        1M
                      </button>
                      <button
                        onClick={() => {
                          const start = new Date(user.data.data.createdAt);
                          if (
                            new Date(now.getFullYear(), now.getMonth() - 6, 1) <
                            start
                          ) {
                            setDate([
                              start,
                              new Date(
                                now.getFullYear(),
                                now.getMonth() + 1,
                                0
                              ),
                            ]);
                          } else {
                            setDate([
                              new Date(
                                now.getFullYear(),
                                now.getMonth() - 6,
                                1
                              ),
                              new Date(
                                now.getFullYear(),
                                now.getMonth() + 1,
                                0
                              ),
                            ]);
                          }
                        }}
                      >
                        6M
                      </button>
                      <button
                        onClick={() => {
                          const start = new Date(user.data.data.createdAt);
                          if (new Date(now.getFullYear(), 0, 1) < start) {
                            setDate([
                              start,
                              new Date(now.getFullYear() + 1, 0, 0),
                            ]);
                          } else {
                            setDate([
                              new Date(now.getFullYear(), 0, 1),
                              new Date(now.getFullYear() + 1, 0, 0),
                            ]);
                          }
                        }}
                      >
                        1Y
                      </button>
                    </div>

                    <CalendarStyled
                      minDate={new Date(user.data.data.createdAt)}
                      selectRange={true}
                      onChange={(value) => {
                        if (moment(value[0]).isSame(moment(value[1]), "days")) {
                          return;
                        }
                        setDate(value);
                      }}
                      value={date}
                    />
                  </DropDownContainer>
                )}
              </DateDropDownContainer>
            )}

            {headerType == "trips" && (
              <GroupDateStyled>
                <Switch
                  state={groupDate}
                  setState={() => setGroupDate((prev) => !prev)}
                />
                <h4>Group Date</h4>
              </GroupDateStyled>
            )}
          </div>
        </HeaderStyled>
        <BodyStyled>
          {headerType == "trips" && (
            <>
              <FilterHeader>
                <StatusButtonStyled
                  $active={status == "upcoming"}
                  onClick={() => setStatus("upcoming")}
                >
                  Upcoming (
                  {getUserTripsCount.isSuccess && getUserTripsCount.data.data
                    ? getUserTripsCount.data.data.upcomingCount
                    : 0}
                  )
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={status == "checkout"}
                  onClick={() => setStatus("checkout")}
                >
                  Checking out (
                  {getUserTripsCount.isSuccess && getUserTripsCount.data.data
                    ? getUserTripsCount.data.data.checkoutCount
                    : 0}
                  )
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={status == "stayin"}
                  onClick={() => setStatus("stayin")}
                >
                  Currently stay-in (
                  {getUserTripsCount.isSuccess && getUserTripsCount.data.data
                    ? getUserTripsCount.data.data.stayInCount
                    : 0}
                  )
                </StatusButtonStyled>

                <StatusButtonStyled
                  $active={status == "pending"}
                  onClick={() => setStatus("pending")}
                >
                  Pending review (
                  {getUserTripsCount.isSuccess && getUserTripsCount.data.data
                    ? getUserTripsCount.data.data.pendingCount
                    : 0}
                  )
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={status == "history"}
                  onClick={() => setStatus("history")}
                >
                  History stay-in (
                  {getUserTripsCount.isSuccess && getUserTripsCount.data.data
                    ? getUserTripsCount.data.data.historyCount
                    : 0}
                  )
                </StatusButtonStyled>
              </FilterHeader>

              {getUserTrips.isSuccess && getUserTrips.data.data.length == 0 && (
                <EmptyListBooking>
                  <CiSquareInfo />
                  {status == "checkout" && (
                    <p>You don’t have any stay-in currently checkout.</p>
                  )}
                  {status == "stayin" && <p>You don’t have stay-in today.</p>}
                  {status == "upcoming" && (
                    <p>You don’t have upcoming stay-in </p>
                  )}
                  {status == "pending" && (
                    <p>You don’t have any stay-in pending review.</p>
                  )}
                  {status == "history" && (
                    <p>You currently don’t have any stay-in history.</p>
                  )}
                </EmptyListBooking>
              )}

              {getUserTrips.isLoading && (
                <WaitingContainer>
                  <WaitingIcon />
                </WaitingContainer>
              )}

              {status != "history" && status != "upcoming" ? (
                <>
                  {getUserTrips.isSuccess &&
                    getUserTrips.data.data.length > 0 && (
                      <TripContainerStyled>
                        {getUserTrips.data.data.map((trip, index) => {
                          let province;
                          let district;

                          province = dchc.data.find(
                            (dchcProvince) =>
                              dchcProvince.level1_id ==
                              trip.property.addressCode.split("_")[0]
                          );
                          district = province.level2s.find(
                            (dchcDistrict) =>
                              dchcDistrict.level2_id ==
                              trip.property.addressCode.split("_")[1]
                          );

                          return (
                            <TripStyled key={index}>
                              <div
                                onClick={() =>
                                  navigate(
                                    "/property_detail/" + trip.property.id
                                  )
                                }
                              >
                                <img src={trip.property.propertyImages[0]} />
                                <BookingOption>
                                  <MdQrCodeScanner
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      setIsQr(trip.bookingCode);
                                    }}
                                  />
                                  {/* <MdFavoriteBorder
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    alert("ss");
                                  }}
                                /> */}
                                </BookingOption>
                              </div>
                              <div>
                                {province.name.indexOf("Thành phố") != -1
                                  ? province.name.slice(10)
                                  : province.name}
                                , {district.name},
                              </div>
                              <div>
                                {formatDate(trip.checkInDay)} -{" "}
                                {formatDate(trip.checkOutDay)}
                              </div>
                              <div>$ {formatDollar(trip.amount)}</div>
                              <div>
                                {status == "pending" && (
                                  <button onClick={() => setReview(trip)}>
                                    Review
                                  </button>
                                )}
                                <button onClick={() => setTripDetail(trip)}>
                                  Detail
                                </button>
                              </div>
                            </TripStyled>
                          );
                        })}
                      </TripContainerStyled>
                    )}
                </>
              ) : (
                <>
                  {getUserTrips.isSuccess &&
                    getUserTrips.data.data.length > 0 &&
                    groupDate == false && (
                      <TripContainerStyled>
                        {getUserTrips.data.data.map((trip, index) => {
                          let province;
                          let district;

                          province = dchc.data.find(
                            (dchcProvince) =>
                              dchcProvince.level1_id ==
                              trip.property.addressCode.split("_")[0]
                          );
                          district = province.level2s.find(
                            (dchcDistrict) =>
                              dchcDistrict.level2_id ==
                              trip.property.addressCode.split("_")[1]
                          );

                          return (
                            <TripStyled key={index}>
                              <div
                                onClick={() =>
                                  navigate(
                                    "/property_detail/" + trip.property.id
                                  )
                                }
                              >
                                <img src={trip.property.propertyImages[0]} />
                                <BookingOption>
                                  <MdQrCodeScanner
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      setIsQr(trip.bookingCode);
                                    }}
                                  />
                                  {/* <MdFavoriteBorder
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      alert("ss");
                                    }}
                                  /> */}
                                </BookingOption>
                              </div>
                              <div>
                                {province.name.indexOf("Thành phố") != -1
                                  ? province.name.slice(10)
                                  : province.name}
                                , {district.name},
                              </div>
                              <div>
                                {formatDate(trip.checkInDay)} -{" "}
                                {formatDate(trip.checkOutDay)}
                              </div>
                              <div>$ {formatDollar(trip.amount)}</div>
                              <div>
                                {status == "pending" && (
                                  <button onClick={() => setReview(trip)}>
                                    Review
                                  </button>
                                )}
                                <button onClick={() => setTripDetail(trip)}>
                                  Detail
                                </button>
                              </div>
                            </TripStyled>
                          );
                        })}
                      </TripContainerStyled>
                    )}

                  {getUserTrips.isSuccess &&
                    getUserTrips.data.data.length &&
                    groupDate == true > 0 && (
                      <div>
                        {getUserTrips.data.data
                          .reduce((prev, current) => {
                            const date = new Date(current.checkInDay);
                            const month = date.getMonth();
                            const year = date.getFullYear();

                            var isExist = prev.find((item) => {
                              const [tempMonth, tempYear] = item;

                              if (tempMonth == month && tempYear == year) {
                                return item;
                              }
                            });

                            if (!isExist) {
                              prev.push([month, year]);
                            }

                            return prev;
                          }, [])
                          .map((upcomingDateGroup, dateIndex) => {
                            const [groupMonth, groupYear] = upcomingDateGroup;

                            return (
                              <div key={dateIndex}>
                                <h2>
                                  {months[groupMonth]}, {groupYear}
                                </h2>
                                <TripContainerStyled>
                                  {getUserTrips.data.data
                                    .filter((booking) => {
                                      const date = new Date(booking.checkInDay);
                                      const month = date.getMonth();
                                      const year = date.getFullYear();

                                      if (
                                        month == groupMonth &&
                                        year == groupYear
                                      ) {
                                        return booking;
                                      }
                                    })
                                    .map((trip, index) => {
                                      let province;
                                      let district;

                                      province = dchc.data.find(
                                        (dchcProvince) =>
                                          dchcProvince.level1_id ==
                                          trip.property.addressCode.split(
                                            "_"
                                          )[0]
                                      );
                                      district = province.level2s.find(
                                        (dchcDistrict) =>
                                          dchcDistrict.level2_id ==
                                          trip.property.addressCode.split(
                                            "_"
                                          )[1]
                                      );

                                      return (
                                        <TripStyled key={index}>
                                          <div
                                            onClick={() =>
                                              navigate(
                                                "/property_detail/" +
                                                  trip.property.id
                                              )
                                            }
                                          >
                                            <img
                                              src={
                                                trip.property.propertyImages[0]
                                              }
                                            />
                                            <BookingOption>
                                              <MdQrCodeScanner
                                                onClick={(ev) => {
                                                  ev.stopPropagation();
                                                  setIsQr(trip.bookingCode);
                                                }}
                                              />
                                              {/* <MdFavoriteBorder
                                                onClick={(ev) => {
                                                  ev.stopPropagation();
                                                  alert("ss");
                                                }}
                                              /> */}
                                            </BookingOption>
                                          </div>
                                          <div>
                                            {province.name.indexOf(
                                              "Thành phố"
                                            ) != -1
                                              ? province.name.slice(10)
                                              : province.name}
                                            , {district.name}
                                          </div>
                                          <div>
                                            {formatDate(trip.checkInDay)} -{" "}
                                            {formatDate(trip.checkOutDay)}
                                          </div>
                                          <div>
                                            $ {formatDollar(trip.amount)}
                                          </div>
                                          <div>
                                            {status == "pending" && (
                                              <button
                                                onClick={() => setReview(trip)}
                                              >
                                                Review
                                              </button>
                                            )}
                                            <button
                                              onClick={() =>
                                                setTripDetail(trip)
                                              }
                                            >
                                              Detail
                                            </button>
                                          </div>
                                        </TripStyled>
                                      );
                                    })}
                                </TripContainerStyled>
                              </div>
                            );
                          })}
                      </div>
                    )}
                </>
              )}
            </>
          )}

          {headerType == "reserved" && (
            <>
              <FilterHeader>
                <StatusButtonStyled
                  $active={reservedStatus == "pending"}
                  onClick={() => setReservedStatus("pending")}
                >
                  Pending (
                  {getUserReservedCount.isSuccess
                    ? getUserReservedCount.data.data.pending
                    : 0}
                  )
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={reservedStatus == "denied"}
                  onClick={() => setReservedStatus("denied")}
                >
                  Host denied (
                  {getUserReservedCount.isSuccess
                    ? getUserReservedCount.data.data.denied
                    : 0}
                  )
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={reservedStatus == "cancel"}
                  onClick={() => setReservedStatus("cancel")}
                >
                  User cancel (
                  {getUserReservedCount.isSuccess
                    ? getUserReservedCount.data.data.cancel
                    : 0}
                  )
                </StatusButtonStyled>
              </FilterHeader>

              {getUserReservation.isSuccess &&
                getUserReservation.data.data.length == 0 && (
                  <EmptyListBooking>
                    <CiSquareInfo />
                    {reservedStatus == "pending" && (
                      <p>You don’t have any reservation pending.</p>
                    )}
                    {reservedStatus == "denied" && (
                      <p>You don’t have any reservation denied.</p>
                    )}
                    {reservedStatus == "cancel" && (
                      <p>You don’t have any canceled reservation.</p>
                    )}
                  </EmptyListBooking>
                )}

              {getUserReservation.isSuccess &&
                getUserReservation.data.data.length > 0 && (
                  <div>
                    {getUserReservation.data.data
                      .reduce((prev, current) => {
                        const date = new Date(current.checkInDay);
                        const month = date.getMonth();
                        const year = date.getFullYear();

                        var isExist = prev.find((item) => {
                          const [tempMonth, tempYear] = item;

                          if (tempMonth == month && tempYear == year) {
                            return item;
                          }
                        });

                        if (!isExist) {
                          prev.push([month, year]);
                        }

                        return prev;
                      }, [])
                      .map((upcomingDateGroup, dateIndex) => {
                        const [groupMonth, groupYear] = upcomingDateGroup;

                        return (
                          <div key={dateIndex}>
                            <h2>
                              {months[groupMonth]}, {groupYear}
                            </h2>
                            <TripContainerStyled>
                              {getUserReservation.data.data
                                .filter((booking) => {
                                  const date = new Date(booking.checkInDay);
                                  const month = date.getMonth();
                                  const year = date.getFullYear();

                                  if (
                                    month == groupMonth &&
                                    year == groupYear
                                  ) {
                                    return booking;
                                  }
                                })
                                .map((trip, index) => {
                                  let province;
                                  let district;

                                  province = dchc.data.find(
                                    (dchcProvince) =>
                                      dchcProvince.level1_id ==
                                      trip.property.addressCode.split("_")[0]
                                  );
                                  district = province.level2s.find(
                                    (dchcDistrict) =>
                                      dchcDistrict.level2_id ==
                                      trip.property.addressCode.split("_")[1]
                                  );

                                  return (
                                    <TripStyled key={index}>
                                      <div
                                        onClick={() =>
                                          navigate(
                                            "/property_detail/" +
                                              trip.property.id
                                          )
                                        }
                                      >
                                        <img
                                          src={trip.property.propertyImages[0]}
                                        />
                                        <BookingOption>
                                          <MdQrCodeScanner
                                            onClick={(ev) => {
                                              ev.stopPropagation();
                                              setIsQr(trip.bookingCode);
                                            }}
                                          />
                                          {/* <MdFavoriteBorder
                                            onClick={(ev) => {
                                              ev.stopPropagation();
                                              alert("ss");
                                            }}
                                          /> */}
                                        </BookingOption>
                                      </div>
                                      <div>
                                        {province.name.indexOf("Thành phố") !=
                                        -1
                                          ? province.name.slice(10)
                                          : province.name}
                                        , {district.name}
                                      </div>
                                      <div>
                                        {formatDate(trip.checkInDay)} -{" "}
                                        {formatDate(trip.checkOutDay)}
                                      </div>
                                      <div>$ {formatDollar(trip.amount)}</div>
                                      <div>
                                        {status == "pending" && (
                                          <button
                                            onClick={() => setReview(trip)}
                                          >
                                            Review
                                          </button>
                                        )}
                                        <button
                                          onClick={() => setTripDetail(trip)}
                                        >
                                          Detail
                                        </button>
                                      </div>
                                    </TripStyled>
                                  );
                                })}
                            </TripContainerStyled>
                          </div>
                        );
                      })}
                  </div>
                )}
            </>
          )}

          {headerType == "refund" && (
            <>
              {getUserRefund.isSuccess &&
                getUserRefund.data.data.length == 0 && (
                  <EmptyListBooking>
                    <CiSquareInfo />
                    <p>You don’t have any refund.</p>
                  </EmptyListBooking>
                )}
              <br />

              {getUserRefund.isSuccess &&
                getUserRefund.data.data.length > 0 && (
                  <div>
                    {getUserRefund.data.data
                      .reduce((prev, current) => {
                        const date = new Date(current.checkInDay);
                        const month = date.getMonth();
                        const year = date.getFullYear();

                        var isExist = prev.find((item) => {
                          const [tempMonth, tempYear] = item;

                          if (tempMonth == month && tempYear == year) {
                            return item;
                          }
                        });

                        if (!isExist) {
                          prev.push([month, year]);
                        }

                        return prev;
                      }, [])
                      .map((upcomingDateGroup, dateIndex) => {
                        const [groupMonth, groupYear] = upcomingDateGroup;

                        return (
                          <div key={dateIndex}>
                            <h2>
                              {months[groupMonth]}, {groupYear}
                            </h2>
                            <TripContainerStyled>
                              {getUserRefund.data.data
                                .filter((booking) => {
                                  const date = new Date(booking.checkInDay);
                                  const month = date.getMonth();
                                  const year = date.getFullYear();

                                  if (
                                    month == groupMonth &&
                                    year == groupYear
                                  ) {
                                    return booking;
                                  }
                                })
                                .map((trip, index) => {
                                  let province;
                                  let district;

                                  province = dchc.data.find(
                                    (dchcProvince) =>
                                      dchcProvince.level1_id ==
                                      trip.property.addressCode.split("_")[0]
                                  );
                                  district = province.level2s.find(
                                    (dchcDistrict) =>
                                      dchcDistrict.level2_id ==
                                      trip.property.addressCode.split("_")[1]
                                  );

                                  return (
                                    <TripStyled key={index}>
                                      <div
                                        onClick={() =>
                                          navigate(
                                            "/property_detail/" +
                                              trip.property.id
                                          )
                                        }
                                      >
                                        <img
                                          src={trip.property.propertyImages[0]}
                                        />
                                        <BookingOption>
                                          <MdQrCodeScanner
                                            onClick={(ev) => {
                                              ev.stopPropagation();
                                              setIsQr(trip.bookingCode);
                                            }}
                                          />
                                          {/* <MdFavoriteBorder
                                          onClick={(ev) => {
                                            ev.stopPropagation();
                                            alert("ss");
                                          }}
                                        /> */}
                                        </BookingOption>
                                      </div>
                                      <div>
                                        {province.name.indexOf("Thành phố") !=
                                        -1
                                          ? province.name.slice(10)
                                          : province.name}
                                        , {district.name}
                                      </div>
                                      <div>
                                        {formatDate(trip.checkInDay)} -{" "}
                                        {formatDate(trip.checkOutDay)}
                                      </div>
                                      <div>$ {formatDollar(trip.amount)}</div>
                                      <div>
                                        {status == "pending" && (
                                          <button
                                            onClick={() => setReview(trip)}
                                          >
                                            Review
                                          </button>
                                        )}
                                        <button
                                          onClick={() => setTripDetail(trip)}
                                        >
                                          Detail
                                        </button>
                                      </div>
                                    </TripStyled>
                                  );
                                })}
                            </TripContainerStyled>
                          </div>
                        );
                      })}
                  </div>
                )}
            </>
          )}

          {headerType == "review" && (
            <>
              <FilterHeader>
                <StatusButtonStyled
                  $active={reviewStatus == "own"}
                  onClick={() => setReviewStatus("own")}
                >
                  Your review
                </StatusButtonStyled>
                <StatusButtonStyled
                  $active={reviewStatus == "other"}
                  onClick={() => setReviewStatus("other")}
                >
                  Other people review
                </StatusButtonStyled>
              </FilterHeader>

              {getUserReview.isSuccess &&
                getUserReview.data.data.length == 0 && (
                  <EmptyListBooking>
                    <CiSquareInfo />
                    {status == "own" && <p>You don’t have any comment .</p>}
                    {status == "other" && (
                      <p>You don’t have any comment by other.</p>
                    )}
                  </EmptyListBooking>
                )}

              {getUserReview.isSuccess &&
                getUserReview.data.data.length > 0 && (
                  <ReviewContainerStyled>
                    {getUserReview.data.data.map((review, index) => {
                      if (reviewStatus == "own") {
                        return (
                          <CommentContainerStyled key={index}>
                            <div>
                              <Avatar
                                round={15}
                                src={review.booking.property.propertyImages[0]}
                              />

                              {review.booking.property.user.id ==
                              user.data.data.id ? (
                                <button
                                  onClick={() =>
                                    setBookingDetail(review.booking)
                                  }
                                >
                                  Booking detail
                                </button>
                              ) : (
                                <button
                                  onClick={() => setTripDetail(review.booking)}
                                >
                                  Trip detail
                                </button>
                              )}
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
                                {review.booking.property.user.id ==
                                user.data.data.id ? (
                                  <p>
                                    Your review of {review.toUser.firstName}{" "}
                                    after their stay at your property
                                  </p>
                                ) : (
                                  <p>
                                    Your review of {review.toUser.firstName} and
                                    your experience staying at their property
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
                              <Avatar
                                round
                                src={review.user.avatar}
                                name={review.user.firstName}
                              />
                              <p>
                                {review.user.firstName} {review.user.lastName}
                              </p>
                              {review.booking.property.user.id ==
                              user.data.data.id ? (
                                <button
                                  onClick={() =>
                                    setBookingDetail(review.booking)
                                  }
                                >
                                  Booking detail
                                </button>
                              ) : (
                                <button
                                  onClick={() => setTripDetail(review.booking)}
                                >
                                  Trip detail
                                </button>
                              )}
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
                                {review.booking.property.user.id ==
                                user.data.data.id ? (
                                  <p>
                                    This is feedback from{" "}
                                    {review.user.firstName} who have booked your
                                    property
                                  </p>
                                ) : (
                                  <p>
                                    This is feedback from hosts regarding my
                                    stay at their property
                                  </p>
                                )}
                              </div>
                            </ReviewContentStyled>
                          </CommentContainerStyled>
                        );
                      }
                    })}
                  </ReviewContainerStyled>
                )}
            </>
          )}
        </BodyStyled>
        <FooterStyled>
          {headerType == "trips" && getUserTrips.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getUserTrips.data.totalPages}
            />
          )}

          {headerType == "reserved" && getUserReservation.isSuccess && (
            <Pagination
              currentPage={currentPageReserved}
              setCurrentPage={setCurrentPageReserved}
              totalPage={getUserReservation.data.totalPages}
            />
          )}

          {headerType == "review" && getUserReview.isSuccess && (
            <Pagination
              currentPage={currentPageReview}
              setCurrentPage={setCurrentPageReview}
              totalPage={getUserReview.data.totalPages}
            />
          )}

          {headerType == "refund" && getUserRefund.isSuccess && (
            <Pagination
              currentPage={currentPageRefund}
              setCurrentPage={setCurrentPageRefund}
              totalPage={getUserRefund.data.totalPages}
            />
          )}
        </FooterStyled>
      </ContainerStyled>
      {tripDetail && (
        <TripDetail action={() => setTripDetail()} booking={tripDetail} />
      )}
      {bookingDetail && (
        <BookingDetail
          action={() => setBookingDetail()}
          booking={bookingDetail}
        />
      )}
      {isQr && <TripQrCode action={() => setIsQr()} qr={isQr} />}
      {review && (
        <TripReviewPopUp
          action={() => setReview()}
          booking={review}
          getHostBooking={getUserTrips}
          getHostBookingCount={getUserTripsCount}
        />
      )}
    </>
  );
}
