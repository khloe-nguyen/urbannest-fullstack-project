import { useEffect } from "react";
import styled, { css } from "styled-components";
import { useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GetHostReservationRequest } from "./api/hostReservationApi";
import Pagination from "@/shared/components/Pagination/Pagination";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import formatDollar from "@/shared/utils/FormatDollar";
import { useRef } from "react";
import BookingDetail from "../hosting/components/BookingDetail";
import ConflictPopUp from "./components/ConflictPopUp";
import SelectInput from "@/shared/components/Input/SelectInput";
import TextInput from "@/shared/components/Input/TextInput";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { GetHostCalendarRequest } from "../host_calendar/api/hostCalendarApi";

const ContainerStyled = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h2 {
    font-size: 30px;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;

  > div:nth-of-type(1) {
    cursor: pointer;

    svg {
      font-size: 25px;
    }
  }
`;

const ReservationStyled = styled.div``;

const ReservationHeaderStyled = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 10px;

  > button {
    background-color: white;
    border: none;
    font-size: 18px;
    padding-bottom: 10px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.7);
    border-bottom: 2px solid white;
  }
`;

const HeaderButtonStyled = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid black !important;
      `;
    }
  }}
`;

const TableContentStyled = styled.table`
  margin: 1rem 0;
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;

  thead tr {
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  tbody tr {
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:hover {
    background-color: #f7f7f7;
  }

  tbody tr svg {
    font-size: 20px;
    color: white;
  }
  tbody tr:hover svg {
    color: black;
    font-size: 20px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const FooterStyled = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
`;

const StatusStyled = styled.div`
  color: red;
  font-size: 16px;
`;

const DropDownContainerStyled = styled.div`
  position: relative;

  > button {
    background-color: white;
    border-radius: 5px;
    padding: 5px 10px;
    cursor: pointer;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const DropDownStyled = styled.div`
  z-index: 1;
  position: absolute;
  width: 9rem;
  border-radius: 15px;

  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  transform: translate(-4.5rem, 10px);

  > button {
    width: 100%;
    background-color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }

  > button:hover {
    background-color: #f7f7f7;
  }

  > button:first-child {
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
  }

  > button:last-child {
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
  }
`;

const FilterContainerStyled = styled.div`
  position: relative;

  > button {
    background-color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 10px 1rem;
    border-radius: 25px;
    cursor: pointer;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const FilterDropDownStyled = styled.div`
  position: absolute;
  width: 20rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  border-radius: 5px;

  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  padding: 1rem;

  transform: translate(-14rem, 0.5rem);

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;

    > p {
      color: rgba(0, 0, 0, 0.5);
    }
  }

  > div:nth-of-type(2) {
    > div {
      display: flex;
    }
  }

  > div:nth-of-type(3) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    > button {
      background-color: black;
      cursor: pointer;
      padding: 10px;
      color: white;
      border-radius: 5px;
    }
  }
`;

const CalendarStyled = styled(Calendar)`
  border: none;
`;

export default function HostReservation() {
  const [chosenProperty, setChosenProperty] = useState({});
  const getHostCalendar = GetHostCalendarRequest();
  const [onFilter, setOnFilter] = useState();
  const [filterDate, setFilterDate] = useState([]);
  const [onDropDown, setOnDropDown] = useState();
  const navigate = useNavigate();
  const [chosenHeader, setChosenHeader] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);
  const getHostReservation = GetHostReservationRequest(
    currentPage - 1,
    10,
    chosenHeader,
    chosenProperty.value,
    filterDate[0] ? moment(filterDate[0]).format("YYYY-MM-DD") : null,
    filterDate[1] ? moment(filterDate[1]).format("YYYY-MM-DD") : null
  );
  const dropDownContainerRef = useRef();
  const dropDownButtonRef = useRef();
  const [showBookDetail, setShowBookDetail] = useState();
  const [showConfict, setShowConfict] = useState();
  const filterButtonRef = useRef();
  const filterContainerRef = useRef();

  useEffect(() => {
    const event = (ev) => {
      const dropdowns = document.querySelectorAll(".dropdown");

      if (
        dropDownContainerRef.current &&
        !Array.from(dropdowns).find((dropdown) => dropdown.contains(ev.target)) &&
        !dropDownContainerRef.current.contains(ev.target)
      ) {
        setOnDropDown(null);
      }

      if (
        filterContainerRef.current &&
        !filterButtonRef.current.contains(ev.target) &&
        !filterContainerRef.current.contains(ev.target)
      ) {
        setOnFilter(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  return (
    <>
      <ContainerStyled>
        <HeaderStyled>
          <div>
            <MdKeyboardArrowLeft onClick={() => navigate("/hosting")} />
          </div>
          <FilterContainerStyled>
            <button ref={filterButtonRef} onClick={() => setOnFilter((prev) => !prev)}>
              <FaFilter /> Filter
            </button>
            {onFilter && (
              <FilterDropDownStyled ref={filterContainerRef}>
                <div>
                  <p>Select a listing</p>
                  <SelectInput
                    state={chosenProperty}
                    setState={setChosenProperty}
                    options={
                      getHostCalendar.isSuccess &&
                      getHostCalendar.data.data.map((property) => {
                        return { label: property.propertyTitle, value: property.id };
                      })
                    }
                  />
                </div>
                <div>
                  <p>Reservations that start or end within the following dates.</p>
                  <div>
                    <TextInput
                      state={filterDate[0] ? formatDate(filterDate[0]) : ""}
                      placeholder={"From"}
                    />
                    <TextInput
                      state={filterDate[1] ? formatDate(filterDate[1]) : ""}
                      placeholder={"To"}
                    />
                  </div>
                  <div>
                    <CalendarStyled
                      selectRange={true}
                      onChange={(value) => {
                        if (moment(value[0]).isSame(moment(value[1]), "days")) {
                          return;
                        }
                        setFilterDate(value);
                      }}
                      value={filterDate}
                    />
                  </div>
                </div>
                <hr />
                <div>
                  <button
                    onClick={() => {
                      setChosenProperty({});
                      setFilterDate([]);
                    }}
                  >
                    Clear filter
                  </button>
                </div>
              </FilterDropDownStyled>
            )}
          </FilterContainerStyled>
        </HeaderStyled>
        <h2>Reservations</h2>
        <ReservationStyled>
          <ReservationHeaderStyled>
            <HeaderButtonStyled
              $active={chosenHeader == "PENDING"}
              onClick={() => setChosenHeader("PENDING")}
            >
              Upcoming
            </HeaderButtonStyled>
            <HeaderButtonStyled
              $active={chosenHeader == "ACCEPT"}
              onClick={() => setChosenHeader("ACCEPT")}
            >
              Completed
            </HeaderButtonStyled>
            <HeaderButtonStyled
              $active={chosenHeader == "DENIED"}
              onClick={() => setChosenHeader("DENIED")}
            >
              Canceled
            </HeaderButtonStyled>
            <HeaderButtonStyled
              $active={chosenHeader == "All"}
              onClick={() => setChosenHeader("All")}
            >
              All
            </HeaderButtonStyled>
          </ReservationHeaderStyled>

          <TableContentStyled>
            <thead>
              <tr>
                <th>
                  <h4>Status</h4>
                </th>
                <th>
                  <h4>Guests</h4>
                </th>
                <th>
                  <h4>Check-in</h4>
                </th>
                <th>
                  <h4>Checkout</h4>
                </th>
                <th>
                  <h4>Booked</h4>
                </th>
                <th>
                  <h4>Listing</h4>
                </th>
                <th>
                  <h4>Total payout</h4>
                </th>
              </tr>
            </thead>
            <tbody>
              {getHostReservation.isSuccess &&
                getHostReservation.data.data.map((reservation, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <StatusStyled>
                          {reservation.status == "PENDING" && <h4>Pending</h4>}
                          {reservation.status == "DENIED" && <h4>Denied</h4>}
                          {reservation.status == "ACCEPT" && <h4>Accept</h4>}
                        </StatusStyled>
                      </td>
                      <td>
                        <div>
                          <span>
                            {reservation.customer.firstName} {reservation.customer.lastName}
                          </span>
                          <p>{reservation.totalPerson} guests</p>
                        </div>
                      </td>
                      <td>{formatDate(reservation.checkInDay)}</td>
                      <td>{formatDate(reservation.checkOutDay)}</td>
                      <td>{formatDate(reservation.createdAt)}</td>
                      <td>{reservation.property.propertyTitle}</td>
                      <td>$ {formatDollar(reservation.hostFee)}</td>
                      <td>
                        <DropDownContainerStyled>
                          <button
                            className="dropdown"
                            ref={dropDownButtonRef}
                            onClick={() =>
                              setOnDropDown((prev) => {
                                if (prev == reservation.id) {
                                  return null;
                                }
                                return reservation.id;
                              })
                            }
                          >
                            Details
                          </button>
                          {onDropDown == reservation.id && (
                            <DropDownStyled ref={dropDownContainerRef}>
                              <button onClick={() => setShowBookDetail(reservation)}>
                                Booking detail
                              </button>
                              {reservation.status == "PENDING" && (
                                <button onClick={() => setShowConfict(reservation)}>
                                  Change or cancel
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  navigate("/hosting/host_messages", {
                                    state: { userId: reservation.customer.id },
                                  })
                                }
                              >
                                Send message
                              </button>
                              <button
                                onClick={() =>
                                  navigate("/become_a_host/" + reservation.property.id)
                                }
                              >
                                Check listing
                              </button>
                            </DropDownStyled>
                          )}
                        </DropDownContainerStyled>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </TableContentStyled>

          <FooterStyled>
            {getHostReservation.isSuccess && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPage={getHostReservation.data.totalPages}
              />
            )}
          </FooterStyled>
        </ReservationStyled>
      </ContainerStyled>
      {showBookDetail && (
        <BookingDetail booking={showBookDetail} action={() => setShowBookDetail()} />
      )}
      {showConfict && (
        <ConflictPopUp
          getHostReservation={getHostReservation}
          action={() => setShowConfict()}
          book={showConfict}
        />
      )}
    </>
  );
}
