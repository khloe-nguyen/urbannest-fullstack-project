import styled from "styled-components";
import CalendarBook from "./CalendarBook";
import { useEffect, useRef, useState } from "react";

import PopUpContainer from "@/shared/components/PopUp/giu/PopUpContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faPlus,
  faSubtract,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { BookingRequest } from "../api/api";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
const StyledContainer = styled.div`
  height: auto;
  position: sticky;
  top: 1rem;
  align-self: start; /* Đảm bảo nó căn chỉnh từ đầu */
`;
const StyledForm = styled.div`
  position: relative;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  border-radius: 8px;
  padding: 1.5rem;
`;
const StyledPopup = styled(PopUpContainer)`
  top: 0;
  left: 0;
  width: 700px;
  padding: 2rem;
  transform: translate(60%, 10rem);
  justify-content: center;
  overflow-y: no-scroll;
`;
const StyledHeaderForm = styled.div`
  margin: 0 0 1rem 0;
  & > div {
    font-size: 22px;
    font-weight: 600;
    & > span {
      font-size: 15px;
      font-weight: 100;
    }
  }
`;
const StyledConatinerCalendarAndGuest = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding-bottom: 0.5px;
`;
const StyledContainerCalendar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  border: 2px solid white;

  &:hover {
    border: 2px solid black;
    border-radius: 6px;
  }
  & > div {
    padding-left: 0.5rem;
    & > div:first-child {
      font-size: 12px;
      font-weight: 600;
    }
    & > div:nth-child(2) {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.5);
    }
  }
  & > div:first-child {
    border-right: 1px solid rgba(0, 0, 0, 0.5);
  }
`;
const StyledGuest = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddddd;
  border-radius: 5px;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  width: calc(100% - 3rem);
`;

const StyledAdultChildren = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dddddd;

  > div:nth-of-type(1) {
    font-weight: 600;
    font-size: 14px;
  }
`;
const StyledAddSub = styled.span`
  font-size: 10px;
  padding: 0px 12px;
  cursor: pointer;
`;
const StyledContainerBooking = styled.div`
  margin-top: 1rem;
`;
const StyledSubmitButton = styled.button`
  /* margin-top: 1rem; */
  background-color: #ff0000;
  border-radius: 8px;
  border: none;
  width: 100%;
  padding: 0.6rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    transform: scale(1.005);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  &:active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }
`;
const StyledError = styled.div`
  color: red;
  font-size: 16px;
  text-align: center;
  /* font-weight: bold; */
  margin-top: 10px;
  margin-bottom: -10px;
`;
const StyledCountGuest = styled.div`
  position: relative;
  display: flex;
  padding: 0 1rem;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  flex-direction: column;
  gap: 10px;
  border: 2px solid white;
  &:hover {
    border: 2px solid black;
    border-radius: 6px;
  }
  & span {
    font-weight: 600;
    font-size: 12px;
  }
  & p {
    margin-top: -0.2rem;
    margin-bottom: 0.3rem;
    font-size: 13px;
  }

  & div {
    margin-top: 0.3rem;
    display: flex;
    justify-content: space-between;
  }
`;
const StyledInfoBooking = styled.div`
  margin-top: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  padding-bottom: 0.5rem;
  & > div:first-child {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  & > div:nth-child(2),
  div:nth-child(3),
  div:nth-child(4) {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > span {
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;
const StyledPopupTotal = styled(PopUpContainer)`
  top: 0;
  left: 0;
  margin-left: 10rem;
  width: 400px;
  transform: translate(150%, 4rem) scale(1);
  overflow-y: no-scroll;
  transition: transform 0.5s ease, top 0.5s ease, left 0.5s ease;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.7rem;
  & > h3 {
    text-align: center;
    font-weight: 900;
  }
`;
const StyledPopupDiscount = styled(StyledPopupTotal)`
  width: auto;
  transform: translate(130%, 18rem) scale(1);
  padding: 1rem;
  color: rgba(0, 0, 0, 0.5);
