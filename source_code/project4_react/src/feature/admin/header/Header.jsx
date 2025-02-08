import styled from "styled-components";
import Avatar from "react-avatar";
import { useState } from "react";
import { useRef } from "react";
import { CiLogout } from "react-icons/ci";
import { useEffect } from "react";
import { FaBars } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import sidebar_content from "../sidebar/data/sidebar_content";
import { useLocation, useNavigate } from "react-router-dom";
import TextInput from "@/shared/components/Input/TextInput";
import PopUp from "@/shared/components/PopUp/PopUp";
import Button1 from "@/shared/components/Button/Button1";
import { AdminRequest } from "@/shared/api/adminApi";
import Cookies from "js-cookie";
import { MdKeyboardArrowRight } from "react-icons/md";
import { QueryClient } from "@tanstack/react-query";
import { FaBell } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { ChangePassswordRequest } from "./api/headerApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";

const Container = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #ffffff;
  padding: 0 2rem;

  > div {
    display: flex;
    justify-content: space-between;
    height: 5rem;
    align-items: center;

    & p {
      margin: 0;
    }
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: max-content;
  font-size: 20px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);

  & p {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfileGroup = styled.div`
  position: relative;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  & p {
    font-size: 14px;
    text-align: end;
  }

  & h5 {
    font-size: 15px;
  }
`;

const HideShowButton = styled.div`
  cursor: pointer;

  & svg {
    font-size: 20px;
  }
`;

const DropDown = styled.div`
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  margin-top: 1rem;
  width: 7rem;
  transform: translateX(10px);
  width: max-content;
`;

const DropDownButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  background-color: white;

  border: none;
  font-size: 14px;
  padding: 0.5rem;
  cursor: pointer;
  color: #4066d5;

  &:hover {
    color: black;
    background-color: #f4f5f7;
  }
`;

const IconContainer = styled.button`
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-radius: 25px;

  padding: 9px 9px;
  & svg {
    font-size: 15px;
    color: black;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const queryClient = new QueryClient();

export default function Header({ isSideBarSmall, setIsSideBarSmall }) {
  const admin = AdminRequest();
  const [isPopUp, setIsPopUp] = useState(false);
  const location = useLocation();
  const [dropDown, setDropDown] = useState(false);
  const dropDownRef = useRef();
  const dropDownButton = useRef();
  const [currentPage, setCurrentPage] = useState();
  const headerRef = useRef();
  const containerRef = useRef();
  const navigate = useNavigate();

  const edited_sidebar = [];

  for (let item of sidebar_content) {
    if (item.children == null) {
      edited_sidebar.push(item);
    }

    if (item.children != null) {
      for (let children of item.children) {
        edited_sidebar.push(children);
      }
    }
  }

  useEffect(() => {
    const event = (ev) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(ev.target) &&
        !dropDownButton.current.contains(ev.target)
      ) {
        setDropDown((prev) => !prev);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    for (let item of sidebar_content) {
      if (item.link == location.pathname) {
        setCurrentPage(item.name);
      }

      if (item.children != null) {
        for (let child of item.children) {
          if (child.link == location.pathname) {
            setCurrentPage(
              <>
                <p>{item.name}</p> <MdKeyboardArrowRight /> <p>{child.name}</p>
              </>
            );
          }
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const event = function () {
      if (window.scrollY > 100) {
        if (headerRef.current && containerRef.current) {
          headerRef.current.style.boxShadow = "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px";
        }
      } else {
        if (headerRef.current && containerRef.current) {
          headerRef.current.style.boxShadow = "none";
        }
      }
    };
    window.addEventListener("scroll", event);

    return () => {
      window.removeEventListener("scroll", event);
    };
  }, []);

  const onLogout = () => {
    Cookies.remove("ADMIN_ACCESS_TOKEN");
    queryClient.removeQueries("admin");
    admin.refetch();
  };

  return (
    <>
      <Container ref={headerRef}>
        <div ref={containerRef}>
          <Left>
            <HideShowButton onClick={() => setIsSideBarSmall((prev) => !prev)}>
              {!isSideBarSmall ? <FaBars /> : <FaArrowRight />}
            </HideShowButton>
            <p>{currentPage}</p>
          </Left>
          <Right>
            <IconContainer onClick={() => setIsPopUp(true)}>
              <IoMdSettings />
            </IconContainer>
            <IconContainer onClick={() => navigate("/admin/messages")}>
              <FaMessage />
            </IconContainer>
            <IconContainer>
              <FaBell />
            </IconContainer>
            <ProfileGroup ref={dropDownButton}>
              <Profile onClick={() => setDropDown((prev) => !prev)}>
                <div>
                  <h5>
                    {admin.data.data.firstName} {admin.data.data.lastName}
                  </h5>
                  <p>
                    {admin.data.data.roles.find((role) => role.roleName == "ADMIN")
                      ? "Admin"
                      : "Employee"}
                  </p>
                </div>
                <Avatar src={admin.data.data.avatar} name={"admin"} size="45" round />
              </Profile>
              {dropDown && (
                <DropDown ref={dropDownRef}>
                  <DropDownButton onClick={onLogout}>
                    <CiLogout />
                    Log out
                  </DropDownButton>
                </DropDown>
              )}
            </ProfileGroup>
          </Right>
        </div>
      </Container>
      {isPopUp && <ResetPopUp action={() => setIsPopUp(false)} />}
    </>
  );
}

const CustomPopup = styled(PopUp)`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

function ResetPopUp({ action }) {
  const changePasssword = ChangePassswordRequest();
  const [previous, setPrevious] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [isSuccess, setIsSuccess] = useState(false);

  const onResetPassword = () => {
    if (newPassword.length < 6) {
      alert("Password cannot smaller than 6");
      return;
    }

    if (newPassword != confirm) {
      alert("Wrong confirm password");
      return;
    }

    const formData = new FormData();
    formData.append("password", newPassword);
    formData.append("previous", previous);

    changePasssword.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setIsSuccess(true);
        } else {
          alert(response.message);
        }
      },
    });
  };

  return (
    <>
      <CustomPopup action={() => {}}>
        <div>
          <label>Previous password</label>
          <TextInput type="password" state={previous} setState={setPrevious} />
        </div>
        <div>
          <label>New password</label>
          <TextInput type="password" state={newPassword} setState={setNewPassword} />
        </div>
        <div>
          <label>Password confirm</label>
          <TextInput type="password" state={confirm} setState={setConfirm} />
        </div>
        <ButtonContainer>
          <Button1 onClick={onResetPassword}>Reset Password</Button1>
          <Button1 onClick={action}>Cancel</Button1>
        </ButtonContainer>
      </CustomPopup>

      {isSuccess && (
        <SuccessPopUp
          message={"New password has been updated"}
          action={() => {
            setIsSuccess(false);
            action();
          }}
        />
      )}
    </>
  );
}
