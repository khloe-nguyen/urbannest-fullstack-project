import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled, { css } from "styled-components";
import { GetHostCalendarRequest } from "./api/hostCalendarApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import ListingSelectionPopUp from "./components/ListingSelectionPopUp";
import { GetBookingOfPropertyRequest } from "./api/hostCalendarApi";
import Avatar from "react-avatar";
import RedButton from "@/shared/components/Button/RedButton1";
import WhiteButton from "@/shared/components/Button/WhiteButton";
import TextInput from "@/shared/components/Input/TextInput";
import XButton from "@/shared/components/Button/XButton";
import formatDateRange from "@/shared/utils/formatDateRange";
import { UpdateNotAvailableDateRequest } from "./api/hostCalendarApi";
import { UpdateExceptionDateRequest } from "./api/hostCalendarApi";
import { OpenNotAvailableDateRequest } from "./api/hostCalendarApi";
import NumberInput from "@/shared/components/Input/NumberInput";
import BookingDetail from "../hosting/components/BookingDetail";
import formatDollar from "@/shared/utils/FormatDollar";
import { useParams } from "react-router";
import {
  ChangeBasePriceRequest,
  ChangeMonthlyDiscountRequest,
  ChangeWeeklyDiscountRequest,
} from "../hosting/api/hostingApi";

const localizer = momentLocalizer(moment);

/* #region  styled */
const ContainerStyled = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  height: 88vh;
`;

const CalendarStyled = styled.div`
  height: 100%;
`;

const RightStyled = styled.div`
  padding: 1rem;
  height: 88vh;

  overflow: auto;
`;

const ButtonContainerStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: start;

  > button {
    background-color: white;
    padding: 20px 3rem;
    border-radius: 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  > button:active {
    transform: scale(0.9);
  }

  & svg {
    font-size: 25px;
  }
`;

const RightHeaderStyled = styled.div`
  padding: 1rem;
  & h4 {
    font-size: 25px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
    font-size: 17px;
  }
`;

const BasePriceStyled = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    > h4 {
      font-size: 20px;
    }

    > span {
      font-size: 14px;
      text-decoration: underline;
      font-weight: 600;
    }
  }

  > div:nth-of-type(2) {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    gap: 0.6rem;
    border-radius: 20px;
    padding: 1.5rem;

    > span:nth-of-type(1) {
      font-weight: 600;
    }

    > span:nth-of-type(2) {
      font-weight: 600;
      font-size: 35px;
    }
  }
`;

const DiscountStyled = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;

    > h4 {
      font-size: 20px;
    }

    > p {
      font-size: 17px;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  > div:nth-of-type(2),
  > div:nth-of-type(3) {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    gap: 0.3rem;
    border-radius: 20px;
    padding: 1.5rem;

    > span:nth-of-type(1) {
      font-weight: 600;
      font-size: 35px;
    }

    > div {
      display: flex;
      flex-direction: column;

      > span:nth-of-type(1) {
        color: rgba(0, 0, 0, 0.7);
        font-size: 15px;
      }

      > span:nth-of-type(2) {
        color: rgba(0, 0, 0, 0.5);
        font-size: 14px;
      }
    }
  }
`;

const ChangeBasePriceStyled = styled.div`
  margin: 10rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  & h4 {
    font-size: 18px;
  }

  > div:nth-of-type(1) {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    gap: 0.6rem;
    border-radius: 20px;
    padding: 1.5rem;

    > span:nth-of-type(1) {
      font-weight: 600;
    }

    > span:nth-of-type(2) {
      font-weight: 600;
      font-size: 35px;
    }

    > div {
      display: flex;
      align-items: center;
      font-weight: 900;
      > span {
        font-size: 30px;
      }

      > input {
        border: none;
        font-size: 30px;
        text-decoration: underline;
      }
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    & button {
      width: 100%;
    }
  }
`;

