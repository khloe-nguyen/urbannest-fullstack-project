import styled, { css } from "styled-components";
import { useState } from "react";
import logo from "@/feature/customer/custome_header/assets/URBAN NEST (2).svg";
import Avatar from "react-avatar";
import default_avatar from "@/shared/assets/images/default_avatar.jpg";
import { FaBars } from "react-icons/fa6";
import { useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { useRef } from "react";
import RegisterPopUp from "./components/RegisterPopUp";
import { UserRequest } from "@/shared/api/userApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";
import dchc from "@/shared/data/dchc";
import { ManagedCityRequest } from "@/shared/api/managedCityClientApi";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import CalendarHeader from "./components/CalendarHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faPlus, faSubtract } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { FilterBar } from "../homepage/FilterBar";
import BlackButton from "@/shared/components/Button/BlackButton";
import TextInput from "@/shared/components/Input/TextInput";
import TextThrottleInput from "@/shared/components/Input/TextThrottleInput";

const Container = styled.div`
  z-index: 1;

  > div:nth-of-type(1) {
    padding: 1.4rem 5rem;
    display: flex;
    justify-content: space-between;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  > div:nth-of-type(2) {
    padding: 1.4rem 5rem;
    background-color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const LogoContainer = styled.div`
  width: 170px;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  z-index: 1;

  transition: all 0.4s ease-in-out;
  transform: ${(props) => (props.$event === "SCROLL" ? "scale(0.9)" : "scale(1)")};
`;

const Right = styled.div`
  position: relative;
  display: flex;
  gap: 10px;
  align-items: baseline;

  h5 {
    font-size: 16px;
    cursor: pointer;
  }
`;

const DropDownButton = styled.button`
  > svg {
    font-size: 14px;
  }

  background-color: white;
  cursor: pointer;
  padding: 5px 13px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  gap: 12px;
  border: 2.5px solid white;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

  &:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }

  &:focus {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    border: 2.5px solid black;
    font-weight: 600;
  }
`;

const FilterBarStyled = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.3fr;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;

  ${(props) => {
    if (props.$event == "SCROLL") {
      return css`
        grid-template-columns: 1fr;
      `;
    }
  }}

  gap: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50px;

  > div {
    display: flex;
    flex-direction: column;
    position: relative;
    > button {
      width: 100%;
      background-color: white;
      border-radius: 50px;
      cursor: pointer;
      padding: 1rem 2.5rem;
      border: none;

      display: flex;
      flex-direction: column;
      > p {
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
      }
    }

    > button:hover {
      background-color: #f1f1f1;
    }

    > button:focus {
      box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    }
  }
`;

const PlaceToStay = styled.div`
  > h5 {
    font-size: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &::after {
      content: "";
      position: absolute;
      border-bottom: 2px solid black;
      width: 20px;
      height: 1px;
      transform: translateY(25px);
    }
  }
`;

const ScrollButton = styled.button`
  background-color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 10rem;
  justify-content: space-between;
  padding: 8px 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  font-size: 18px;

  > span {
    display: block;
    border-radius: 50%;

    background-color: red;
    > svg {
      color: white;
      padding: 5px;
      font-size: 30px;
    }
  }
`;

