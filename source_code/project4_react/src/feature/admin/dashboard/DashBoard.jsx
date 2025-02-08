import styled, { css } from "styled-components";
import { AdminRequest } from "@/shared/api/adminApi";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import formatDateRange from "@/shared/utils/formatDateRange";
import { MdOutlineDateRange } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaHouseUser, FaRegStar, FaStar } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaRegCalendar, FaStarHalfStroke } from "react-icons/fa6";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BookingMap from "./components/BookingMap";
import { GetBestHost, GetBookingChartRequest, GetCountChartRequest } from "./api/dashBoardApi";
import formatDollar from "@/shared/utils/FormatDollar";
import formatNumber from "@/shared/utils/FormatNumber";
import Avatar from "react-avatar";
import getWords from "@/shared/utils/getWords";
import ReactStars from "react-rating-stars-component";
import { formatDate } from "@/shared/utils/DateTimeHandle";

/* #region styled */
const Container = styled.div`
  margin: 2rem;
  padding: 2rem;
  /* min-height: 160vh; */
  background-color: white;
  border-radius: 15px;
`;

const CalendarStyled = styled(Calendar)`
  border: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  > div:nth-of-type(2) {
    position: relative;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const CustomTextInput = styled.button`
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

const DropDownContainer = styled.div`
  z-index: 9999;
  background-color: white;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 1rem;
  transform: translate(-11rem, 0.4rem);
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

const BoxContainer = styled.div`
  display: flex;
  margin: 2rem 0;
  gap: 20px;

  > div {
    transition: all 0.5s;
    flex: 1;
    aspect-ratio: 1/0.5;
    cursor: pointer;
    /* box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px; */
    background-color: white;
    border: 1px solid rgba(255, 0, 0, 1);
    border-radius: 5px;
  }

  > div:hover {
    transform: translateY(-10px);
  }
`;

const BoxStyled = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & h4 {
    color: rgba(0, 0, 0, 0.4);
    font-size: 13px;
  }

  & a {
    font-size: 14px;
  }

  > div:nth-of-type(2) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    > div:nth-of-type(2) {
      background-color: black;
      padding: 5px;
      border-radius: 5px;

      > svg {
        color: white;
        font-size: 30px;
      }
    }
  }
`;

const ChartStyled = styled.div`
  margin: 3rem 0;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
`;

const DateActive = styled.button`
  background-color: white;
  cursor: pointer;
  border-radius: 5px;
  color: black;
  font-size: 11px;

  &:active {
    transform: scale(0.9);
  }

  ${(props) => {
    if (props.$active) {
      return css`
        background-color: black;
        color: white;
      `;
    }
  }}
`;

const RevenueChart = styled.div`
  border: 1px solid rgba(255, 0, 0, 1);
  border-radius: 5px;

  > div:nth-of-type(2) {
    display: flex;
    border-bottom: 1px solid rgba(255, 0, 0, 1);

    & h4 {
      font-size: 14px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
    }

    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1rem;
    }

    > div:nth-child(1),
    > div:nth-child(2),
    > div:nth-child(3) {
      border-right: 1px solid rgba(255, 0, 0, 1);
    }
  }

  > div:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 0, 0, 1);
    padding: 1rem 1.5rem;

    > div {
      display: flex;
      gap: 2px;
    }
  }
`;

const LocationChart = styled.div`
  border: 1px solid rgba(255, 0, 0, 1);
  border-radius: 5px;
`;

const ChartBoxStyled = styled.div`
  cursor: pointer;

  ${(props) => {
    if (props.$active == true) {
      return css`
        background-color: black;
        color: white !important;
        * {
          color: white !important;
        }
      `;
    }
  }};
`;

const BottomChart = styled.div`
  display: flex;
  gap: 1rem;

  > div {
    flex: 1;
    border: 1px solid red;
    border-radius: 5px;
  }
`;

const BestHost = styled.div``;

const UserColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 10px;
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