const ChangeWeeklyDiscountStyled = styled.div`
  margin: 10rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  & h4 {
    font-size: 18px;
  }

  > div:nth-of-type(1) {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    gap: 0.6rem;
    border-radius: 20px;
    padding: 1.5rem;

    > span:nth-of-type(1) {
      font-weight: 600;
    }

    > span:nth-of-type(2) {
      color: rgba(0, 0, 0, 0.5);
    }

    > div {
      display: flex;
      align-items: center;
      font-weight: 900;
      > span {
        font-size: 30px;
      }

      > input {
        border: none;
        font-size: 30px;
        text-decoration: underline;
      }
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    & button {
      width: 100%;
    }
  }
`;

const SelectedDayStyled = styled.div`
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div:nth-of-type(1) {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    > span {
      font-weight: 900;
      font-size: 30px;
      text-decoration: underline;
    }
  }

  > div:nth-of-type(2) {
    display: flex;
    border-radius: 25px;
    gap: 5px;
    background-color: #f0f0f0;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    padding: 5px;

    > button {
      flex: 1;
      border-radius: 25px;
      border: none;
      cursor: pointer;
      padding: 10px;
    }
  }
`;

const OpenButtonStyled = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        background-color: black;
        color: white;
      `;
    }
  }}
`;

const BlockButtonStyled = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        background-color: black;
        color: white;
      `;
    }
  }}
`;

const PricesStyled = styled.div`
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 2rem;
  border-radius: 25px;
  font-size: 30px;
  font-weight: 900;
  cursor: pointer;
`;

const CustomPricesStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  > div {
    display: flex;
    align-items: center;
    gap: 1rem;

    > span {
      font-size: 30px;
      font-weight: 900;
    }
    > input {
      border: none !important;
      font-size: 30px;
      text-decoration: underline;
      font-weight: 900;
    }
  }
