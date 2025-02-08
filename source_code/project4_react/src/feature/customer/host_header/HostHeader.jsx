import styled, { css } from "styled-components";
import logo from "@/shared/assets/images/logo.svg";
import Avatar from "react-avatar";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import { UserRequest } from "@/shared/api/userApi";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";
import { useEffect } from "react";
import { GetUserNotificationPopUpRequest } from "./api/hostHeaderApi";
import Cookies from "js-cookie";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import getWords from "@/shared/utils/getWords";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  background-color: white;
`;

const Left = styled.div`
  width: 55px;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  gap: 15px;
  position: relative;
`;

const FocusButton = styled.button`
  background-color: white;
  cursor: pointer;
  padding: 5px 20px;
  border-radius: 25px;

  display: flex;
  align-items: center;
  gap: 5px;
  border: 2.5px solid white;

  &:hover {
    background-color: #f7f7f7;
  }

  &:focus {
    border: 2px solid black;
    font-weight: 600;
  }
`;

const CustomLink = styled(Link)`
  padding: 5px 15px;
  border-radius: 25px;
  color: black;
  text-decoration: none;
  font-weight: 600;
  background-color: white;
  color: rgba(0, 0, 0, 0.5);

  &:hover {
    background-color: #f7f7f7;
  }

  ${(props) => {
    if (props.$active == true) {
      return css`
        color: black;
        text-decoration: underline;
      `;
    }
  }}
`;

const CircleButton = styled.button`
  background-color: white;
  padding: 11px;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;

  border: 1px solid rgba(0, 0, 0, 0.5);

  &:active {
    transform: scale(0.9);
  }
`;

const DropDownContainer = styled.div`
  z-index: 1;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  transform: translate(-90px, 50px);
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

const MenuDropDownStyled = styled.div`
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  width: 10rem;
  border-radius: 15px;
  transform: translate(-3rem, 0.6rem);
  background-color: white;

  > button {
    background-color: white;
    width: 100%;
    border: none;
    cursor: pointer;
    padding: 10px;
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

const MenuDropDownContainer = styled.div`
  position: relative;
`;

const NotificationContainerStyled = styled.div`
  position: relative;
`;

const NotificationDropDownStyled = styled.div`
  position: absolute;

  padding: 1rem;
  width: 25rem;
  transform: translate(-22rem, 1rem);
  border-radius: 15px;

  height: 40rem;
  background-color: white;
  z-index: 999;

  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;

  display: flex;
  flex-direction: column;

  > div:nth-of-type(2) {
    flex: 1;
    margin: 2rem 0;
    max-height: 30rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &::-webkit-scrollbar-track {
      background-color: none;
    }

    &::-webkit-scrollbar {
      width: 4px;
      background-color: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(205, 205, 207);
    }
  }

  > div:nth-of-type(3) {
    display: flex;
    justify-content: flex-end;

    > button {
      background-color: white;
      padding: 10px;
      border-radius: 15px;
      cursor: pointer;
    }

    > button:active {
      transform: scale(0.9);
    }
  }
`;

const NotificationStyled = styled.div`
  display: grid;
  padding: 0 1rem;

  > div {
    display: flex;
    flex-direction: column;

    > p:nth-of-type(2) {
      color: rgba(0, 0, 0, 0.5);
      font-size: 14px;
    }
  }

  /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */
