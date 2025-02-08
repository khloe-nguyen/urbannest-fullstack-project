import { useState } from "react";
import styled, { css } from "styled-components";
import { UserRequest } from "@/shared/api/userApi";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import { GetHostBookingRequest } from "./api/hostingApi";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import Avatar from "react-avatar";
import { CiSquareInfo } from "react-icons/ci";
import { GetHostBookingCountRequest } from "./api/hostingApi";
import BookingDetail from "./components/BookingDetail";
import ReviewPopUp from "./components/ReviewPopUp";
import { useNavigate } from "react-router-dom";
import Pagination from "@/shared/components/Pagination/Pagination";
import Switch from "@/shared/components/Input/Switch";

const ContainerStyled = styled.div`
  padding: 3rem 0;
  width: 85%;
  margin: auto;
`;

const HeaderStyled = styled.div``;

const BodyStyled = styled.div``;

const ReserveStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & a {
    color: black;
    font-weight: 600;
  }
`;

const ButtonListStyled = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`;

const ButtonStyled = styled.button`
  background-color: white;
  padding: 0.6rem 0.8rem;
  border-radius: 25px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$active ? "black" : "rgba(0,0,0,0.1)")};
`;

const BookingStyled = styled.div`
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }

  & h3 {
    color: #fca6af;
    font-size: 17px;
  }

  border-radius: 10px;

  & button {
    padding: 10px 0;
    cursor: pointer;
    background-color: white;
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    flex: 1;
  }

  & button:hover {
    text-decoration: underline;
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: row;
    gap: 0;
    padding: 0;
  }

  & button:nth-of-type(1) {
    border-bottom-left-radius: 10px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
  }

  & button:nth-of-type(2) {
    border-bottom-right-radius: 10px;
  }
`;

const BookingListStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`;

const IntoStyled = styled.div`
  display: flex;

  > div:nth-of-type(2) {
    cursor: pointer;
  }
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

const UpcomingContainerStyled = styled.div`
  display: flex;
  flex-direction: column !important;
  margin: 1rem 0;

  & h2 {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    padding-bottom: 10px;
  }
`;

const GroupDateButton = styled.button`
  background-color: white;
  color: black;
  font-weight: bold;
  padding: 10px 1rem;
  border-radius: 15px;
  cursor: pointer;
  border: 2px solid black;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.$active) {
      return css`
        background-color: black;
        color: white;
        border-color: white;
      `;
    }
  }}
`;

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