`;

/* #endregion */

const CustomEvent = ({ event }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>
        {event.avatar && <Avatar round size="40" src={event.avatar} name={event.title} />}{" "}
        {event.title}
      </span>
    </div>
  );
};

export default function HostCalendar() {
  /* #region state */

  const changeBasePrice = ChangeBasePriceRequest();
  const changeWeeklyDiscount = ChangeWeeklyDiscountRequest();
  const changeMonthlyDiscount = ChangeMonthlyDiscountRequest();

  const [showBookingDetail, setShowBookingDetail] = useState();
  const [isChangeCustomPrice, setIsChangeCustomPrice] = useState(false);
  const [changeCustomPrice, setChangeCustomPrice] = useState();
  const openNotAvailableDate = OpenNotAvailableDateRequest();
  const updateNotAvailableDate = UpdateNotAvailableDateRequest();
  const updateExceptionDate = UpdateExceptionDateRequest();
  const [basePrice, setBasePrice] = useState();
  const [monthlyDiscount, setMonthlyDiscount] = useState();
  const [weeklyDiscount, setWeeklyDiscount] = useState();
  const [currentStartDate, setCurrentStartDate] = useState(moment().startOf("day").toDate());
  const [currentEndDate, setCurrentEndDate] = useState(moment().endOf("month").toDate());
  const [isSelectedPopUp, setIsSelectedPopUp] = useState(false);
  const [chosenProperty, setChosenProperty] = useState({});
  const [events, setEvents] = useState([]);
  const [priceEvent, setPriceEvent] = useState([]);
  const [bookingEvent, setBookingEvent] = useState([]);
  const [disabledDate, setDisabledDate] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const getHostCalendar = GetHostCalendarRequest();
  const getBookingOfProperty = GetBookingOfPropertyRequest(chosenProperty?.id);
  const [isChangePrice, setIsChangePrice] = useState();
  const [isChangeWeeklyDiscount, setIsChangeWeeklyDiscount] = useState();
  const [isChangeMonthlyDiscount, setIsChangeMonthlyDiscount] = useState();
  /* #endregion */

  /* #region process */
  useEffect(() => {
    if (getHostCalendar.isSuccess) {
      const properties = getHostCalendar.data.data.filter(
        (property) =>
          property.status != "PENDING" &&
          property.status != "DENIED" &&
          property.status != "PROGRESS"
      );
      if (properties.length > 0 && chosenProperty.id == null) {
        setChosenProperty(properties[0]);
      }

      if (properties.length > 0 && chosenProperty.id != null) {
        setChosenProperty((prev) => properties.find((item) => item.id == prev.id));
      }
    }
  }, [getHostCalendar.fetchStatus]);

  useEffect(() => {
    if (chosenProperty && getBookingOfProperty.isSuccess) {
      setBasePrice(chosenProperty.basePrice);
      setWeeklyDiscount(chosenProperty.weeklyDiscount);
      setMonthlyDiscount(chosenProperty.monthlyDiscount);
      var blockedDates = [];

      for (let blocked of chosenProperty.propertyNotAvailableDates) {
        blockedDates.push(moment(blocked.date).format("YYYY-MM-DD"));
      }
      setDisabledDate(blockedDates);

      const today = moment(currentStartDate).toDate();
      const endOfMonth = moment(currentEndDate).toDate();

      setPriceEvent(
        generateEventsForRange(today, endOfMonth, chosenProperty.propertyExceptionDates)
      );

      setEvents([
        ...generateEventsForRange(today, endOfMonth, chosenProperty.propertyExceptionDates),
        ...getBookingList(),
      ]);
    }
  }, [chosenProperty, getBookingOfProperty.isSuccess]);

  useEffect(() => {
    if (getBookingOfProperty.isSuccess) {
      const today = currentStartDate;
      const endOfMonth = currentEndDate;

      const prices = generateEventsForRange(
        today,
        endOfMonth,
        chosenProperty.propertyExceptionDates || []
      );
      setPriceEvent(prices);

      setEvents([...getBookingList(), ...prices]);
    }
  }, [getBookingOfProperty.isSuccess]);

  function getBookingList() {
    const eventsClone = [];
    if (getBookingOfProperty?.data?.data) {
      for (let booking of getBookingOfProperty.data.data) {
        eventsClone.push({
          title: `${booking.customer.firstName} ${booking.customer.lastName}`,
          start: moment(booking.checkInDay).toDate(),
          end: moment(booking.checkOutDay).subtract(1, "days").toDate(),
          allDay: true,
          avatar: `${booking.customer.avatar}`,
          bookingId: booking.id,
        });
      }
      return eventsClone;
    }
  }

  const generateEventsForRange = (startDate, endDate, exceptionList = []) => {
    const generatedEvents = [];
    const bookingList = getBookingList() || [];

    let currentDate = moment(startDate);

    if (currentDate.isBefore(moment(), "day")) {
      currentDate = moment();
    }

    let isOK = true;

    while (currentDate.isBefore(endDate, "day") || currentDate.isSame(endDate, "day")) {
      isOK = true;
      for (let event of bookingList) {
        if (
          currentDate.isSameOrAfter(moment(event.start), "days") &&
          currentDate.isSameOrBefore(moment(event.end), "days")
        ) {
          isOK = false;
        }
      }
      if (isOK) {
        let exception = exceptionList.find((item) => moment(item.date).isSame(currentDate, "day"));
        if (exception) {
          generatedEvents.push({
            title: `$ ${formatDollar(exception.basePrice)}`,
            start: currentDate.toDate(),
            end: currentDate.clone().add(1, "hour").toDate(),
            type: "price",
            number: exception.basePrice,
          });
        } else {
          generatedEvents.push({
            title: `$ ${formatDollar(chosenProperty.basePrice)}`,
            start: currentDate.toDate(),
            end: currentDate.clone().add(1, "hour").toDate(),
            type: "price",
            number: chosenProperty.basePrice,
          });
        }
      }

      currentDate.add(1, "day");
    }

    return generatedEvents;
  };

  if (getHostCalendar.isLoading) {
    return <WaitingPopUp />;
  }

  const handleViewChange = (range) => {
    setSelectedDates([]);
    const { start, end } = range;
    setCurrentStartDate(start);
    setCurrentEndDate(end);

    const generatedEvents = generateEventsForRange(
      start,
      end,
      chosenProperty?.propertyExceptionDates || []
    );

    setPriceEvent(generatedEvents);

    setEvents([...generatedEvents, ...getBookingList()]);
  };

  const eventStyle = (event) => {
    if (event.type == "price") {
      return {
        backgroundColor: "rgba(0,0,0,0)",
        color: "black",
        fontWeight: "900",
        display: "flex",
        justifyContent: "flex-end",
      };
    }
    return { backgroundColor: "#32999E", borderRadius: "50px" };
  };

  const dayStyle = (date) => {
    const dateString = moment(date).format("YYYY-MM-DD");

    if (selectedDates.includes(dateString)) {
      return {
        backgroundColor: "red",
        borderRadius: "10px",
      };
    }

    if (disabledDate.includes(dateString)) {
      return {
        backgroundColor: "#5C5C5C",
      };
    }

    if (moment(date).isBefore(moment(), "day")) {
      return {
        backgroundColor: "#f0f0f0",
      };
    }

    return {};
  };

  const handleSelectSlot = (props) => {
    setIsChangePrice(false);
    setIsChangeMonthlyDiscount(false);
    setIsChangeMonthlyDiscount(false);
    const { start, end } = props;
    const startDate = moment(start);
    const endDate = moment(end);
    const newSelectedDates = [];

    const bookingList = getBookingList();

    if (startDate.isBefore(moment().subtract(1, "days"))) {
      return;
    }

    while (startDate.isBefore(endDate)) {
      for (let event of bookingList) {
        if (
          startDate.isAfter(moment(event.start).subtract(1, "days")) &&
          startDate.isBefore(moment(event.end))
        ) {
          return;
        }
      }

      newSelectedDates.push(startDate.format("YYYY-MM-DD"));
      startDate.add(1, "day");
    }

    setSelectedDates(newSelectedDates);
  };

  const handleEventClick = (event) => {
    // alert(`Event clicked: ${event.title}`);
    const bookingId = event.bookingId;
    const booking = getBookingOfProperty.data.data.find((item) => item.id == bookingId);

    setShowBookingDetail(booking);

    console.log(event);
  };

  const isDisabled = (selectedDates) => {
    let isOk = false;
    selectedDates.forEach((selected) => {
      if (disabledDate.includes(selected)) {
        isOk = true;
      }
    });

    return isOk;
  };

  const openNights = (range) => {
    const formData = new FormData();
    formData.append("propertyId", chosenProperty.id);
    formData.append("start", range[0]);
    formData.append("end", range[range.length - 1]);

    openNotAvailableDate.mutate(formData, {
      onSuccess: (response) => {
        console.log(response);
      },
    });

    setDisabledDate((prev) => prev.filter((item) => !range.includes(item)));
  };

  const blockNights = (range) => {
    const formData = new FormData();
    formData.append("propertyId", chosenProperty.id);
    formData.append("start", range[0]);
    formData.append("end", range[range.length - 1]);

    updateNotAvailableDate.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setDisabledDate((prev) => Array.from(new Set([...range, ...prev])));
        }
      },
    });
  };

  const getPrices = () => {
    const prices = [];

    selectedDates.forEach((date) => {
      var price = priceEvent.find((priceDate) =>
        moment(priceDate.start).isSame(moment(date), "days")
      );

      if (price && !prices.includes(price.number)) {
        prices.push(price.number);
      }
    });

    prices.sort();
    if (prices.length == 1) {
      return [prices[0]];
    }

    return [prices[0], prices[prices.length - 1]];
  };

  const onUpdateNewPrice = (range) => {
    const formData = new FormData();
    formData.append("propertyId", chosenProperty.id);
    formData.append("start", range[0]);
    formData.append("end", range[range.length - 1]);
    formData.append("price", changeCustomPrice);

    updateExceptionDate.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          range.forEach((date) => {
            var price = priceEvent.find((priceDate) =>
              moment(priceDate.start).isSame(moment(date), "days")
            );

            if (price) {
              price.number = changeCustomPrice;
              price.title = `$ ${changeCustomPrice}`;
            }
          });
          setIsChangeCustomPrice(false);
          setChangeCustomPrice();
          getHostCalendar.refetch();
        }
      },
    });
  };

  const onChangeMontlyDiscount = (propertyId, monthlyDiscount, off) => {
    if (monthlyDiscount > 99) {
      alert("Not acceptable!");
      return;
    }

    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("monthlyDiscount", monthlyDiscount);

    changeMonthlyDiscount.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getHostCalendar.refetch();
          off();
        }
      },
    });
  };

  const onChangeWeeklyDiscount = (propertyId, weeklyDiscount, off) => {
    if (weeklyDiscount > 99) {
      alert("Not acceptable!");
      return;
    }

    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("weeklyDiscount", weeklyDiscount);

    changeWeeklyDiscount.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getHostCalendar.refetch();
          off();
        }
      },
    });
  };

  const onChangeBasePrice = (propertyId, price, off) => {
    const formData = new FormData();
    formData.append("propertyId", propertyId);
    formData.append("price", price);

    changeBasePrice.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getHostCalendar.refetch();
          off();
        }
      },
    });
  };

  /* #endregion */

  return (
    <>
      <ContainerStyled>
        <CalendarStyled>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            views={["month"]}
            className="calendar"
            onSelectEvent={handleEventClick}
            components={{
              event: CustomEvent, // Use CustomEvent to customize how each event is rendered
            }}
            onDrillDown={(date, view) => {
              if (view === "day") {
                return; // Ngăn chuyển sang view ngày
              }
            }}
            min={moment().startOf("day").toDate()}
            onRangeChange={handleViewChange}
            onSelectSlot={handleSelectSlot}
            eventPropGetter={(event) => ({
              style: eventStyle(event),
            })}
            dayPropGetter={(date) => ({
              style: dayStyle(date),
            })}
          />
        </CalendarStyled>
        <RightStyled>
          {selectedDates.length > 0 && (
            <SelectedDayStyled>
              <div>
                <span>
                  {formatDateRange(selectedDates[0], selectedDates[selectedDates.length - 1])}
                </span>
                <XButton
                  action={() => {
                    setSelectedDates([]);
                    setIsChangeCustomPrice(false);
                  }}
                />
              </div>
              <div>
                <OpenButtonStyled
                  onClick={() => openNights(selectedDates)}
                  $active={!isDisabled(selectedDates)}
                >
                  Open
                </OpenButtonStyled>
                <BlockButtonStyled
                  onClick={() => blockNights(selectedDates)}
                  $active={isDisabled(selectedDates)}
                >
                  Block nights
                </BlockButtonStyled>
              </div>
              {!isChangeCustomPrice && (
                <PricesStyled
                  onClick={() => {
                    setIsChangeCustomPrice(true);
                    setChangeCustomPrice(getPrices()[0]);
                  }}
                >
                  $ {getPrices().join("-")}
                </PricesStyled>
              )}

              {isChangeCustomPrice && (
                <CustomPricesStyled>
                  <div>
                    <span>$ </span>{" "}
                    <NumberInput state={changeCustomPrice} setState={setChangeCustomPrice} />
                  </div>
                  <RedButton onClick={() => onUpdateNewPrice(selectedDates)}>Save</RedButton>
                  <WhiteButton onClick={() => setIsChangeCustomPrice(false)}>Cancel</WhiteButton>
                </CustomPricesStyled>
              )}
            </SelectedDayStyled>
          )}

          {isChangePrice && (
            <ChangeBasePriceStyled>
              <div>
                <span>Per night</span>
                <div>
                  <span>$</span>{" "}
                  <TextInput state={basePrice} setState={(value) => setBasePrice(value)} />
                </div>
              </div>
              <div>
                <RedButton
                  onClick={() =>
                    onChangeBasePrice(chosenProperty.id, basePrice, () => setIsChangePrice())
                  }
                >
                  Save
                </RedButton>
                <WhiteButton
                  onClick={() => {
                    setIsChangePrice(false);
                    setBasePrice(chosenProperty.basePrice);
                  }}
                >
                  Cancel
                </WhiteButton>
              </div>
            </ChangeBasePriceStyled>
          )}

          {isChangeWeeklyDiscount && (
            <ChangeWeeklyDiscountStyled>
              <div>
                <span>Weekly</span>
                <span>For 7 nights or more</span>
                <div>
                  <span>%</span>{" "}
                  <TextInput
                    state={weeklyDiscount}
                    setState={(value) => setWeeklyDiscount(value)}
                  />
                </div>
              </div>
              <div>
                <RedButton
                  onClick={() =>
                    onChangeWeeklyDiscount(chosenProperty.id, weeklyDiscount, () =>
                      setIsChangeWeeklyDiscount()
                    )
                  }
                >
                  Save
                </RedButton>
                <WhiteButton
                  onClick={() => {
                    setIsChangeWeeklyDiscount(false);
                    setWeeklyDiscount(chosenProperty.weeklyDiscount);
                  }}
                >
                  Cancel
                </WhiteButton>
              </div>
            </ChangeWeeklyDiscountStyled>
          )}

          {isChangeMonthlyDiscount && (
            <ChangeWeeklyDiscountStyled>
              <div>
                <span>Monthly</span>
                <span>For 28 nights or more</span>
                <div>
                  <span>%</span>{" "}
                  <TextInput
                    state={monthlyDiscount}
                    setState={(value) => setMonthlyDiscount(value)}
                  />
                </div>
              </div>
              <div>
                <RedButton
                  onClick={() =>
                    onChangeMontlyDiscount(chosenProperty.id, monthlyDiscount, () =>
                      setIsChangeMonthlyDiscount()
                    )
                  }
                >
                  Save
                </RedButton>
                <WhiteButton
                  onClick={() => {
                    setIsChangeMonthlyDiscount(false);
                    setMonthlyDiscount(chosenProperty.monthlyDiscount);
                  }}
                >
                  Cancel
                </WhiteButton>
              </div>
            </ChangeWeeklyDiscountStyled>
          )}

          {!isChangePrice &&
            !isChangeMonthlyDiscount &&
            !isChangeWeeklyDiscount &&
            selectedDates.length == 0 && (
              <>
                <ButtonContainerStyled>
                  <button onClick={() => setIsSelectedPopUp(true)}>
                    <span>{chosenProperty.propertyTitle}</span> <span>|</span>{" "}
                    <MdOutlineKeyboardArrowDown />
                  </button>
                </ButtonContainerStyled>
                <RightHeaderStyled>
                  <h4>Settings</h4>
                  <p>These apply to all nights, unless you customize them by date.</p>
                </RightHeaderStyled>
                <BasePriceStyled>
                  <div>
                    <h4>Base price</h4>
                    <span>USD</span>
                  </div>
                  <div onClick={() => setIsChangePrice(true)}>
                    <span>Per night</span>
                    <span>$ {chosenProperty.basePrice}</span>
                  </div>
                </BasePriceStyled>
                <DiscountStyled>
                  <div>
                    <h4>Discounts</h4>
                    <p>Adjust your pricing to attract more guests.</p>
                  </div>
                  <div onClick={() => setIsChangeWeeklyDiscount(true)}>
                    <div>
                      <span>Weekly</span>
                      <span>For 7 nights or more</span>
                    </div>
                    <span>{chosenProperty.weeklyDiscount} %</span>
                  </div>
                  <div onClick={() => setIsChangeMonthlyDiscount(true)}>
                    <div>
                      <span>Monthly</span>
                      <span>For 28 nights or more</span>
                    </div>
                    <span>{chosenProperty.monthlyDiscount} %</span>
                  </div>
                </DiscountStyled>{" "}
              </>
            )}
        </RightStyled>
      </ContainerStyled>

      {isSelectedPopUp && (
        <ListingSelectionPopUp
          chosenProperty={chosenProperty}
          setChosenProperty={setChosenProperty}
          listings={getHostCalendar.data.data}
          action={() => setIsSelectedPopUp(false)}
        />
      )}
      {showBookingDetail && (
        <BookingDetail
          action={() => setShowBookingDetail()}
          booking={showBookingDetail}
          bookingsFetch={getBookingOfProperty}
        />
      )}
    </>
  );
}