const DropDownContainer = styled.div`
  z-index: 1;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  transform: translate(-20px, 50px);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 15px;

  > button {
    width: 15rem;
    padding: 10px 1rem;
    border: none;
    background-color: white;
    cursor: pointer;
    text-align: left;
  }

  > .focus {
    font-weight: 600;
  }

  > button:hover {
    background-color: #f1f1f1;
  }

  > button:nth-of-type(1) {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  > button:nth-last-child(1) {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

const NotSignUpDropDownContainer = styled.div`
  z-index: 1;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  transform: translate(-150px, 50px);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 15px;

  > button {
    width: 15rem;
    padding: 10px 1rem;
    border: none;
    background-color: white;
    cursor: pointer;
    text-align: left;
  }

  > .focus {
    font-weight: 600;
  }

  > button:hover {
    background-color: #f1f1f1;
  }

  > button:nth-of-type(1) {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }

  > button:nth-last-child(1) {
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

const LocationDropDown = styled.div`
  position: absolute;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  z-index: 1;
  width: 25rem;
  height: fit-content;
  background-color: white;
  transform: translate(0, 5rem);
  border-radius: 25px;
  background-color: white;

  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  & p {
    font-weight: 600;
  }
`;

const DateDropDown = styled.div`
  position: absolute;

  position: absolute;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  z-index: 1;
  width: 50rem;
  height: 30rem;
  background-color: white;
  transform: translate(-17rem, 5rem);
  border-radius: 25px;
  background-color: white;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const GuestDropDown = styled.div`
  position: absolute;

  position: absolute;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  z-index: 1;
  width: 20rem;
  height: fit-content;
  background-color: white;
  transform: translate(-8rem, 5rem);
  border-radius: 15px;
  background-color: white;

  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin-right: 1rem;
  & > div:first-child {
    text-decoration: 0.5px underline rgba(0, 0, 0, 0.3);
  }
`;

const StyledAdultChildren = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dddddd;

  > div:nth-of-type(1) {
    font-weight: 600;
    font-size: 17px;
  }
`;

const StyledAddSub = styled.span`
  font-size: 10px;
  padding: 0px 12px;
  cursor: pointer;
`;

const InputForm = styled.div`
  position: relative;

  z-index: 99999;

  > label {
    margin-left: 2px;
    position: absolute;
    color: rgba(0, 0, 0, 0.5);
    transform: translate(10px, -10px);
    background-color: white;
    padding: 0 10px;
  }

  p {
    color: red;
  }
`;

export default function CustomerHeader({
  setGuest,
  selectedDates,
  setSelectedDates,
  chosenProvince,
  setChosenProvince,
  chosenDistrict,
  setChosenDistrict,
  chosenWard,
  setChosenWard,
  categoryId,
  setCategoryId,
  selectedAmenity,
  setSelectedAmenity,
  selectedPropertyType,
  setSelectedPropertyType,
  isInstant,
  isPetAllow,
  isSelfCheckin,
  setIsInstant,
  setIsPetAllow,
  setIsSelfCheckin,
  selectedPrice,
  setSelectedPrice,
  selectedRoom,
  setSelectedRoom,
  selectedBed,
  setSelectedBed,
  selectedBathRoom,
  setSelectedBathRoom,
  properties,
  name,
  setName,
}) {
  const [locationDropDown, setLocationDropDown] = useState(false);
  const locationButtonRef = useRef();
  const locationDropDownRef = useRef();
  const [dateDropDown, setDateDropDown] = useState(false);
  const dateCheckInButtonRef = useRef();
  const dateCheckOutButtonRef = useRef();
  const dateDropDownRef = useRef();
  const [guessDropDown, setGuestDropDown] = useState(false);
  const guessButtonRef = useRef();
  const guessDropDownRef = useRef();
  const [scrollEvent, setScrollEvent] = useState("SCROLL"); // BEGIN, SCROLL, SCROLL_CLICK
  const scrollRef = useRef("BEGIN");
  const [isClickDropDown, setIsCLickDropDown] = useState(false);
  const dropDownRef = useRef();
  const dropDownButtonRef = useRef();
  const containerRef = useRef();
  const [isRegisterPopUp, setIsRegisterPopUp] = useState("");
  const navigate = useNavigate();
  const user = UserRequest();
  const managedCity = ManagedCityRequest();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [adult, setAdult] = useState(1);
  const [children, setChildren] = useState(0);

  const calculateDaysBetween = (start_day, end_day) => {
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return Math.floor(daysDifference) + 1;
  };

  useEffect(() => {
    if (managedCity.isSuccess) {
      var provincesData = dchc.data.filter((province) =>
        managedCity.data.data
          .filter((city) => city.managed == true)
          .find((city) => city.cityName == province.name)
      );
      setProvinces((_) =>
        provincesData.map((item) => {
          return {
            label: item.name,
            value: item.level1_id,
          };
        })
      );
    }
  }, [managedCity.isSuccess]);

  useEffect(() => {
    if (chosenProvince != null) {
      const districtsData = dchc.data.find((city) => city.level1_id == chosenProvince.value);

      setDistricts(() =>
        districtsData.level2s.map((district) => {
          return { value: district.level2_id, label: district.name };
        })
      );
      setChosenDistrict(null);
      setChosenWard(null);
    }
  }, [chosenProvince]);

  useEffect(() => {
    if (chosenDistrict != null) {
      const districtsData = dchc.data.find((city) => city.level1_id == chosenProvince.value);
      const wardsData = districtsData.level2s.find(
        (district) => district.level2_id == chosenDistrict.value
      );

      setWards(() =>
        wardsData.level3s.map((ward) => {
          return { value: ward.level3_id, label: ward.name };
        })
      );

      setChosenWard(null);
    }
  }, [chosenDistrict]);

  useEffect(() => {
    const event = function () {
      if (locationDropDownRef.current) {
        setLocationDropDown(false);
      }

      if (dateDropDownRef.current) {
        setDateDropDown(false);
      }

      if (guessDropDownRef.current) {
        setGuestDropDown(false);
      }

      if (window.scrollY > 20) {
        if (containerRef.current) {
          containerRef.current.style.position = "fixed";
          containerRef.current.style.width = "100%";
        }
        if (scrollRef.current != "SCROLL") {
          setScrollEvent("SCROLL");
          scrollRef.current = "SCROLL";
        }
      } else {
        if (containerRef.current) {
          containerRef.current.style.position = "relative";
          containerRef.current.style.width = "100%";
        }

        if (scrollRef.current) {
          if (scrollRef.current != "BEGIN") {
            setScrollEvent("BEGIN");
            scrollRef.current = "BEGIN";
          }
        }
      }
    };

    window.addEventListener("scroll", event);
    return () => {
      document.removeEventListener("scroll", event);
    };
  }, []);

  useEffect(() => {
    const event = (ev) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(ev.target) &&
        !dropDownButtonRef.current.contains(ev.target)
      ) {
        setIsCLickDropDown(false);
      }

      if (
        locationDropDownRef.current &&
        !locationButtonRef.current.contains(ev.target) &&
        !locationDropDownRef.current.contains(ev.target)
      ) {
        setLocationDropDown(false);
      }

      if (
        guessDropDownRef.current &&
        !guessDropDownRef.current.contains(ev.target) &&
        !guessButtonRef.current.contains(ev.target)
      ) {
        setGuestDropDown(false);
      }

      if (
        dateDropDownRef.current &&
        !dateDropDownRef.current.contains(ev.target) &&
        !dateCheckInButtonRef.current.contains(ev.target) &&
        !dateCheckOutButtonRef.current.contains(ev.target)
      ) {
        setDateDropDown(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    setGuest(adult + children);
  }, [adult, children]);

  return (
    <>
      <Container ref={containerRef}>
        <div>
          <LogoContainer onClick={() => navigate("/")}>
            <img src={logo} />
          </LogoContainer>
          <Center $event={scrollEvent}>
            {(scrollEvent == "BEGIN" || scrollEvent == "SCROLL_CLICK") && (
              <PlaceToStay>
                <h5>Place to stay</h5>
              </PlaceToStay>
            )}
            <FilterBarStyled $event={scrollEvent}>
              {(scrollEvent == "BEGIN" || scrollEvent == "SCROLL_CLICK") && (
                <>
                  <div>
                    <button ref={locationButtonRef} onClick={() => setLocationDropDown(true)}>
                      <h5>Location</h5>
                      {!chosenProvince ? (
                        <p>Where are you going ?</p>
                      ) : (
                        <b>{chosenProvince.label}</b>
                      )}
                    </button>
                    {locationDropDown && (
                      <LocationDropDown ref={locationDropDownRef}>
                        <InputForm>
                          <label>Search </label>
                          <TextThrottleInput state={name} setState={setName} />
                        </InputForm>
                        <div>
                          <p>Province</p>
                          <SelectInput
                            state={chosenProvince}
                            setState={setChosenProvince}
                            options={provinces}
                            placeholder={"I'm flexible"}
                          />
                        </div>
                        <div>
                          <p>District</p>
                          <SelectInput
                            state={chosenDistrict}
                            setState={setChosenDistrict}
                            options={districts}
                            placeholder={"I'm flexible"}
                          />
                        </div>
                        <div>
                          <p>Ward</p>
                          <SelectInput
                            placeholder={"I'm flexible"}
                            options={wards}
                            state={chosenWard}
                            setState={setChosenWard}
                          />
                        </div>
                        <BlackButton
                          onClick={() => {
                            setChosenProvince(null);
                            setChosenDistrict(null);
                            setChosenWard(null);
                          }}
                        >
                          Clear
                        </BlackButton>
                      </LocationDropDown>
                    )}
                  </div>
                  <div>
                    <button ref={dateCheckInButtonRef} onClick={() => setDateDropDown(true)}>
                      <h5>Check in</h5>
                      {!selectedDates[0] ? (
                        <p>Add dates</p>
                      ) : (
                        <b>{formatDate(selectedDates[0], false)}</b>
                      )}
                    </button>
                    {dateDropDown && (
                      <DateDropDown ref={dateDropDownRef}>
                        <div>
                          {selectedDates[0] != null && selectedDates[1] != null && (
                            <div>
                              <h2>
                                {calculateDaysBetween(selectedDates[0], selectedDates[1])} nights
                              </h2>
                              <StyledReadCalendar>
                                <div>
                                  <div>{formatDate(selectedDates[0])} </div>
                                </div>
                                <p> - </p>
                                <div>
                                  <div> {formatDate(moment(selectedDates[1]).add(1, "days"))}</div>
                                </div>
                              </StyledReadCalendar>
                            </div>
                          )}
                          <CalendarHeader
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
                          </StyledContainerClearClose>
                        </div>
                      </DateDropDown>
                    )}
                  </div>
                  <div>
                    <button ref={dateCheckOutButtonRef} onClick={() => setDateDropDown(true)}>
                      <h5>Check out</h5>
                      {!selectedDates[1] ? (
                        <p>Add dates</p>
                      ) : (
                        <b>{formatDate(moment(selectedDates[1]).add(1, "days"), false)}</b>
                      )}
                    </button>
                  </div>
                  <div>
                    <button ref={guessButtonRef} onClick={() => setGuestDropDown(true)}>
                      <h5>Guests</h5>

                      {Number(adult + children) <= Number(1) ? (
                        <p>Add guests </p>
                      ) : (
                        <b>{Number(adult + children)} guests</b>
                      )}
                    </button>

                    {guessDropDown && (
                      <GuestDropDown ref={guessDropDownRef}>
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
                                if (adult < 20 && children + adult < 20) {
                                  setAdult(adult + 1);
                                }
                              }}
                              style={{
                                cursor:
                                  adult < 20 && children + adult < 20 ? "pointer" : "not-allowed",
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
                                if (20 - adult > 0 && children < 20 - 1 && children + adult < 20) {
                                  setChildren(children + 1);
                                }
                              }}
                              style={{
                                cursor:
                                  20 - adult > 0 && children < 20 - 1 && children + adult < 20
                                    ? "pointer"
                                    : "not-allowed",
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </StyledAddSub>
                          </div>
                        </StyledAdultChildren>
                      </GuestDropDown>
                    )}
                  </div>
                </>
              )}
              {scrollEvent == "SCROLL" && (
                <ScrollButton
                  onClick={() => {
                    setScrollEvent("SCROLL_CLICK");
                    scrollRef.current = "SCROLL_CLICK";
                  }}
                >
                  Start your search
                  <span>
                    <IoIosSearch />
                  </span>
                </ScrollButton>
              )}
            </FilterBarStyled>
          </Center>
          <Right>
            {user.isSuccess && user.data.status == 200 && user.data.data.host == true && (
              <h5 onClick={() => navigate("/hosting")}>Switch to hosting</h5>
            )}
            {user.isSuccess && user.data.status == 200 && user.data.data.host == false && (
              <h5 onClick={() => navigate("/become_a_host")}>Become a host</h5>
            )}
            <DropDownButton
              ref={dropDownButtonRef}
              onClick={() => setIsCLickDropDown((prev) => !prev)}
            >
              <FaBars />
              {user.isSuccess && user.data.status == 404 && (
                <Avatar src={default_avatar} round size="30" />
              )}
              {user.isSuccess && user.data.status == 200 && (
                <Avatar
                  src={user.data.data.avatar}
                  name={user.data.data.firstName}
                  round
                  size="30"
                />
              )}
            </DropDownButton>
            {isClickDropDown && (
              <>
                {user.isSuccess && user.data.status == 404 && (
                  <NotSignUpDropDownContainer>
                    <button
                      onClick={() => {
                        setIsCLickDropDown(false);
                        setIsRegisterPopUp(true);
                      }}
                    >
                      Sign up
                    </button>
                    <hr />
                    <button
                      onClick={() => {
                        setIsCLickDropDown(false);
                        setIsRegisterPopUp(true);
                      }}
                    >
                      Log in
                    </button>
                  </NotSignUpDropDownContainer>
                )}
                {user.isSuccess && user.data.status == 200 && (
                  <DropDownContainer ref={dropDownRef}>
                    <button className="focus" onClick={() => navigate("/messages")}>
                      Message
                    </button>
                    <button className="focus" onClick={() => navigate("/customer_notification")}>
                      Notification
                    </button>
                    <button className="focus" onClick={() => navigate("/trips")}>
                      Trips
                    </button>
                    <button className="focus" onClick={() => navigate("/wishlist")}>
                      Wishlists
                    </button>
                    <hr />
                    <button onClick={() => navigate("/hosting/listing")}>Manage Listings</button>
                    <button onClick={() => navigate("/account-settings")}>Account</button>
                    <button onClick={() => navigate("/become_a_host")}>Create Listing</button>
                    <hr />
                    <button onClick={() => navigate("/messages", { state: { userId: 0 } })}>
                      Get help
                    </button>
                    <button
                      onClick={() => {
                        Cookies.remove("CLIENT_ACCESS_TOKEN");
                        user.refetch();
                        setIsCLickDropDown(false);
                      }}
                    >
                      Log out
                    </button>
                  </DropDownContainer>
                )}
              </>
            )}
          </Right>
        </div>

        <div>
          <FilterBar
            properties={properties}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            selectedAmenity={selectedAmenity}
            setSelectedAmenity={setSelectedAmenity}
            selectedPropertyType={selectedPropertyType}
            setSelectedPropertyType={setSelectedPropertyType}
            isInstant={isInstant}
            isPetAllow={isPetAllow}
            isSelfCheckin={isSelfCheckin}
            setIsInstant={setIsInstant}
            setIsPetAllow={setIsPetAllow}
            setIsSelfCheckin={setIsSelfCheckin}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            selectedBed={selectedBed}
            setSelectedBed={setSelectedBed}
            selectedBathRoom={selectedBathRoom}
            setSelectedBathRoom={setSelectedBathRoom}
          />
        </div>
      </Container>
      {isRegisterPopUp && <RegisterPopUp action={() => setIsRegisterPopUp(false)} />}
    </>
  );
}
