import CustomerHeader from "../custome_header/CustomerHeader";
import styled from "styled-components";
import NameImage from "./component/NameImage";
import InforAndCheckout from "./component/InforAndCheckout";
import { GetPropertyRequest } from "./api/api";
import { useParams } from "react-router-dom";
import MeetYourHost from "./component/MeetYourHost";
import RulePolicy from "./component/RulePolicy";
import LocationProperty from "./component/LocationProperty";
import LoadingPage from "@/shared/components/Pages/LoadingPage";
import PageNotFound from "@/shared/components/Pages/PageNotFound";
import PropertyHeader from "../custome_header/PropertyHeader";
import FooterPropertyDetail from "../footer/FooterPropertyDetail";
import { CategoriesRequest } from "@/shared/api/categoryClientApi";
import Review from "./component/Review";
import Footer from "../footer/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { ref, set, onValue, off, remove } from "firebase/database";
import database from "@/shared/api/firebaseApi";
import { FaRegCalendarAlt } from "react-icons/fa";

const StyledContainer = styled.div`
  max-width: 1120px;
  margin: 2rem auto;
  color: #222222;

  .react-calendar {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    background: white;
    line-height: 1.125em;
    border: none;
  }

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

export default function PropertyDetail() {
  const { property_id } = useParams();
  const getPropertyRequest = GetPropertyRequest(property_id);
  const categories = CategoriesRequest();
  const firstLoadRef = useRef(true);

  const fireBaseNotiRef = useRef();

  useEffect(() => {
    fireBaseNotiRef.current = ref(database, "property_" + property_id + "_web");

    onValue(fireBaseNotiRef.current, (snapshot) => {
      const data = snapshot.val();

      if (firstLoadRef.current == true) {
        firstLoadRef.current = false;
        return;
      }

      if (firstLoadRef.current == false && data.message) {
        notify(data.message);
      }
    });

    return () => {
      if (fireBaseNotiRef.current) {
        off(fireBaseNotiRef.current);
        firstLoadRef.current = true;
      }
    };
  }, [getPropertyRequest]);

  if (getPropertyRequest.isLoading || categories.isLoading) {
    return <LoadingPage />;
  }

  if (
    getPropertyRequest.isError ||
    (getPropertyRequest.isSuccess && getPropertyRequest.data.status == 404)
  ) {
    return <PageNotFound />;
  }

  const notify = (message) =>
    toast(message, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
      icon: <FaRegCalendarAlt size={50} />,
    });

  return (
    <div>
      <PropertyHeader />
      {getPropertyRequest.isSuccess && (
        <StyledContainer>
          <NameImage data={getPropertyRequest.data.data} />
          <InforAndCheckout data={getPropertyRequest.data.data} />
          {getPropertyRequest.data.data.checkinScore > 0 && (
            <Review data={getPropertyRequest.data.data} />
          )}
          <MeetYourHost data={getPropertyRequest.data.data} />
          <LocationProperty data={getPropertyRequest.data.data} />
          <RulePolicy data={getPropertyRequest.data.data} />
        </StyledContainer>
      )}
      <Footer percent={"75%"} />
      <Toaster position="bottom-left" reverseOrder={false} />
    </div>
  );
}
