import styled, { css } from "styled-components";
import { useState } from "react";
import logo from "@/feature/customer/custome_header/assets/URBAN NEST (2).svg";
import Avatar from "react-avatar";
import default_avatar from "@/shared/assets/images/default_avatar.jpg";
import { FaBars } from "react-icons/fa6";
import { useEffect } from "react";
import { useRef } from "react";
import RegisterPopUp from "./components/RegisterPopUp";
import { UserRequest } from "@/shared/api/userApi";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  > div {
    padding: 1.3rem 0;
    display: flex;
    justify-content: space-between;
    background-color: white;
    max-width: 99%;
    margin: auto;
  }

  ${(props) => {
    if (props.$padding) {
      return css`
        > div {
          padding: 1.3rem ${props.$padding};
        }
      `;
    }
  }}
`;

const LogoContainer = styled.div`
  width: 170px;
  cursor: pointer;
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

export default function ChatHeader({ padding }) {
  const [isClickDropDown, setIsCLickDropDown] = useState(false);
  const dropDownRef = useRef();
  const dropDownButtonRef = useRef();
  const containerRef = useRef();
  const [isRegisterPopUp, setIsRegisterPopUp] = useState("");
  const navigate = useNavigate();
  const user = UserRequest();

  useEffect(() => {
    const event = (ev) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(ev.target) &&
        !dropDownButtonRef.current.contains(ev.target)
      ) {
        setIsCLickDropDown(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  return (
    <>
      <Container $padding={padding} ref={containerRef}>
        <div>
          <LogoContainer onClick={() => navigate("/")}>
            <img src={logo} />
          </LogoContainer>
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
                    <button onClick={() => navigate("/wishlist")} className="focus">
                      Wishlists
                    </button>
                    <hr />
                    <button onClick={() => navigate("/hosting/listing")}>Manage Listings</button>
                    <button onClick={() => navigate("/account-settings")}>Account</button>
                    <button onClick={() => navigate("/become_a_host")}>Create Listing</button>
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
                  </DropDownContainer>
                )}
              </>
            )}
          </Right>
        </div>
      </Container>
      {isRegisterPopUp && <RegisterPopUp action={() => setIsRegisterPopUp(false)} />}
    </>
  );
}
