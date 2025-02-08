import React, { useEffect, useRef, useState } from "react";
import CustomerHeader from "../../custome_header/CustomerHeader";
import Footer from "../../footer/Footer";
import styled from "styled-components";
import TitleHeader from "./common/TitleHeader";
import PersonalSettingOption from "./common/PersonalSettingOption";
import LegalNameOption from "./LegalNameOption";
import { UserRequest } from "@/shared/api/userApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";

import PreferredNameOption from "./PreferredNameOption";
import PhoneNumberOption from "./PhoneNumberOption";
import axios from "axios";
import AddressOption from "./AddressOption";
import { FaCamera } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/shared/api/axiosClient";
import ChatHeader from "../../custome_header/ChatHeader";
import defaultAvatar from "@/shared/assets/images/default_avatar.jpg";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

const Container = styled.div`
  width: 1080px;
  min-height: 500px;
  margin: 2rem auto;
`;
const FlexBoxContainer = styled.div`
  display: flex;
`;
const FlexBoxLeft = styled.div`
  margin-top: 3%;
  flex: 2;
`;
const FlexBoxRight = styled.div`
  flex: 1;
`;
const PersonalSettingContainer = styled.div``;

export default function PersonalInfo() {
  const [imageCrop, setImageCrop] = useState();
  const [personalCrop, setPersonalCrop] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const user = UserRequest();
  const navigate = useNavigate();
  const [personalSettingOptionList, SetPersonalSettingOptionList] = useState([]);
  const [avatarList, setAvatarList] = useState([
    {
      id: 1,
      name: "Avatar",
    },
    {
      id: 2,
      name: "Personal Avatar",
    },
  ]);

  const avatarImageRef = useRef(null);
  const [avatarErrorMessage, setAvatarErroMessage] = useState("");

  const personalAvatarImageRef = useRef(null);
  const [personalAvatarErrorMessage, setPersonalAvatarErrorMessage] = useState("");

  const [avatarOptionId, setAvatarOptionId] = useState(1);
  const API_URL = "http://localhost:8080/userCM/updateAvatar";

  const useAvatarMutation = useMutation({
    mutationFn: (AvatarRequest) => {
      return axiosClient.put(API_URL, AvatarRequest);
    },
    onSuccess: (data) => {
      user.refetch();
      setAvatarErroMessage("");
      setPersonalAvatarErrorMessage("");
      setIsSuccess(true);
    },
  });

  const handleAvatarChange = (event) => {
    const value = event.target.value;
    setAvatarOptionId(value);
  };

  const cropUploadAvatar = (event) => {
    const result = validFileImage(event.target.files[0]);
    if (!result.isValid) {
      setAvatarErroMessage(result.errorMessage);
      return;
    }

    setImageCrop(event.target.files[0]);
  };

  const handleUploadAvatarChange = (event) => {
    const formData = new FormData();
    formData.append("avatarOption", avatarOptionId);
    formData.append("avatarFileImage", event);

    useAvatarMutation.mutate(formData);
  };

  const handleEditButtonClick = () => {
    avatarImageRef.current.click();
  };

  const cropPersonalUploadAvatar = (event) => {
    const result = validFileImage(event.target.files[0]);
    if (!result.isValid) {
      setAvatarErroMessage(result.errorMessage);
      return;
    }

    setPersonalCrop(event.target.files[0]);
  };

  const handlePersonalUploadAvatarChange = (event) => {
    const formData = new FormData();
    formData.append("avatarOption", avatarOptionId);
    formData.append("avatarFileImage", event);

    useAvatarMutation.mutate(formData);
  };

  const handleEditButtonClick2 = () => {
    personalAvatarImageRef.current.click();
  };

  useEffect(() => {
    console.log(user.data);
  }, [user.isSuccess]);

  if (user.isLoading) {
    return <WaitingPopUp />;
  }

  if (user.isError) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    navigate("/");
  }

  if (user.isSuccess && user.data.status == 404) {
    navigate("/");
    return;
  }

  if (user.isSuccess && user.data.status == 200 && user.data.data.status == false) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    user.refetch();
  }

  const updatePersonalSettingOptionList = (id, title, description, actionName) => {
    SetPersonalSettingOptionList((preOptions) => {
      return preOptions.map((option) => {
        if (option.id === id) {
          return { ...option, title, description, actionName, isDisabled: false };
        }
        return { ...option, isDisabled: true };
      });
    });
  };

  const validFileImage = (file) => {
    if (file == null) {
      return {
        isValid: false,
        fileType: null,
        fileSize: 0,
        errorMessage: "Image is cannot empty",
      };
    }

    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const maxFileSize = 1 * 1024 * 1024;
    const isValidFileType = allowedFileTypes.includes(file?.type);
    const isValidFileSize = file?.size <= maxFileSize;

    return {
      isValid: isValidFileType && isValidFileSize,
      fileType: file.type,
      fileSize: file.size,
      errorMessage: !isValidFileType
        ? "Invalid file type. Allowed types are: JPEG, PNG, GIF."
        : !isValidFileSize
        ? "File size exceeds the maximum limit of 1MB."
        : null,
    };
  };

  return (
    <>
      <ChatHeader padding={"13rem"} />
      <Container>
        <TitleHeader name="Personal Info" />
        <FlexBoxContainer>
          <FlexBoxLeft>
            <LegalNameOption
              firstName={user?.data?.data?.firstName}
              lastName={user?.data?.data?.lastName}
            />
            <PreferredNameOption preferredName={user?.data?.data?.preferredName} />
            <PhoneNumberOption phoneNumber={user?.data?.data?.phoneNumber} />
            <AddressOption addressProp={user?.data?.data?.address} />
          </FlexBoxLeft>
          <FlexBoxRight>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <select style={{ borderRadius: "12px" }} onChange={handleAvatarChange}>
                {avatarList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            {avatarOptionId == 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5%",
                }}
              >
                <img
                  style={{
                    border: "solid thin black",
                    borderRadius: "50%",
                    width: "170px",
                    height: "170px",
                    objectFit: "cover",
                  }}
                  src={user?.data?.data?.avatar ? user?.data?.data?.avatar : defaultAvatar}
                  alt=""
                />
                <div style={{ color: "red" }}>{avatarErrorMessage}</div>
                <div
                  onClick={handleEditButtonClick}
                  style={{
                    cursor: "pointer",
                    marginTop: "5%",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10%",
                    border: "solid thin black",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "70px",
                    borderRadius: "8px",
                  }}
                >
                  <FaCamera />
                  <div style={{ fontWeight: "bolder" }}>Edit</div>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={avatarImageRef}
                    onChange={cropUploadAvatar}
                  />
                </div>
              </div>
            )}

            {avatarOptionId == 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5%",
                }}
              >
                <img
                  style={{
                    border: "solid thin black",
                    borderRadius: "50%",
                    width: "170px",
                    height: "170px",
                    objectFit: "cover",
                  }}
                  src={user?.data?.data?.realAvatar ? user?.data?.data?.realAvatar : defaultAvatar}
                  alt=""
                />
                <div style={{ color: "red" }}>{personalAvatarErrorMessage}</div>
                <div
                  onClick={handleEditButtonClick2}
                  style={{
                    cursor: "pointer",
                    marginTop: "5%",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10%",
                    border: "solid thin black",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "70px",
                    borderRadius: "8px",
                  }}
                >
                  <FaCamera />
                  <div style={{ fontWeight: "bolder" }}>Edit</div>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={personalAvatarImageRef}
                    onChange={cropPersonalUploadAvatar}
                  />
                </div>
              </div>
            )}
          </FlexBoxRight>
        </FlexBoxContainer>
      </Container>
      <Footer percent={"72%"} />
      {imageCrop && (
        <CropImagePopUp
          action={() => setImageCrop()}
          onSuccess={(image) => {
            handleUploadAvatarChange(image);
          }}
          image={imageCrop}
          aspect={1 / 1}
        />
      )}
      {personalCrop && (
        <CropImagePopUp
          action={() => setPersonalCrop()}
          onSuccess={(image) => {
            handlePersonalUploadAvatarChange(image);
          }}
          image={personalCrop}
          aspect={1 / 1}
        />
      )}
      {isSuccess && <SuccessPopUp action={() => setIsSuccess(false)} message={"Success update "} />}
    </>
  );
}