`;
const StyledBasePrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StyledTotalForManyDate = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  column-gap: 1rem;
  margin: 1rem 0;
`;
const StyledContainerTotalBasePrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    font-size: 16px;
    font-weight: 600;
  }
`;
const StyledBeforeTaxes = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    font-size: 16px;
    font-weight: 600;
  }
`;
const StyledReadCalendar = styled.div`
  column-gap: 10px;
  display: flex;
  justify-content: stretch;
  align-items: center;
`;
const StyledContainerClearClose = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  column-gap: 1rem;
  margin-top: 1rem;
  & > div:first-child {
    text-decoration: 0.5px underline rgba(0, 0, 0, 0.3);
  }
`;
const Styledbutton = styled.button`
  right: 0;
  padding: 5px 15px;
  border: none;
  border-radius: 8px;
  background-color: black;
  color: white;
`;

export default function Checkout({ data, selectedDates, setSelectedDates }) {
  const [isShowCalendar, setIsShowCalendar] = useState(false);
  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showTotalBasePrice, setShowTotalBasePrice] = useState(false);
  const [showDiscount, setshowDiscount] = useState(false);
  const [isErrorLoginBooking, setIsErrorLoginBooking] = useState(false);
  const [showErrorMess, setShowErrorMess] = useState("");
  const [isErrorBooking, setIsErrorBooking] = useState(false);
  const [showErrorBooking, setShowErrorBooking] = useState("");
  const [bookingResponse, setBookingResponse] = useState(false);
  const [showBookingResponse, setShowBookingResponse] = useState("");
  const [transactionError, setTransactionError] = useState(false);
  const [showErrorTransaction, setShowErrorTransaction] = useState("");
  const containerRef = useRef();
  const navigate = useNavigate();
  const user = UserRequest();

  const formatDateCheck = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("-");
  };

  const getListDateBooked = (dates) => {
    const [start, end] = dates;
    const listDates = [];
    let current = moment(start);

    while (current.isSameOrBefore(moment(end), "day")) {
      listDates.push(current.toDate());
      current.add(1, "day");
    }

    const listDateChosen = listDates.map((date) =>
      moment(date).format("MM/DD/YYYY")
    );

    return listDateChosen;
  };
  const dateBookingQuantiy = (dates) => {
    const start = new Date(dates[0]);
    const end = new Date(dates[1]);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  };
  const handleClickDropdown = () => {
    setShowText((prevShowText) => !prevShowText);
  };
  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập và có thành công hay không
    if (user.isSuccess) {
      if (user.status == "success" && user.data.status == 200) {
        setIsErrorLoginBooking(false);
        if (user.data.data.id == data.userId) {
          setIsErrorBooking(true);
          setShowErrorBooking("Host cannot book their own property");
        } else {
          setIsErrorBooking(false);
          setShowErrorBooking("");
        }
      } else {
        setIsErrorLoginBooking(true);
        setShowErrorMess("Login before booking");
      }
    }

    const button = document.querySelector(".click-box");

    function onMouseDown(ev) {
      if (
        containerRef.current &&
        !containerRef.current.contains(ev.target) &&
        !button.contains(ev.target)
      ) {
        setShowText(false);
      }
    }

    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [selectedDates, user, data]);

  const totalBasePrice = getListDateBooked(selectedDates).reduce(
    (total, date) => {
      const exceptionPrice = data.exceptionDates.find(
        (exception) => moment(exception.date).format("MM/DD/YYYY") === date
      )?.basePrice;

      const priceForDate = exceptionPrice || data.basePrice;
      return total + priceForDate;
    },
    0
  );
  // tính theo discount
  const bookedDays = getListDateBooked(selectedDates).length;

  let finalPrice = totalBasePrice;
  if (bookedDays >= 7 && bookedDays < 30) {
    finalPrice = finalPrice - finalPrice * (data.weeklyDiscount / 100); // 10% discount
  } else if (bookedDays >= 30) {
    finalPrice = finalPrice - finalPrice * (data.monthlyDiscount / 100); // 50% discount
  }

  const startDate = selectedDates[0];
  const endDate = selectedDates[1];
  const convertToISO = (dateString) => {
    if (!dateString) return null;

    const localDate = new Date(dateString);

    localDate.setHours(0, 0, 0, 0);

    const adjustedDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    return adjustedDate.toISOString();
  };
  const formData = new FormData();

  const bookingRequest = BookingRequest();
  // console.log(user.data.id);
  console.log("amount: " + (finalPrice * 1.05).toFixed(2));
  console.log("hostfee: " + (finalPrice * 0.1).toFixed(2));
  console.log("webfee: " + (finalPrice * 0.15).toFixed(2));
  const bookingSubmit = () => {
    if (isErrorLoginBooking) {
      return;
    }
    if (data.userId == user.data.data.id) {
      return;
    }
    formData.append("checkInDay", convertToISO(startDate));
    formData.append(
      "checkOutDay",
      convertToISO(moment(endDate).add(1, "days"))
    );
    formData.append("adult", adult);
    formData.append("children", children);
    formData.append("propertyId", data.id);
    formData.append("amount", (finalPrice * 1.05).toFixed(2));
    formData.append("customerId", user.data.data.id);
    formData.append("hostId", data.userId);
    formData.append("hostFee", (finalPrice * 0.9).toFixed(2));
    formData.append("websiteFee", (finalPrice * 0.15).toFixed(2));

    bookingRequest.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setShowBookingResponse(response.message);
          setBookingResponse(true);

          navigate(`/booking/transaction/${response.data.id}`);
        } else if (response.status == 410) {
          setShowErrorTransaction(response.message);
          setTransactionError(true);
        } else if (response.status == 400) {
          alert(response.message);
          setShowErrorTransaction(response.message);
          setTransactionError(true);
        }
      },
    });
    // navigate("/booking/transaction", {
    //   state: {
    //     checkInDay: convertToISO(startDate),
    //     checkOutDay: convertToISO(endDate),
    //     adult: adult,
    //     children: children,
    //     data: data,
    //     finalPrice: finalPrice,
    //   },
    // });
  };
  const calculateDaysBetween = (start_day, end_day) => {
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return Math.floor(daysDifference) + 1;
  };
  return (
    <StyledContainer>
      <StyledForm>
        <StyledHeaderForm>
          <div>
            ${data.basePrice}
            <span> /night</span>
          </div>
        </StyledHeaderForm>
        <StyledConatinerCalendarAndGuest>
          <StyledContainerCalendar
            onClick={() => {
              setIsShowCalendar(true);
            }}
          >
            <div>
              <div>CHECK-IN</div>
              <div>
                {selectedDates?.[0] ? (
                  formatDateCheck(selectedDates[0])
                ) : (
                  <p>mm/dd/yyyy</p>
                )}
              </div>
            </div>
            <div>
              <div>CHECK-OUT</div>
              <div>
                {selectedDates?.[0] == null && selectedDates?.[1] == null && (
                  <p>mm/dd/yyyy</p>
                )}
                {selectedDates?.[0] != null && selectedDates?.[1] == null && (
                  <p>mm/dd/yyyy</p>
                )}
                {selectedDates?.[0] != null &&
                  selectedDates?.[1] != null &&
                  formatDateCheck(moment(selectedDates[1]).add(1, "days"))}
              </div>
            </div>
          </StyledContainerCalendar>
          {isShowCalendar && (
            <StyledPopup setShowPopUp={setIsShowCalendar}>
              <div>
                {selectedDates[0] != null && selectedDates[1] != null && (
                  <div>
                    <h2>
                      {calculateDaysBetween(selectedDates[0], selectedDates[1])}{" "}
                      nights
                    </h2>
                    <StyledReadCalendar>
                      <div>
                        <div>{formatDate(selectedDates[0])} </div>
                      </div>
                      <p> - </p>
                      <div>
                        <div>
                          {" "}
                          {formatDate(moment(selectedDates[1]).add(1, "days"))}
                        </div>
                      </div>
                    </StyledReadCalendar>
                  </div>
                )}
                <CalendarBook
                  data={data}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                />
                <StyledContainerClearClose>
                  <div
                    onClick={() => {
                      setSelectedDates([]);
                    }}
                  >
                    Clear dates
                  </div>
                  <div>
                    <Styledbutton onClick={() => setIsShowCalendar(false)}>
                      Accept
                    </Styledbutton>
                  </div>
                </StyledContainerClearClose>
              </div>
            </StyledPopup>
          )}
          <hr style={{ marginBottom: "-0.7px" }} />
          {/* Guest */}
          <StyledCountGuest className="click-box" onClick={handleClickDropdown}>
            <div>
              <span>GUESTS</span>
              <FontAwesomeIcon icon={faChevronCircleDown} />
            </div>
            <p>{adult + children} Guest</p>
          </StyledCountGuest>
        </StyledConatinerCalendarAndGuest>
        {showText && (
          <StyledGuest ref={containerRef} className="click-box">
            <StyledAdultChildren>
              <div>Adults</div>
              <div>
                <StyledAddSub
                  onClick={() => {
                    if (adult != 1) {
                      setAdult(adult - 1);
                    }
                  }}
                  style={{
                    cursor: adult != 1 ? "pointer" : "not-allowed",
                  }}
                >
                  <FontAwesomeIcon icon={faSubtract} />
                </StyledAddSub>
                {adult}
                <StyledAddSub
                  onClick={() => {
                    if (
                      adult < data.maximumGuest &&
                      children + adult < data.maximumGuest
                    ) {
                      setAdult(adult + 1);
                    }
                  }}
                  style={{
                    cursor:
                      adult < data.maximumGuest &&
                      children + adult < data.maximumGuest
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </StyledAddSub>
              </div>
            </StyledAdultChildren>
            <StyledAdultChildren>
              <div>Children</div>
              <div>
                <StyledAddSub
                  onClick={() => {
                    if (children != 0) {
                      setChildren(children - 1);
                    }
                  }}
                  style={{
                    cursor: children != 0 ? "pointer" : "not-allowed",
                  }}
                >
                  <FontAwesomeIcon icon={faSubtract} />
                </StyledAddSub>
                {children}
                <StyledAddSub
                  onClick={() => {
                    if (
                      data.maximumGuest - adult > 0 &&
                      children < data.maximumGuest - 1 &&
                      children + adult < data.maximumGuest
                    ) {
                      setChildren(children + 1);
                    }
                  }}
                  style={{
                    cursor:
                      data.maximumGuest - adult > 0 &&
                      children < data.maximumGuest - 1 &&
                      children + adult < data.maximumGuest
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </StyledAddSub>
              </div>
            </StyledAdultChildren>
          </StyledGuest>
        )}
        {selectedDates[0] != null && selectedDates[1] != null ? (
          <StyledContainerBooking>
            <StyledSubmitButton onClick={() => bookingSubmit()}>
              Booking
            </StyledSubmitButton>
            {isErrorLoginBooking && (
              <StyledError onClick={() => bookingSubmit()}>
                {showErrorMess}
              </StyledError>
            )}
            {isErrorBooking && (
              <StyledError onClick={() => bookingSubmit()}>
                {showErrorBooking}
              </StyledError>
            )}
            {transactionError && (
              <ErrorPopUp
                action={() => {
                  setTransactionError(false);
                }}
                header={showErrorTransaction}
              />
            )}
            {bookingResponse && (
              <SuccessPopUp
                header={showBookingResponse}
                action={() => {
                  setBookingResponse(false);
                }}
              />
            )}
          </StyledContainerBooking>
        ) : (
          <StyledContainerBooking>
            <StyledSubmitButton
              onClick={() => {
                setIsShowCalendar(true);
              }}
            >
              Check availability
            </StyledSubmitButton>
          </StyledContainerBooking>
        )}
        <div>
          {selectedDates[0] != null && selectedDates[1] != null && (
            <StyledInfoBooking>
              <div>You will not be charged yet</div>
              <div>
                <span
                  onClick={() => {
                    setShowTotalBasePrice(true);
                  }}
                >
                  ${data.basePrice} x {dateBookingQuantiy(selectedDates)} nights
                </span>
                <div>${totalBasePrice.toFixed(2)}</div>
              </div>

              {dateBookingQuantiy(selectedDates) >= 30 ? (
                <div>
                  <span
                    onClick={() => {
                      setshowDiscount(true);
                    }}
                  >
                    Monthly stay discount
                  </span>
                  <div>
                    $
                    {((data.monthlyDiscount * totalBasePrice) / 100).toFixed(2)}
                  </div>
                </div>
              ) : dateBookingQuantiy(selectedDates) >= 7 &&
                dateBookingQuantiy(selectedDates) < 30 ? (
                <div>
                  <span
                    onClick={() => {
                      setshowDiscount(true);
                    }}
                  >
                    Weekly stay discount
                  </span>
                  <div>${(data.weeklyDiscount * totalBasePrice) / 100}</div>
                </div>
              ) : null}
              <div>
                <div>UrbanNest service fee</div>
                <div>${(finalPrice * 0.05).toFixed(2)}</div>
              </div>
            </StyledInfoBooking>
          )}

          {/* Discount Popup */}
          {showDiscount && (
            <StyledPopupDiscount setShowPopUp={setshowDiscount}>
              {capitalizeFirstLetter(data.user.firstName)} {data.user.lastName}{" "}
              discounts the price if you stay longer than{" "}
              {dateBookingQuantiy(selectedDates) >= 30 ? "30" : "7"} nights.
            </StyledPopupDiscount>
          )}

          {showTotalBasePrice && (
            <StyledPopupTotal setShowPopUp={setShowTotalBasePrice}>
              <h3>Base Price Breakdown</h3>
              <hr />

              {/* Check if total booking days exceed 15 */}
              {dateBookingQuantiy(selectedDates) >= 15 ? (
                <div>
                  {/* Render exception dates */}
                  {getListDateBooked(selectedDates).map((date) => {
                    // Check if the current date is an exception date
                    const exceptionPrice = data.exceptionDates.find(
                      (exception) =>
                        moment(exception.date).format("MM/DD/YYYY") === date
                    )?.basePrice;

                    // Only render exception dates
                    if (exceptionPrice != null) {
                      return (
                        <StyledTotalForManyDate key={date}>
                          <div>Exception day: {date}</div>
                          <div>Price: ${exceptionPrice.toFixed(2)}</div>
                        </StyledTotalForManyDate>
                      );
                    }

                    return null;
                  })}

                  <StyledTotalForManyDate>
                    <div>
                      Normal days:{" "}
                      {
                        getListDateBooked(selectedDates).filter(
                          (date) =>
                            !data.exceptionDates.some(
                              (exception) =>
                                moment(exception.date).format("MM/DD/YYYY") ===
                                date
                            )
                        ).length
                      }{" "}
                      days
                    </div>

                    <div>Price: ${data.basePrice.toFixed(2)}</div>
                  </StyledTotalForManyDate>
                </div>
              ) : (
                // Render all dates when total booking days are 15 or less
                getListDateBooked(selectedDates).map((date) => {
                  const exceptionPrice = data.exceptionDates.find(
                    (exception) =>
                      moment(exception.date).format("MM/DD/YYYY") === date
                  )?.basePrice;

                  const priceForDate = exceptionPrice || data.basePrice;

                  return (
                    <StyledBasePrice key={date}>
                      <div>{date}</div>
                      <div>${priceForDate.toFixed(2)}</div>
                    </StyledBasePrice>
                  );
                })
              )}

              <hr />
              <StyledContainerTotalBasePrice>
                <div>Total base price</div>
                <div>${totalBasePrice.toFixed(2)}</div>
              </StyledContainerTotalBasePrice>
            </StyledPopupTotal>
          )}
        </div>

        {selectedDates[0] != null && selectedDates[1] != null && (
          <StyledBeforeTaxes>
            <div>Total before taxes</div>
            <div>${(finalPrice * 1.05).toFixed(2)}</div>
          </StyledBeforeTaxes>
        )}
      </StyledForm>
    </StyledContainer>
  );
}
