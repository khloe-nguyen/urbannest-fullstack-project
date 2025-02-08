import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import styled from "styled-components";
import moment from "moment";
const StyledContainerCalendar = styled.div`
  max-width: 100%;
`;
export default function CalendarBook({ data, setSelectedDates, selectedDates }) {
  let maxSelectableDate = moment().add(data.maximumMonthPreBook, "months").date(moment().date());

  let minDate = new Date();

  if (data.bookingType === "reserved") {
    minDate = moment().add(3, "days").toDate();
  }

  const bookDateDetails = data.bookDateDetails;
  const notAvailableDates = data.notAvailableDates;

  console.log("abcd", bookDateDetails);

  const unavailableDates = [
    ...bookDateDetails.map((date) => new Date(moment(date.night).format("YYYY-MM-DD"))),
    ...notAvailableDates.map((date) => new Date(moment(date.date).format("YYYY-MM-DD"))),
  ];

  const isTileDisabled = ({ date, view }) => {
    if (view === "month") {
      return unavailableDates.some(
        (disabledDate) =>
          date.getFullYear() === disabledDate.getFullYear() &&
          date.getMonth() === disabledDate.getMonth() &&
          date.getDate() === disabledDate.getDate()
      );
    }
    return false;
  };

  const listDate = (dates) => {
    const [start, end] = dates;
    const allDatesInRange = [];
    let current = moment(start);

    while (current.isSameOrBefore(end, "day")) {
      allDatesInRange.push(current.toDate());
      current.add(1, "day");
    }
    return allDatesInRange;
  };

  const handleDateChange = (dates) => {
    const [startDate, endDate] = dates;
    if (!startDate || !endDate) {
      return;
    }
    const selectedDuration = moment(endDate).diff(moment(startDate), "days");
    console.log(selectedDuration);
    const list = listDate(dates);
    if (list != null) {
      const listDateChosen = list.map((date) => new Date(moment(date).format("YYYY-MM-DD")));
      const isConflict = listDateChosen.some((chosenDate) =>
        unavailableDates.some((unavailableDate) =>
          moment(chosenDate).isSame(unavailableDate, "day")
        )
      );
      if (isConflict) {
        setSelectedDates([]);
        return;
      }
    }
    if (data.minimumStay == null && data.maximumStay == null) {
      setSelectedDates(dates);
      return;
    }
    if (data.minimumStay != null && data.maximumStay == null) {
      if (selectedDuration < data.minimumStay) {
        setSelectedDates([]);
        return;
      }
    }
    if (data.maximumStay != null && data.minimumStay == null) {
      if (selectedDuration > data.maximumStay) {
        setSelectedDates([]);
        return;
      }
    }
    if (
      data.minimumStay != null &&
      data.maximumStay != null &&
      (selectedDuration < data.minimumStay || selectedDuration > data.maximumStay)
    ) {
      setSelectedDates([dates[0], null]);
      return;
    }
    setSelectedDates(dates);
  };

  return (
    <StyledContainerCalendar>
      <div>
        <Calendar
          tileDisabled={isTileDisabled}
          view="month"
          allowPartialRange={true}
          selectRange={true}
          next2Label={null}
          prev2Label={null}
          nextLabel={<FontAwesomeIcon icon={faAngleRight} />}
          prevLabel={<FontAwesomeIcon icon={faAngleLeft} />}
          minDate={minDate}
          maxDate={maxSelectableDate.toDate()}
          onChange={handleDateChange}
          value={selectedDates}
          showDoubleView={true}
        />
      </div>
    </StyledContainerCalendar>
  );
}