export default function Hosting() {
  const [groupDate, setGroupDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const user = UserRequest();
  const [active, setActive] = useState("upcoming");
  const getHostBooking = GetHostBookingRequest(active, currentPage - 1, 12, true);
  const getHostBookingCount = GetHostBookingCountRequest();
  const [showBookingDetail, setShowBookingDetail] = useState();
  const [review, setReview] = useState();
  const navigate = useNavigate();

  return (
    <>
      <ContainerStyled>
        <HeaderStyled>
          <h1>Welcome back, {user.data.data.firstName}</h1>
        </HeaderStyled>
        <BodyStyled>
          <ReserveStyled>
            <h2>Your reservations</h2>
            <Link to={"/hosting/host_reservation"}>
              All reservations{" "}
              {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                <span>({getHostBookingCount.data.data.reservedHosting})</span>
              )}
            </Link>
          </ReserveStyled>

          <ButtonListStyled>
            <div>
              <ButtonStyled $active={active == "upcoming"} onClick={() => setActive("upcoming")}>
                Upcoming{" "}
                {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                  <span>({getHostBookingCount.data.data.upcomingHosting})</span>
                )}
              </ButtonStyled>
              <ButtonStyled $active={active == "checkout"} onClick={() => setActive("checkout")}>
                Checking out{" "}
                {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                  <span>({getHostBookingCount.data.data.checkoutHosting})</span>
                )}
              </ButtonStyled>
              <ButtonStyled $active={active == "hosting"} onClick={() => setActive("hosting")}>
                Currently hosting{" "}
                {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                  <span>({getHostBookingCount.data.data.currentlyHosting})</span>
                )}
              </ButtonStyled>
              <ButtonStyled $active={active == "soon"} onClick={() => setActive("soon")}>
                Arriving soon{" "}
                {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                  <span>({getHostBookingCount.data.data.checkInHosting})</span>
                )}
              </ButtonStyled>

              <ButtonStyled $active={active == "pending"} onClick={() => setActive("pending")}>
                Pending review{" "}
                {getHostBookingCount.isSuccess && getHostBookingCount.data.data != null && (
                  <span>({getHostBookingCount.data.data.pendingReviewHosting})</span>
                )}
              </ButtonStyled>
            </div>
            <div>
              <h4>Group Date</h4>
              <Switch state={groupDate} setState={() => setGroupDate((prev) => !prev)} />
            </div>
          </ButtonListStyled>
          {getHostBooking.isSuccess && getHostBooking.data.data.length == 0 && (
            <EmptyListBooking>
              <CiSquareInfo />
              {active == "hosting" && <p>You don’t have any guests staying with you right now.</p>}
              {active == "checkout" && <p>You don’t have any guests checking out today.</p>}
              {active == "soon" && <p>You don’t have any guests arriving today.</p>}
              {active == "upcoming" && <p>You currently don’t have any upcoming guests.</p>}
              {active == "pending" && <p>You don't have any guest reviews to write.</p>}
            </EmptyListBooking>
          )}

          {active != "upcoming" ? (
            <>
              {getHostBooking.isSuccess && getHostBooking.data.data.length > 0 && (
                <BookingListStyled>
                  {getHostBooking.data.data.map((booking, index) => {
                    return (
                      <BookingStyled key={index}>
                        <div>
                          <div>
                            {active == "hosting" && <h3>Currently hosting</h3>}
                            {active == "checkout" && <h3>Checkout day</h3>}
                            {active == "soon" && <h3>Arriving soon</h3>}
                            {active == "upcoming" && <h3>Upcoming book</h3>}
                            {active == "pending" && <h3>Pending review</h3>}
                          </div>
                          <div>
                            <h4>{booking.property.propertyTitle}</h4>
                          </div>
                          <IntoStyled>
                            <div>
                              {formatDate(booking.checkInDay)} - {formatDate(booking.checkOutDay)}
                            </div>
                            <div>
                              <Avatar
                                round
                                size="50"
                                src={booking.customer.avatar}
                                name={booking.customer.firstName}
                              />
                            </div>
                          </IntoStyled>
                        </div>
                        <div>
                          {active == "pending" ? (
                            <button onClick={() => setReview(booking)}>Review</button>
                          ) : (
                            <button
                              onClick={() =>
                                navigate("/hosting/host_messages", {
                                  state: { userId: booking.customer.id },
                                })
                              }
                            >
                              Message
                            </button>
                          )}

                          <button onClick={() => setShowBookingDetail(booking)}>Detail</button>
                        </div>
                      </BookingStyled>
                    );
                  })}
                </BookingListStyled>
              )}
            </>
          ) : (
            <>
              {getHostBooking.isSuccess &&
                getHostBooking.data.data.length > 0 &&
                groupDate == true && (
                  <UpcomingContainerStyled>
                    {getHostBooking.data.data
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
                            <BookingListStyled>
                              {getHostBooking.data.data
                                .filter((booking) => {
                                  const date = new Date(booking.checkInDay);
                                  const month = date.getMonth();
                                  const year = date.getFullYear();

                                  if (month == groupMonth && year == groupYear) {
                                    return booking;
                                  }
                                })
                                .map((booking, index) => {
                                  return (
                                    <BookingStyled key={index}>
                                      <div>
                                        <div>
                                          {active == "hosting" && <h3>Currently hosting</h3>}
                                          {active == "checkout" && <h3>Checkout day</h3>}
                                          {active == "soon" && <h3>Arriving soon</h3>}
                                          {active == "upcoming" && <h3>Upcoming book</h3>}
                                          {active == "pending" && <h3>Pending review</h3>}
                                        </div>
                                        <div>
                                          <h4>{booking.property.propertyTitle}</h4>
                                        </div>
                                        <IntoStyled>
                                          <div>
                                            {formatDate(booking.checkInDay)} -{" "}
                                            {formatDate(booking.checkOutDay)}
                                          </div>
                                          <div>
                                            <Avatar
                                              round
                                              size="50"
                                              src={booking.customer.avatar}
                                              name={booking.customer.firstName}
                                            />
                                          </div>
                                        </IntoStyled>
                                      </div>
                                      <div>
                                        {active == "pending" ? (
                                          <button onClick={() => setReview(booking)}>Review</button>
                                        ) : (
                                          <button
                                            onClick={() =>
                                              navigate("/hosting/host_messages", {
                                                state: { userId: booking.customer.id },
                                              })
                                            }
                                          >
                                            Message
                                          </button>
                                        )}

                                        <button onClick={() => setShowBookingDetail(booking)}>
                                          Detail
                                        </button>
                                      </div>
                                    </BookingStyled>
                                  );
                                })}
                            </BookingListStyled>
                          </div>
                        );
                      })}
                  </UpcomingContainerStyled>
                )}

              {getHostBooking.isSuccess &&
                getHostBooking.data.data.length > 0 &&
                groupDate == false && (
                  <BookingListStyled>
                    {getHostBooking.data.data.map((booking, index) => {
                      return (
                        <BookingStyled key={index}>
                          <div>
                            <div>
                              {active == "hosting" && <h3>Currently hosting</h3>}
                              {active == "checkout" && <h3>Checkout day</h3>}
                              {active == "soon" && <h3>Arriving soon</h3>}
                              {active == "upcoming" && <h3>Upcoming book</h3>}
                              {active == "pending" && <h3>Pending review</h3>}
                            </div>
                            <div>
                              <h4>{booking.property.propertyTitle}</h4>
                            </div>
                            <IntoStyled>
                              <div>
                                {formatDate(booking.checkInDay)} - {formatDate(booking.checkOutDay)}
                              </div>
                              <div>
                                <Avatar
                                  round
                                  size="50"
                                  src={booking.customer.avatar}
                                  name={booking.customer.firstName}
                                />
                              </div>
                            </IntoStyled>
                          </div>
                          <div>
                            {active == "pending" ? (
                              <button onClick={() => setReview(booking)}>Review</button>
                            ) : (
                              <button
                                onClick={() =>
                                  navigate("/hosting/host_messages", {
                                    state: { userId: booking.customer.id },
                                  })
                                }
                              >
                                Message
                              </button>
                            )}

                            <button onClick={() => setShowBookingDetail(booking)}>Detail</button>
                          </div>
                        </BookingStyled>
                      );
                    })}
                  </BookingListStyled>
                )}
            </>
          )}
        </BodyStyled>
        {getHostBooking.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getHostBooking.data.totalPages}
          />
        )}
      </ContainerStyled>
      <Footer />
      {showBookingDetail && (
        <BookingDetail
          bookingsFetch={getHostBooking}
          booking={showBookingDetail}
          action={() => setShowBookingDetail()}
        />
      )}
      {review && (
        <ReviewPopUp
          getHostBookingCount={getHostBookingCount}
          getHostBooking={getHostBooking}
          action={() => setReview()}
          booking={review}
        />
      )}
    </>
  );
}