const TableContent = styled.table`
  text-align: left;
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

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
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

/* #endregion */

export default function DashBoard() {
  const now = new Date();
  const navigate = useNavigate();
  const [date, setDate] = useState([
    new Date(now.getFullYear(), now.getMonth(), 1),
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  ]);

  const [isDateDropDown, setIsDateDropDown] = useState(false);
  const admin = AdminRequest();
  const getCountChart = GetCountChartRequest(
    moment(date[0]).format("YYYY-MM-DD"),
    moment(date[1]).format("YYYY-MM-DD")
  );
  const getBestHost = GetBestHost();

  const [chartDate, setChartDate] = useState({
    type: "ALL",
    start: new Date(2022, 0, 1),
    end: new Date(now.getFullYear(), 11, 1),
  });

  const getBookingChart = GetBookingChartRequest(
    moment(chartDate.start).format("YYYY-MM-DD"),
    moment(chartDate.end).format("YYYY-MM-DD")
  );

  const [chartType, setChartType] = useState("Booking");

  const [data, setData] = useState([]);

  useEffect(() => {
    if (getBookingChart.isSuccess) {
      const startDate = chartDate.start;
      const endDate = chartDate.end;

      if (chartDate.type == "ALL") {
        const yearList = generateYears(startDate, endDate);

        const dataList = [];

        yearList.forEach((year) => {
          const yearObjData = {
            name: year,
            Booking: chartType == "Booking" ? 0 : null,
            Earning: chartType == "Earning" ? 0 : null,
            Refund: chartType == "Refund" ? 0 : null,
          };

          getBookingChart.data.data.reduce((prev, item) => {
            const bookingDate = new Date(item.transferOn);

            if (bookingDate.getFullYear() == year) {
              if (chartType == "Booking") {
                prev.Booking = prev.Booking + 1;
              }

              if (chartType == "Earning") {
                if (item.transactionType == "website_fee") {
                  prev.Earning += item.amount;
                }
              }

              if (chartType == "Refund") {
                if (item.transactionType == "website_fee") {
                  prev.Refund += item.amount;
                }
              }
            }

            return prev;
          }, yearObjData);

          dataList.push(yearObjData);
        });

        setData(dataList);
      }

      if (chartDate.type == "6M" || chartDate.type == "1Y") {
        const monthList = generateMonths(startDate, endDate);

        const dataList = [];

        monthList.forEach((month) => {
          const monthObjData = {
            name: month[0],
            Booking: chartType == "Booking" ? 0 : null,
            Earning: chartType == "Earning" ? 0 : null,
            Refund: chartType == "Refund" ? 0 : null,
          };

          getBookingChart.data.data.reduce((prev, item) => {
            const bookingDate = new Date(item.transferOn);

            if (bookingDate.getFullYear() == month[2] && bookingDate.getMonth() == month[1]) {
              if (chartType == "Booking") {
                prev.Booking = prev.Booking + 1;
              }

              if (chartType == "Earning") {
                if (item.transactionType == "website_fee") {
                  prev.Earning += item.amount;
                }
              }

              if (chartType == "Refund") {
                if (item.transactionType == "website_fee") {
                  prev.Refund += item.amount;
                }
              }
            }

            return prev;
          }, monthObjData);

          dataList.push(monthObjData);
        });

        setData(dataList);
      }

      if (chartDate.type == "1M") {
        const weekList = generateWeeks(startDate, endDate);

        const dataList = [];

        weekList.forEach((week) => {
          const weekObjData = {
            name: week.summary,
            Booking: chartType == "Booking" ? 0 : null,
            Earning: chartType == "Earning" ? 0 : null,
            Refund: chartType == "Refund" ? 0 : null,
          };

          getBookingChart.data.data.reduce((prev, item) => {
            const bookingDate = new Date(item.transferOn);

            if (
              moment(bookingDate).isAfter(moment(week.weekStart)) &&
              moment(bookingDate).isBefore(moment(week.weekEnd))
            ) {
              if (chartType == "Booking") {
                prev.Booking = prev.Booking + 1;
              }

              if (chartType == "Earning") {
                if (item.transactionType == "website_fee") {
                  prev.Earning += item.amount;
                }
              }

              if (chartType == "Refund") {
                if (item.transactionType == "website_fee") {
                  prev.Refund += item.amount;
                }
              }
            }

            return prev;
          }, weekObjData);

          dataList.push(weekObjData);
        });

        setData(dataList);
      }
    }
  }, [chartDate, getBookingChart.isSuccess, chartType]);

  return (
    <Container>
      <Header>
        <div>
          <h4>Good Morning, {admin.data.data.firstName}!</h4>
          <p>Here's what's happening with UrbanNest today.</p>
        </div>
        <div>
          <CustomTextInput onClick={() => setIsDateDropDown((prev) => !prev)}>
            <StyledTextInput value={formatDateRange(date[0], date[1])} readOnly={true} />
            <div>
              <MdOutlineDateRange />
            </div>
          </CustomTextInput>
          {isDateDropDown && (
            <DropDownContainer>
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
        </div>
      </Header>
      <BoxContainer>
        <BoxStyled>
          <div>
            <h4>TOTAL EARNINGS</h4>
          </div>
          <div>
            <div>
              <h3>
                $
                {getCountChart.isSuccess && getCountChart.data.data.totalEarning
                  ? formatDollar(getCountChart.data.data.totalEarning)
                  : 0}
              </h3>
              <Link>View net earnings</Link>
            </div>
            <div>
              <RiMoneyDollarCircleLine />
            </div>
          </div>
        </BoxStyled>

        <BoxStyled>
          <div>
            <h4>BOOKINGS</h4>
          </div>
          <div>
            <div>
              <h3>{getCountChart.isSuccess && formatNumber(getCountChart.data.data.bookings)}</h3>
              {admin.data.data.roles.find(
                (role) => role.roleName == "ADMIN" || role.roleName == "BOOKING_MANAGEMENT"
              ) && <Link to={"/admin/booking_list"}>View all bookings</Link>}
            </div>
            <div>
              {" "}
              <FaRegCalendar />
            </div>
          </div>
        </BoxStyled>
        <BoxStyled>
          <div>
            <h4>CUSTOMERS</h4>
          </div>
          <div>
            <div>
              <h3>{getCountChart.isSuccess && formatNumber(getCountChart.data.data.customers)}</h3>
              {admin.data.data.roles.find(
                (role) => role.roleName == "ADMIN" || role.roleName == "USER_MANAGEMENT"
              ) && <Link to={"/admin/user_list"}>See details</Link>}
            </div>
            <div>
              <CgProfile />
            </div>
          </div>
        </BoxStyled>
        <BoxStyled>
          <div>
            <h4>PROPERTIES</h4>
          </div>
          <div>
            <div>
              <h3>{getCountChart.isSuccess && formatNumber(getCountChart.data.data.properties)}</h3>
              {admin.data.data.roles.find(
                (role) => role.roleName == "ADMIN" || role.roleName == "PROPERTY_MANAGEMENT"
              ) && <Link to={"/admin/listing_list"}>See details</Link>}
            </div>
            <div>
              <FaHouseUser />
            </div>
          </div>
        </BoxStyled>
      </BoxContainer>
      <ChartStyled>
        <RevenueChart>
          <div>
            <h4>Revenue from {formatDateRange(chartDate.start, chartDate.end)}</h4>
            <div>
              <DateActive
                $active={chartDate.type == "ALL"}
                onClick={() => {
                  setChartDate({
                    type: "ALL",
                    start: new Date(2022, 0, 1),
                    end: new Date(now.getFullYear(), 11, 1),
                  });
                }}
              >
                ALL
              </DateActive>
              <DateActive
                $active={chartDate.type == "1M"}
                onClick={() => {
                  setChartDate({
                    type: "1M",
                    start: new Date(now.getFullYear(), now.getMonth(), 1),
                    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                  });
                }}
              >
                1M
              </DateActive>
              <DateActive
                $active={chartDate.type == "6M"}
                onClick={() => {
                  setChartDate({
                    type: "6M",
                    start: new Date(now.getFullYear(), now.getMonth() - 6, 1),
                    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                  });
                }}
              >
                6M
              </DateActive>
              <DateActive
                $active={chartDate.type == "1Y"}
                onClick={() => {
                  setChartDate({
                    type: "1Y",
                    start: new Date(now.getFullYear(), now.getMonth() - 12, 1),
                    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                  });
                }}
              >
                1Y
              </DateActive>
            </div>
          </div>
          <div>
            <ChartBoxStyled
              $active={chartType == "Booking"}
              onClick={() => setChartType("Booking")}
            >
              <h4>{getBookingChart.isSuccess && formatNumber(getBookingChart.data.data.length)}</h4>
              <p>Booking</p>
            </ChartBoxStyled>
            <ChartBoxStyled
              $active={chartType == "Earning"}
              onClick={() => setChartType("Earning")}
            >
              <h4>
                $
                {getBookingChart.isSuccess &&
                  formatDollar(
                    getBookingChart.data.data
                      .filter((item) => item.transactionType == "website_fee")
                      .reduce((prev, current) => {
                        prev += current.amount;
                        return prev;
                      }, 0)
                  )}
              </h4>
              <p>Earnings</p>
            </ChartBoxStyled>
            <ChartBoxStyled $active={chartType == "Refund"} onClick={() => setChartType("Refund")}>
              <h4>
                {getBookingChart.isSuccess &&
                  formatNumber(
                    getBookingChart.data.data
                      .filter((item) => item.transactionType == "refund")
                      .reduce((prev) => {
                        prev += 1;
                        return prev;
                      }, 0)
                  )}
              </h4>
              <p>Refunds</p>
            </ChartBoxStyled>
            <div>
              <h4>
                {getBookingChart.isSuccess &&
                  formatDollar(
                    (getBookingChart.data.data
                      .filter((item) => item.transactionType == "website_fee")
                      .reduce((prev) => {
                        prev += 1;
                        return prev;
                      }, 0) /
                      getBookingChart.data.data.reduce((prev) => {
                        prev += 1;
                        return prev;
                      }, 0)) *
                      100
                  )}{" "}
                %
              </h4>
              <p>Conversation Ratio</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip />
              <Legend />
              <Area
                formatter={(value) => formatNumber(value)}
                type="monotone"
                dataKey="Refund"
                fill="#8884d8"
                stroke="#8884d8"
              />
              <Bar
                dataKey="Booking"
                formatter={(value) => formatNumber(value)}
                barSize={40}
                fill="#413ea0"
              />
              <Line
                formatter={(value) => formatDollar(value) + "$"}
                type="monotone"
                dataKey="Earning"
                stroke="#ff7300"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </RevenueChart>
        <LocationChart>
          <BookingMap />
        </LocationChart>
      </ChartStyled>
      <BottomChart>
        <BestHost>
          <TableContent>
            <thead>
              <th>TOP HOST</th>
              <th>PROPERTY</th>
              <th>JOIN SINCE</th>
              <th>Revenue</th>
            </thead>
            <tbody>
              {getBestHost.isSuccess &&
                getBestHost.data.data.map((host, index) => {
                  if (index < 5)
                    return (
                      <tr key={index}>
                        <td>
                          <UserColumn
                            onClick={() => navigate("/admin/user_list?search=" + host.email)}
                          >
                            <div>
                              <Avatar round size="40" src={host.avatar} name={host.firstName} />
                            </div>
                            <div>
                              <h4>{host.email}</h4>
                              <p>
                                {host.firstName} {host.lastName}
                              </p>
                            </div>
                          </UserColumn>
                        </td>
                        <td>
                          <PropertyColumn
                            onClick={() =>
                              navigate("/admin/listing_list?property=" + host.bestProperty.id)
                            }
                          >
                            <div>
                              <Avatar
                                round={12}
                                size="50"
                                src={host.bestProperty.propertyImages[0]}
                              />
                            </div>
                            <div>
                              <h4>{getWords(host.bestProperty.propertyTitle, 3)}</h4>
                              <p>{host.bestProperty.propertyCity}</p>
                              <ReactStars
                                edit={false}
                                onChange={() => {}}
                                size={20}
                                count={5}
                                color="black"
                                activeColor="#FFD700"
                                value={host.bestProperty.averageRating}
                                isHalf={true}
                                emptyIcon={<FaRegStar />}
                                halfIcon={<FaStarHalfStroke />}
                                filledIcon={<FaStar />}
                              />
                            </div>
                          </PropertyColumn>
                        </td>
                        <td>
                          <p>{formatDate(host.createdAt)}</p>
                        </td>
                        <td>
                          <h4>${formatDollar(host.revenue)}</h4>
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </TableContent>
        </BestHost>
      </BottomChart>
    </Container>
  );
}

function generateMonths(startDate, endDate) {
  const start = new Date(startDate); // Ensure valid Date objects
  const end = new Date(endDate);
  const months = [];

  if (start > end) {
    throw new Error("Start date must be earlier than end date.");
  }

  while (start <= end) {
    const month = `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, "0")}`;
    months.push([month, start.getMonth(), start.getFullYear()]);

    start.setMonth(start.getMonth() + 1);
  }

  return months;
}

function generateYears(startDate, endDate) {
  const start = new Date(startDate); // Ensure valid Date objects
  const end = new Date(endDate);
  const years = [];

  for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
    years.push(year.toString());
  }

  return years;
}

function generateWeeks(startDate, endDate) {
  const start = new Date(startDate); // Ensure valid Date objects
  const end = new Date(endDate);
  const weeks = [];
  let weekCount = 1; // To track the week number

  if (start > end) {
    throw new Error("Start date must be earlier than end date.");
  }

  let currentWeekStart = new Date(start);

  while (currentWeekStart <= end) {
    const weekStart = new Date(currentWeekStart); // Start of the week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of the week (6 days after start)

    // Ensure the week end date doesn't exceed the given end date
    if (weekEnd > end) {
      weekEnd.setTime(end.getTime());
    }

    weeks.push({
      summary: `${formatDateWeek(weekStart)}-${formatDateWeek(weekEnd)}`,
      weekStart: weekStart.toISOString().split("T")[0], // Format: YYYY-MM-DD
      weekEnd: weekEnd.toISOString().split("T")[0],
    });

    weekCount++;
    // Move to the next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }
  console.log(weeks);

  return weeks;
}

// Helper function to format the date as "MMM D"
function formatDateWeek(date) {
  const options = { month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
