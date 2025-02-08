import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { PiCalendarCheckFill } from "react-icons/pi";
import Paymentform from "./Paymentform";
import { LuDot } from "react-icons/lu";
import { IoWarningSharp } from "react-icons/io5";
import { addMinutes, addSeconds, format, parseISO } from "date-fns";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import PageNotFound from "@/shared/components/Pages/PageNotFound";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import { GetBooking, TransactionRequest } from "../api/bookingApi";
import LoadingPage from "@/shared/components/Pages/LoadingPage";
import PropertyHeader from "../../custome_header/PropertyHeader";
import FooterPropertyDetail from "../../footer/FooterPropertyDetail";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const StyledContainerAll = styled.div`
  max-width: 1120px;
  margin: 1rem auto;
  color: rgba(0, 0, 0, 0.8);
`;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 7rem;
`;
const StyledContainerError = styled.div`
  padding: 0.7rem 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  justify-content: stretch;
  align-items: center;
  line-height: 2;
  column-gap: 1rem;
  margin-bottom: 1.5rem;
  & > div div:first-child {
    font-weight: 900;
  }
`;
const StyledTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.2rem;
`;

const StyledYourTrip = styled.div`
  display: flex;
  line-height: 2rem;
  flex-direction: column;
  row-gap: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 1rem;

  & > div {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  & > div:first-child {
    font-size: 22px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
  }
`;

const StyledFormPay = styled.div`
  margin: 1rem 4rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start !important;

  & > div:first-child {
    font-size: 22px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
    margin-bottom: 0.7rem;
  }
`;

const StyledContainerCancel = styled.div`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 1rem;

  & > div:first-child {
    font-size: 20px;
    margin-bottom: 0.7rem;
  }
  & > div:last-child {
    font-size: 17px;
    font-weight: 100;
  }
`;

const StyledContainerRule = styled.div`
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  margin-top: 1rem;

  & > div {
    font-size: 17px;
    font-weight: 100;
  }
  & > div:first-child {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  & > div:last-child div {
    display: flex;
    align-items: center;
  }
`;

const StyledSubmitButton = styled.button`
  background-color: #ea5e66;
  border-radius: 8px;
  border: none;
  padding: 0.6rem 2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #ff0000;
    transform: scale(1.005);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }
  &:active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    background-color: #ff0000;
    outline: none;
  }
`;
const StyledContainerDetails = styled.div`
  color: rgba(0, 0, 0, 0.7);
  font-size: 18px;
`;
const StyledTittle = styled.div`
  margin-bottom: 1rem;

  & > div:first-child {
    font-size: 26px;
    font-weight: 600;
    color: black;
  }
`;
const StyledContainerNightGuest = styled.div`
  & > div {
    display: flex;
    justify-content: stretch;
    column-gap: 2rem;
    align-items: center;
  }
`;
const StyledContainerDetail = styled.div`
  margin-bottom: 1rem;
  & > div:first-child {
    font-size: 22px;
    font-weight: 600;
  }
`;
const StyledTotal = styled.div`
  display: flex;
  justify-content: stretch;
  column-gap: 2rem;
  align-items: center;
  color: black;
  font-size: 22px;
  & > div:first-child {
    font-weight: 600;
  }
`;
const StyledContainerRemaining = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: stretch;
  column-gap: 1rem;
  align-items: center;
`;
const CountdownBox = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  color: red;
  padding: 0.6rem 2rem;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
`;

const CardCointainer = styled.div`
  > div {
    width: 100%;
  }
`;