`;

export default function HostHeader() {
  const getUserNotificationPopUp = GetUserNotificationPopUpRequest();
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const [isMenuDropDown, setIsMenuDropDown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isClickDropDown, setIsCLickDropDown] = useState(false);
  const dropDownRef = useRef();
  const dropDownButtonRef = useRef();
  const user = UserRequest();

  const menuDropDownButtonRef = useRef();
  const menuDropDownContainerRef = useRef();

  const popUpButtonRef = useRef();
  const popUpDropDownContainerRef = useRef();

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
        menuDropDownContainerRef.current &&
        !menuDropDownContainerRef.current.contains(ev.target) &&
        !menuDropDownButtonRef.current.contains(ev.target)
      ) {
        setIsMenuDropDown(false);
      }

      if (
        popUpDropDownContainerRef.current &&
        !popUpDropDownContainerRef.current.contains(ev.target) &&
        !popUpButtonRef.current.contains(ev.target)
      ) {
        setNotificationDropDown(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  return (
    <Container>
      <Left onClick={() => navigate("/hosting")}>
        <img src={logo} />
      </Left>
      <Center>
        <CustomLink $active={location.pathname == "/hosting"} to={"/hosting"}>
          Today
        </CustomLink>
        <CustomLink $active={location.pathname == "/hosting/calendar"} to={"/hosting/calendar"}>
          Calendar
        </CustomLink>
        <CustomLink $active={location.pathname == "/hosting/listing"} to={"/hosting/listing"}>
          Listings
        </CustomLink>
        <CustomLink
          $active={location.pathname == "/hosting/host_messages"}
          to={"/hosting/host_messages"}
        >
          Messages
        </CustomLink>
        <MenuDropDownContainer>
          <FocusButton
            ref={menuDropDownButtonRef}
            onClick={() => setIsMenuDropDown((prev) => !prev)}
          >
            Menu <IoIosArrowDown />
          </FocusButton>

          {isMenuDropDown && (
            <MenuDropDownStyled ref={menuDropDownContainerRef}>
              <button
                onClick={() => {
                  navigate("/hosting/host_reservation");
                  setIsMenuDropDown(false);
                }}
              >
                Reservation
              </button>
              <button
                onClick={() => {
                  navigate("/become_a_host");
                  setIsMenuDropDown(false);
                }}
              >
                Create new listing
              </button>
              <button
                onClick={() => {
                  navigate("/");
                  setIsMenuDropDown(false);
                }}
              >
                Go back to home page
              </button>
            </MenuDropDownStyled>
          )}
        </MenuDropDownContainer>
      </Center>
      <Right>
        <NotificationContainerStyled>
          <CircleButton
            ref={popUpButtonRef}
            onClick={() => setNotificationDropDown((prev) => !prev)}
          >
            <FaRegBell />
          </CircleButton>
          {notificationDropDown && (
            <NotificationDropDownStyled ref={popUpDropDownContainerRef}>
              <div>
                <h3>Notifications</h3>
              </div>
              <div>
                {getUserNotificationPopUp.isSuccess &&
                  getUserNotificationPopUp.data.data.map((notification, index) => {
                    return (
                      <NotificationStyled key={index}>
                        <div>
                          <p>{getWords(notification.message, 15)}</p>
                          <p>{formatDate(notification.createdAt)}</p>
                        </div>
                        {notification.url && <Link to={notification.url}>Detail</Link>}
                      </NotificationStyled>
                    );
                  })}
              </div>
              <div>
                <button onClick={() => navigate("/customer_notification")}>
                  Notification detail
                </button>
              </div>
            </NotificationDropDownStyled>
          )}
        </NotificationContainerStyled>
        <DropDownButton ref={dropDownButtonRef} onClick={() => setIsCLickDropDown((prev) => !prev)}>
          <FaBars />
          {user.isSuccess && user.data.status == 200 && (
            <Avatar src={user.data.data.avatar} name={user.data.data.firstName} round size="30" />
          )}
        </DropDownButton>
        {isClickDropDown && (
          <DropDownContainer ref={dropDownRef}>
            {user.isSuccess && user.data.status == 200 && (
              <>
                <button onClick={() => navigate("/hosting/host_messages")} className="focus">
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
                <button onClick={() => navigate("/become_a_host-settings")}>Create Listing</button>
                <hr />
                <button
                  onClick={() => {
                    Cookies.remove("CLIENT_ACCESS_TOKEN");
                    user.refetch();
                    setIsCLickDropDown(false);
                  }}
                >
                  Log out
                </button>
              </>
            )}
          </DropDownContainer>
        )}
      </Right>
    </Container>
  );
}
