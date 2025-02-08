import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SelectInput from "@/shared/components/Input/SelectInput";
import TextThrottleInput from "@/shared/components/Input/TextThrottleInput";
import Pagination from "@/shared/components/Pagination/Pagination";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GetBookingListRequest } from "./api/adminBookingListApi";
import Avatar from "react-avatar";
import { PiLightningFill, PiLightningSlashBold } from "react-icons/pi";
import formatDateRange from "@/shared/utils/formatDateRange";
import { FaCheck, FaHourglassHalf } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { FaSort } from "react-icons/fa6";
import getWords from "@/shared/utils/getWords";
import { RefundAdminRequest } from "@/shared/api/refundAminApi";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import { MdOutlineDateRange } from "react-icons/md";
import Calendar from "react-calendar";
import moment from "moment";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { TbCreditCardRefund } from "react-icons/tb";
import { Tooltip } from "react-tooltip";
import formatDollar from "@/shared/utils/FormatDollar";

/* #region   */
const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
  font-size: 0.9em;
  overflow: visible;

  thead tr {
    border-bottom: 3px solid black;
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

const Filter = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  justify-content: space-between;

  > div:nth-of-type(2) {
    display: flex;
    gap: 1rem;
  }

  > div:nth-of-type(1) {
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
  width: 100%;
`;

const PropertyColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

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

const ActionStyled = styled.div`
  display: flex;
  gap: 10px;

  & a {
    color: #551a8b;
  }

  & a:hover {
    color: red;
  }
`;

const ButtonStyled = styled.button`
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: black;
  color: white;
  font-weight: 700;

  border: 1px solid rgba(0, 0, 0, 0.5);

  &:active {
    transform: scale(0.9);
  }
`;

const ExportStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;

  > button:nth-of-type(1) {
    background-color: black;
    color: white;
  }

  > button {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    cursor: pointer;
    gap: 5px;
    font-weight: 600;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const CustomTextInput = styled(TextThrottleInput)`
  width: 20rem;
`;

const FilterButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const FilterContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 40rem;

  /* display: flex;
  flex-direction: column;
  gap: 1rem; */

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  transform: translateY(1rem);

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const MailContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem 2rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 20rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateY(1rem);

  > div {
    display: flex;
    flex-direction: column;
  }

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const FilterStyled = styled.div`
  position: relative;
`;

const StyledCheckBox = styled.div`
  width: fit-content;
`;

const MessageStyled = styled.div`
  position: relative;
`;

const MessageButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const TypeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & h4 {
    font-size: 16px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const BookingTypeStyled = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  svg {
    color: yellow !important;
    font-size: 25px;
  }
`;
const UserColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const TableContainerStyled = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & span {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }

  svg {
    color: #ea5e66 !important;
    font-size: 25px;
  }
`;

const ButtonContainerStyled = styled.div`
  position: relative;
`;

const SortButtonStyled = styled.button`
  background-color: white;
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  background-color: black;
  color: white;
  cursor: pointer;
  gap: 10px;

  &:active {
    transform: scale(0.9);
  }
`;

const SortContainerStyled = styled.div`
  position: relative;
`;

const SortDropDownStyled = styled.div`
  z-index: 1;
  position: absolute;
  width: 19rem;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  transform: translate(-4.5rem, 10px);
  background-color: white;
  padding: 1rem;
  transform: translate(-15rem, 10px);

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AmenityListStyled = styled.p`
  width: 20rem;
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
  transform: translate(0rem, 0.4rem);

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

const DateDropDownContainer = styled.div`
  position: relative;
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

const DetailStyled = styled.div`
  display: flex;
  width: 20rem;
  justify-content: space-between;
  padding: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

/* #endregion */

/* #region   */
const optionStatus = [
  { label: "All", value: "All" },
  { label: "Accept", value: "ACCEPT" },
  { label: "Pending", value: "PENDING" },
  { label: "Denied", value: "DENIED" },
  { label: "Refund", value: "REFUND" },
];

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const bookOption = [
  { label: "All", value: "All" },
  { label: "Instant book", value: "instant" },
  { label: "Reserved book", value: "reserved" },
];

const optionColumn = [
  { label: "Show Host", value: "host" },
  { label: "Show Type", value: "type" },
  { label: "Show Total Person", value: "person" },
  { label: "Show Refund", value: "refund" },
];

/* #endregion */

export default function AdminBookingList() {
  const navigate = useNavigate();
  /* #region   */
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [status, setStatus] = useState(optionStatus[0]);
  const [bookingType, setBookingType] = useState(bookOption[0]);
  const [propertySearch, setPropertySearch] = useState(
    searchParams.get("property") ? searchParams.get("property") : ""
  );
  const [hostSearch, setHostSearch] = useState(
    searchParams.get("host") ? searchParams.get("host") : ""
  );
  const [customerSearch, setCustomerSearch] = useState(
    searchParams.get("customer") ? searchParams.get("customer") : ""
  );
  const [refundFilter, setRefundFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("city")
      ? searchParams
          .get("city")
          .split(",")
          .map((item) => Number(item))
      : []
  );

  const now = new Date();
  const filterContainerRef = useRef();
  const filterButtonRef = useRef();
  const sortButtonRef = useRef();
  const sortDropDownRef = useRef();
  const [isFilter, setIsFilter] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [showColumn, setShowColumn] = useState([]);
  const [date, setDate] = useState([new Date(2010, 0, 1), new Date(now.getFullYear() + 2, 0, 1)]);
  const [isDateDropDown, setIsDateDropDown] = useState(false);
  const dateRef = useRef();
  const dateRefContainer = useRef();

  const refundAdmin = RefundAdminRequest();
  const managedCityAdmin = ManagedCityAdminRequest();
  const getBookingList = GetBookingListRequest(
    currentPage - 1,
    totalPage.value,
    status.value,
    hostSearch,
    customerSearch,
    bookingType.value,
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD"),
    locationFilter,
    propertySearch,
    refundFilter?.map((item) => item.value)
  );

  /* #endregion */
  useEffect(() => {
    const event = (ev) => {
      if (
        filterContainerRef.current &&
        !filterButtonRef.current.contains(ev.target) &&
        !filterContainerRef.current.contains(ev.target)
      ) {
        setIsFilter(false);
      }

      if (
        sortDropDownRef.current &&
        !sortDropDownRef.current.contains(ev.target) &&
        !sortButtonRef.current.contains(ev.target)
      ) {
        setIsSort(false);
      }

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

  return (
    <>
      <Container>
        <Filter>
          <div>
            <FilterStyled>
              <FilterButtonStyled
                ref={filterButtonRef}
                onClick={() => setIsFilter((prev) => !prev)}
              >
                Filter <VscSettings />
              </FilterButtonStyled>
              {isFilter && (
                <FilterContainerStyled ref={filterContainerRef}>
                  <div>
                    <h4>Search for host</h4>
                    <TextThrottleInput
                      placeholder={"Search for name, email of host"}
                      state={hostSearch}
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set("host", value);
                          return newSearchParams; // Return the new object
                        });
                        setHostSearch(value);
                      }}
                    />
                  </div>
                  <div>
                    <h4>Search for customer</h4>
                    <TextThrottleInput
                      placeholder={"Search for name, email of customer"}
                      state={customerSearch}
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set("customer", value);
                          return newSearchParams; // Return the new object
                        });
                        setCustomerSearch(value);
                      }}
                    />
                  </div>
                  <div>
                    <h4>Booking type</h4>
                    <SelectInput
                      options={bookOption}
                      state={bookingType}
                      setState={setBookingType}
                    />
                  </div>
                  <div>
                    <h4>Refund type</h4>
                    <SelectInput
                      isMulti={true}
                      state={refundFilter}
                      setState={setRefundFilter}
                      options={refundAdmin.data.data.map((refund) => {
                        return { label: refund.policyName, value: refund.id };
                      })}
                    />
                  </div>
                  <div>
                    <h4>Location</h4>
                    <SelectInput
                      state={
                        managedCityAdmin.isSuccess &&
                        managedCityAdmin.data.data
                          .filter((city) => locationFilter?.includes(city.id))
                          .map((city) => {
                            return { label: city.cityName, value: city.id };
                          })
                      }
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set("city", value.map((item) => item.value).join(","));
                          return newSearchParams; // Return the new object
                        });
                        setLocationFilter(value.map((item) => item.value));
                      }}
                      isMulti={true}
                      options={
                        managedCityAdmin.isSuccess &&
                        managedCityAdmin.data.data.map((city) => {
                          return { label: city.cityName, value: city.id };
                        })
                      }
                    />
                  </div>
                </FilterContainerStyled>
              )}
            </FilterStyled>

            <DateDropDownContainer>
              <CustomDateFilterInput
                ref={dateRef}
                onClick={() => setIsDateDropDown((prev) => !prev)}
              >
                <div>
                  <MdOutlineDateRange />
                </div>
                <StyledTextInput
                  value={
                    date[0].getFullYear() == date[1].getFullYear()
                      ? formatDateRange(date[0], date[1])
                      : `${formatDate(date[0])} - ${formatDate(date[1])}`
                  }
                  readOnly={true}
                />
              </CustomDateFilterInput>
              {isDateDropDown && (
                <DropDownContainer ref={dateRefContainer}>
                  <div>
                    <button
                      onClick={() => {
                        setDate([new Date(2010, 0, 1), new Date(now.getFullYear() + 2, 0, 1)]);
                      }}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => {
                        setDate([
                          new Date(now.getFullYear(), now.getMonth(), 1),
                          new Date(now.getFullYear(), now.getMonth() + 1, 0),
                        ]);
                      }}
                    >
                      1M
                    </button>
                    <button
                      onClick={() => {
                        setDate([
                          new Date(now.getFullYear(), now.getMonth() - 6, 1),
                          new Date(now.getFullYear(), now.getMonth() + 1, 0),
                        ]);
                      }}
                    >
                      6M
                    </button>
                    <button
                      onClick={() => {
                        setDate([
                          new Date(now.getFullYear(), 0, 1),
                          new Date(now.getFullYear() + 1, 0, 0),
                        ]);
                      }}
                    >
                      1Y
                    </button>
                  </div>

                  <CalendarStyled
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
          </div>
          <div>
            <CustomTextInput
              placeholder={"Search for proprety id, name"}
              state={propertySearch}
              setState={(value) => {
                setSearchParams((prev) => {
                  const newSearchParams = new URLSearchParams(prev); // Create a new instance
                  newSearchParams.set("property", value);
                  return newSearchParams; // Return the new object
                });
                setPropertySearch(value);
              }}
            />
            <SortContainerStyled>
              <SortButtonStyled ref={sortButtonRef} onClick={() => setIsSort((prev) => !prev)}>
                Sort <FaSort />
              </SortButtonStyled>
              {isSort && (
                <SortDropDownStyled ref={sortDropDownRef}>
                  <div>
                    <h4>Page size</h4>
                    <CustomSelectInput
                      state={totalPage}
                      setState={setTotalPage}
                      options={optionsPage}
                    />
                  </div>
                  <div>
                    <h4>View column</h4>
                    <CustomSelectInput
                      setState={setShowColumn}
                      options={optionColumn}
                      isMulti={true}
                      state={showColumn}
                    />
                  </div>
                  <div>
                    <h4>Status</h4>
                    <CustomSelectInput setState={setStatus} options={optionStatus} state={status} />
                  </div>
                </SortDropDownStyled>
              )}
            </SortContainerStyled>
          </div>
        </Filter>

        <TableContainerStyled>
          <TableContent>
            <thead>
              <tr>
                <th>CUSTOMER</th>
                {showColumn.find((column) => column.value == "host") && <th>HOST</th>}
                <th>PROPERTY</th>
                {showColumn.find((column) => column.value == "type") && <th>INSTANT BOOK</th>}
                {showColumn.find((column) => column.value == "person") && <th>TOTAL PERSON</th>}
                <th>CHECK-IN CHECK OUT</th>
                {showColumn.find((column) => column.value == "refund") && <th>REFUND POLICY</th>}
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {getBookingList.isSuccess &&
                getBookingList.data.data.map((booking, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <UserColumn
                          onClick={() =>
                            navigate("/admin/user_list?search=" + booking.customer.email)
                          }
                        >
                          <div>
                            <Avatar
                              round
                              size="70"
                              src={booking.customer.avatar}
                              name={booking.customer.firstName}
                            />
                          </div>
                          <div>
                            <h4>{booking.customer.email}</h4>
                            <p>
                              {booking.customer.firstName} {booking.customer.lastName}
                            </p>
                          </div>
                        </UserColumn>
                      </td>
                      {showColumn.find((column) => column.value == "host") && (
                        <td>
                          <UserColumn
                            onClick={() =>
                              navigate("/admin/user_list?search=" + booking.host.email)
                            }
                          >
                            <div>
                              <Avatar
                                round
                                size="70"
                                src={booking.host.avatar}
                                name={booking.host.firstName}
                              />
                            </div>
                            <div>
                              <h4>{booking.host.email}</h4>
                              <p>
                                {booking.host.firstName} {booking.host.lastName}
                              </p>
                            </div>
                          </UserColumn>
                        </td>
                      )}
                      <td>
                        <PropertyColumn
                          onClick={() =>
                            navigate("/admin/listing_list?property=" + booking.property.id)
                          }
                        >
                          <div>
                            <Avatar round={12} size="80" src={booking.property.propertyImages[0]} />
                          </div>
                          <div>
                            <h4>{getWords(booking.property.propertyTitle, 3)}</h4>
                            <p>{booking.propertyCity}</p>
                          </div>
                        </PropertyColumn>
                      </td>
                      {showColumn.find((column) => column.value == "type") && (
                        <td>
                          <BookingTypeStyled>
                            {booking.bookingType == "instant" ? (
                              <>
                                <PiLightningFill />
                                <p>On</p>
                              </>
                            ) : (
                              <>
                                <PiLightningSlashBold />
                                <p>Off</p>
                              </>
                            )}
                          </BookingTypeStyled>
                        </td>
                      )}
                      {showColumn.find((column) => column.value == "person") && (
                        <td>
                          <p>
                            {booking.adult} adults
                            {booking.children ? ", " + booking.children + " children." : "."}
                          </p>
                        </td>
                      )}
                      <td>
                        <h4
                          style={{ cursor: "pointer" }}
                          data-tooltip-id={"book_detail_" + booking.id}
                        >
                          {formatDateRange(booking.checkInDay, booking.checkOutDay)}
                        </h4>
                        <Tooltip
                          style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
                          id={"book_detail_" + booking.id}
                          clickable
                        >
                          {booking.bookDateDetails.map((detail, index) => (
                            <DetailStyled key={index}>
                              <p>{formatDate(detail.night)}</p>
                              <p>$ {formatDollar(detail.price)}</p>
                            </DetailStyled>
                          ))}
                        </Tooltip>
                      </td>
                      {showColumn.find((column) => column.value == "refund") && (
                        <td>
                          <p>{booking.refundPolicy.policyName}</p>
                        </td>
                      )}
                      <td>
                        {booking.status == "ACCEPT" && (
                          <StatusStyled>
                            <FaCheck /> <span>Accept</span>
                          </StatusStyled>
                        )}

                        {booking.status == "PENDING" && (
                          <StatusStyled>
                            <FaHourglassHalf /> <span>Pending</span>
                          </StatusStyled>
                        )}

                        {booking.status == "REFUND" && (
                          <StatusStyled>
                            <TbCreditCardRefund /> <span>Refund</span>
                          </StatusStyled>
                        )}
                      </td>
                      <td>
                        <ActionStyled></ActionStyled>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </TableContent>
        </TableContainerStyled>
        <Footer>
          {getBookingList.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getBookingList.data.totalPages}
            />
          )}
        </Footer>
      </Container>
    </>
  );
}