const Transaction = () => {
  const navigate = useNavigate();

  const transactionRequest = TransactionRequest();
  // States for payment form
  const [cardnumber, setCardnumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardnumberError, setCardnumberError] = useState("");
  const [cardNameError, setCardNameError] = useState("");
  const [expirationError, setExpirationError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [transactionError, setTransactionError] = useState(false);
  const [showErrorTransaction, setShowErrorTransaction] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [showTransactionSuccess, setShowTransactionSuccess] = useState("");
  const [cancelInfo, setCancelInfo] = useState("");

  const { booking_id } = useParams();
  console.log(booking_id);
  const getBooking = GetBooking(booking_id);
  //Các state và setState
  const paymentState = {
    cardName,
    setCardName,
    cardNameError,
    setCardNameError,
    cardnumber,
    expiration,
    cvv,
    setCardnumber,
    setExpiration,
    setCvv,
    cardnumberError,
    expirationError,
    cvvError,
    setCardnumberError,
    setExpirationError,
    setCvvError,
  };

  useEffect(() => {
    if (getBooking.status == "success" && getBooking.data.status == 200) {
      if (getBooking.data.data.refundPolicy.id == 1) {
        setCancelInfo("Full refund if canceled at least 7 days before check-in");
      }
      if (getBooking.data.data.refundPolicy.id == 2) {
        setCancelInfo(
          "Full refund if canceled at least 5 days before check-in; 50% refund if canceled at least 2 days before check-in"
        );
      }

      if (getBooking.data.data.refundPolicy.id == 4) {
        setCancelInfo("No refunds under any circumstances.");
      }
    }
  }, [getBooking]);

  const [countdown, setCountdown] = useState();
  useEffect(() => {
    let intervalId;
    if (getBooking.isSuccess) {
      const isoDateString = getBooking.data.data.createdAt;
      const date = parseISO(isoDateString);
      const datePlus = addMinutes(date, 1);

      setCountdown(datePlus - new Date());
      intervalId = setInterval(() => {
        const timeLeft = datePlus - new Date();
        setCountdown(timeLeft);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [getBooking.isSuccess]);

  useEffect(() => {
    console.log(countdown);
    if (countdown <= 0) {
      navigate(`/property_detail/${getBooking.data.data.property.id}`);
    }
  }, [countdown]);
  if (getBooking.isPending) {
    return <LoadingPage />;
  }
  if (getBooking.isError) {
    return <PageNotFound />;
  }

  if (getBooking.isSuccess) {
    if (getBooking.status == "success" && getBooking.data.status == 404) {
      return <PageNotFound />;
    }
    if (getBooking.status == "success" && getBooking.data.status == 200) {
      if (
        getBooking.data.data.status != "TRANSACTIONPENDDING" &&
        getBooking.data.data.status != "PENDING"
      ) {
        return <PageNotFound />;
      }
    }
  }

  // Format date to MM/DD/YYYY
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  const dateBookingQuantity = (start, end) => {
    const timeDifference = new Date(end) - new Date(start); // Ensure the dates are parsed
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert ms to days
    return Math.ceil(daysDifference); // No need to subtract 1
  };

  const formData = new FormData();

  const handleSubmitPay = () => {
    if (cardnumberError || expirationError || cvvError || !cardnumber || !expiration || !cvv) {
      setErrorSubmit(true);
    } else {
      formData.append("bookingId", getBooking.data.data.id);
      formData.append("amount", getBooking.data.data.amount);
      transactionRequest.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            setErrorSubmit(false);
            setShowTransactionSuccess(response.message);
            setTransactionSuccess(true);
          } else if (response.status == 404) {
            setShowErrorTransaction(response.message);
            setTransactionError(true);
          } else if (response.status == 400) {
            setShowErrorTransaction(response.message);
            setTransactionError(true);
          }
        },
      });
    }
  };

  // Update countdown every second

  // Format the remaining time
  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <>
      <PropertyHeader />

      <StyledContainerAll>
        {transactionError && (
          <ErrorPopUp
            action={() => {
              navigate(`/property_detail/${getBooking.data.data.property.id}`, {
                replace: true,
              });
            }}
            header={showErrorTransaction}
          />
        )}
        {transactionSuccess && (
          <SuccessPopUp
            header={showTransactionSuccess}
            action={() => {
              navigate(`/property_detail/${getBooking.data.data.property.id}`, {
                replace: true,
              });
            }}
          />
        )}

        <StyledTitle>Confirm and pay</StyledTitle>
        <StyledContainer>
          <div>
            {errorSubmit && (
              <StyledContainerError>
                <IoWarningSharp style={{ fontSize: "4rem", color: "red" }} />

                <div>
                  <div>Let’s try that again</div>
                  <div>Please check your payment details.</div>
                </div>
              </StyledContainerError>
            )}
            <StyledYourTrip>
              <div>Your trip</div>
              <div>
                <div>
                  <div>Dates</div>
                  <p>
                    {formatDate(getBooking.data.data.checkInDay)} -{" "}
                    {formatDate(getBooking.data.data.checkOutDay)}
                  </p>
                </div>
                <PiCalendarCheckFill style={{ fontSize: "1.6rem" }} />
              </div>
              <div>
                <div>
                  <div>Guests</div>
                  <p>{getBooking.data.data.children + getBooking.data.data.adult}</p>
                </div>
                <PiCalendarCheckFill style={{ fontSize: "1.6rem" }} />
              </div>
            </StyledYourTrip>
            <StyledFormPay>
              <div>Pay</div>
              <CardCointainer>
                <Cards name={cardName} number={cardnumber} expiry={expiration} cvc={cvv} />
              </CardCointainer>
              <Paymentform {...paymentState} />
            </StyledFormPay>
            <StyledContainerCancel>
              <div>Cancellation policy</div>
              <div>{cancelInfo}</div>
            </StyledContainerCancel>
            <StyledContainerRule>
              <div>Ground rules</div>
              <div>We ask every guest to remember a few simple things.</div>
              <div>
                <div>
                  <LuDot />
                  <p>Follow the house rules</p>
                </div>
                <div>
                  <LuDot />
                  <p>Treat your Host’s home like your own</p>
                </div>
              </div>
            </StyledContainerRule>
            <StyledContainerRemaining>
              <StyledSubmitButton onClick={handleSubmitPay} disabled={transactionRequest.isPending}>
                Confirm and pay
              </StyledSubmitButton>
              {countdown > 0 && (
                <CountdownBox>Time remaining: {formatTime(countdown)}</CountdownBox>
              )}
            </StyledContainerRemaining>
          </div>
          <StyledContainerDetails>
            <div>
              <div>
                <img src={getBooking.data.data.property.propertyImages[0]} alt="" />
              </div>
              <StyledTittle>
                <div>{capitalizeFirstLetter(getBooking.data.data.property.propertyTitle)}</div>
                <div>
                  <div>{capitalizeFirstLetter(getBooking.data.data.property.propertyType)}</div>
                  <div>4.89 (222 reviews) • Superhost</div>
                </div>
              </StyledTittle>
            </div>
            <StyledContainerDetail>
              <div>Details</div>
              <StyledContainerNightGuest>
                <div>
                  <div>Nights : </div>
                  <div>
                    {dateBookingQuantity(
                      getBooking.data.data.checkInDay,
                      getBooking.data.data.checkOutDay
                    )}
                  </div>
                </div>
                <div>
                  <div>Guests : </div>
                  <div>{getBooking.data.data.children + getBooking.data.data.adult}</div>
                </div>
              </StyledContainerNightGuest>
            </StyledContainerDetail>
            <StyledTotal>
              <div>Total:</div>
              <div>${getBooking.data.data.amount}</div>
            </StyledTotal>
          </StyledContainerDetails>
        </StyledContainer>
      </StyledContainerAll>
      <FooterPropertyDetail />
    </>
  );
};

export default Transaction;
