import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CustomerHeader from "../../custome_header/CustomerHeader";
import Footer from "../../footer/Footer";
import { FaTaxi } from "react-icons/fa";
import { FaRegAddressCard } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import counties from "../phones.json";
import { CiCreditCard2 } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/shared/api/axiosClient";
import { UserRequest } from "@/shared/api/userApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import ChatHeader from "../../custome_header/ChatHeader";
import Cookies from "js-cookie";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";

//Page for Stage 1
const Container = styled.div`
  width: 1080px;
  height: 500px;
  margin: 2rem auto;
  /* border: solid thin black; */
  display: flex;
  flex-direction: column;
  gap: 5%;
`;

const FlexBox1 = styled.div`
  width: 50%;
  .title {
    font-weight: bold;
  }
  .description {
  }
`;

const FlexBox2 = styled.div`
  width: 50%;
`;

const Option = styled.div`
  border-bottom: solid thin rgb(221, 221, 221);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 2%;
  padding-bottom: 3%;
  font-size: large;
  .title {
    font-weight: bold;
  }
  .description {
  }
  .disabled {
    opacity: 0.5;
  }

  .buttone-radio {
    width: 20px;
  }
`;
const FormButton = styled.button`
  height: 48px;
  width: 80px;
  border-radius: 10px;
  font-weight: bold;
  background-color: black;
  color: white;
  cursor: pointer;
`;

// Page for Stage 2
const Container2 = styled.div`
  width: 1080px;
  height: 500px;
  margin: auto;
  /* border: solid thin black; */
  display: flex;
  flex-direction: column;
  /* gap: 5%; */
`;

const FlexBox = styled.div`
  width: 50%;

  .title {
    font-weight: bolder;
  }

  .select-container {
    position: relative;
    margin-top: 10px;
  }

  .country-title {
    position: absolute;
    z-index: 2;
    top: -12px;
    left: 10px;
    background-color: white;
    color: rgb(176, 176, 176);
  }

  select {
    width: 50%;
    height: 40px;
    border-radius: 8px;
    position: relative;
    z-index: 1;
  }
`;
const CardOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 15px;
  padding-bottom: 15px;
  border-bottom: solid thin rgb(221, 221, 221);
  .left {
    display: flex;
    align-items: center;
  }
  .right {
    display: flex;
    align-items: center;
  }
  .card-option-radio {
    width: 20px;
    height: 20px;
  }
`;

const RedirectContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

// Page for Stage 3
const Container3 = styled.div`
  width: 1080px;
  height: 500px;
  margin: auto;
  margin-top: 2rem;
  //border: solid thin black;
  display: flex;
  flex-direction: column;
  gap: 5%;
`;

const FlexBoxStage3 = styled.div`
  width: 50%;
  .title {
    font-weight: bolder;
    font-size: larger;
    margin-bottom: 2%;
  }
  .description {
  }

  .card-upload-container {
    display: flex;
    flex-direction: row;
  }

  .card-form-control {
    flex: 1;
    width: 100px;
    height: 150px;

    border: dotted thin black;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card-form-control:hover {
    cursor: pointer;
  }
`;

const ErrorMessage = styled.div`
  color: red;
`;

const isMobile = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return isMobile;
};

export default function GovernmentID() {
  const [frontImageCrop, setFrontImageCrop] = useState();
  const [backImageCrop, setBackImageCrop] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [stage, setStage] = useState(1);
  const API_URL = "http://localhost:8080/userCM/government";
  const user = UserRequest();
  const navigate = useNavigate();

  // Stage 1
  const [options, setOption] = useState(() => {
    const optionsNew = [
      {
        id: 1,
        title: "Upload an existing photo",
        description: "",
        isDisabled: false,
      },
    ];

    if (isMobile()) {
      const optionsForMobile = [
        {
          id: 1,
          title: "Upload an existing photo",
          description: "Recommended",
          isDisabled: false,
        },
        {
          id: 2,
          title: "Take photo with your webcam",
          description: "",
          isDisabled: false,
        },
        {
          id: 3,
          title: "Take photo with the Airbnb mobile app",
          description: "",
          isDisabled: false,
        },
      ];
      return optionsForMobile;
    }
    return optionsNew;
  });

  const [optionId, setOptionId] = useState(1);

  const handleOptionIdChange = (event) => {
    const value = event.target.value;
    setOptionId(Number(value));
  };

  // Stage 2
  const [cardOptions, setCardOptions] = useState([
    {
      id: 1,
      name: "Driver's license",
    },
    {
      id: 2,
      name: "Identity card",
    },
  ]);

  const [cardOptionId, setCardOptionId] = useState(1);
  const [country, setCountry] = useState(counties[0]?.name || "Afghanistan");

  const handleCardOptionChange = (event) => {
    const value = event.target.value;
    setCardOptionId(Number(value));
  };

  const handleCountryChange = (event) => {
    const value = event.target.value;
    setCountry(value);
  };

  // Stage 3
  const frontUploadFileRef = useRef(null);
  const [frontUploadFile, setFrontUploadFile] = useState(null);

  const backUploadFileRef = useRef(null);
  const [backUploadFile, setBackUploadFile] = useState(null);

  const [frontErrorMessageStage3, setFrontErrorMessageStage3] = useState("");
  const [backErrorMessageStage3, setBackErrorMessageStage3] = useState("");

  const handleFrontUploadFileChange = (event) => {
    const isFrontImageValid = validFileImage(event.target.files[0]);

    if (!isFrontImageValid.isValid) {
      setFrontErrorMessageStage3(`Front image ${isFrontImageValid.errorMessage}`);
      return;
    }

    setFrontImageCrop(event.target.files[0]);
  };

  const handleBackUploadFileChange = (event) => {
    const isBackImageValid = validFileImage(event.target.files[0]);

    if (!isBackImageValid.isValid) {
      setFrontErrorMessageStage3(`Back image ${isBackImageValid.errorMessage}`);
      return;
    }

    setBackImageCrop(event.target.files[0]);
  };

  const handleFrontButtonClick = () => {
    frontUploadFileRef.current.click();
  };

  const handleBackButtonClick = () => {
    backUploadFileRef.current.click();
  };

  const handleNextStageChange = () => {
    if (stage < 3) {
      setStage((pre) => pre + 1);
    }
  };
  const handlePreviousStageChange = () => {
    if (stage >= 1) {
      setStage((pre) => pre - 1);

      if (stage == 3) {
        setFrontUploadFile(null);
        setBackUploadFile(null);
        setFrontErrorMessageStage3("");
        setBackErrorMessageStage3("");
      }
      if (stage == 2) {
        setCardOptionId(1);
        setCountry(counties[0]?.name || "Afghanistan");
      }
    }
  };

  const useGovernmentMutation = useMutation({
    mutationFn: (GovernmentRequest) => {
      return axiosClient.put(API_URL, GovernmentRequest);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status == 200) {
        setFrontErrorMessageStage3("");
        setBackErrorMessageStage3("");
        setIsSuccess(true);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleUpdateImage = () => {
    const isFrontImageValid = validFileImage(frontUploadFile);
    const isBackImageValid = validFileImage(backUploadFile);
    if (!isFrontImageValid.isValid) {
      setFrontErrorMessageStage3(`Front image ${isFrontImageValid.errorMessage}`);
      return;
    }
    if (!isBackImageValid.isValid) {
      setFrontErrorMessageStage3(`Back image ${isBackImageValid.errorMessage}`);
      return;
    }

    if (isFrontImageValid.isValid && isBackImageValid.isValid) {
      const formData = new FormData();
      formData.append("IdType", cardOptionId);
      formData.append("frontImage", frontUploadFile);
      formData.append("backImage", backUploadFile);
      formData.append("governmentCountry", country);
      useGovernmentMutation.mutate(formData);
    }
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

  if (useGovernmentMutation.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <ChatHeader padding={"13rem"} />
      {stage == 1 && (
        <Container>
          <FlexBox1>
            <div className="title">Let’s add your government ID</div>
            <div className="description">
              We’ll need you to add an official government ID. This step helps make sure you’re
              really you.
            </div>
          </FlexBox1>
          <FlexBox2>
            {options.map((item) => (
              <Option key={item.id}>
                <div className={item.isDisabled ? "disabled" : ""}>
                  <div className="title">{item.title}</div>
                  <div>{item.description}</div>
                </div>
                <input
                  className="buttone-radio"
                  type="radio"
                  name="options-radio"
                  disabled={item.isDisabled}
                  checked={optionId == item.id}
                  onChange={handleOptionIdChange}
                  value={item.id}
                />
              </Option>
            ))}
          </FlexBox2>
          <FormButton onClick={handleNextStageChange}>Continue</FormButton>
        </Container>
      )}

      {stage == 2 && (
        <Container2>
          <FlexBox>
            {cardOptions?.map((item) => (
              <CardOption key={item.id}>
                <div className="left">
                  {item.id == 1 && <FaTaxi fontSize={40} style={{ paddingRight: "10px" }} />}
                  {item.id == 2 && (
                    <FaRegAddressCard fontSize={40} style={{ paddingRight: "10px" }} />
                  )}
                  {item.name}
                </div>
                <div className="right">
                  <input
                    className="card-option-radio"
                    type="radio"
                    name="card-option-radio"
                    checked={item.id == cardOptionId}
                    value={item.id}
                    onChange={handleCardOptionChange}
                  />
                </div>
              </CardOption>
            ))}
            <RedirectContainer>
              <div
                style={{
                  color: "black",
                  fontSize: "larger",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handlePreviousStageChange}
              >
                Back
              </div>
              <FormButton onClick={handleNextStageChange}>Continue</FormButton>
            </RedirectContainer>
          </FlexBox>
        </Container2>
      )}
      {stage == 3 && (
        <Container3>
          <FlexBoxStage3>
            <div className="title">Upload images of your driver’s license</div>
            <div className="description">
              Make sure your photos aren’t blurry and the front of your driver’s license clearly
              shows your face.
            </div>
          </FlexBoxStage3>
          <FlexBoxStage3>
            <div className="card-upload-container">
              {frontUploadFile != null ? (
                <img
                  className="card-form-control"
                  src={URL.createObjectURL(frontUploadFile)}
                  onClick={handleFrontButtonClick}
                />
              ) : (
                <div className="card-form-control" onClick={handleFrontButtonClick}>
                  <FaRegAddressCard fontSize={30} />
                  <div style={{ fontWeight: "bolder" }}>Upload front</div>
                  <div style={{ fontSize: "70%" }}>JPEG or PNG only</div>
                </div>
              )}
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFrontUploadFileChange}
                ref={frontUploadFileRef}
              />
              {backUploadFile != null ? (
                <img
                  className="card-form-control"
                  src={URL.createObjectURL(backUploadFile)}
                  onClick={handleBackButtonClick}
                />
              ) : (
                <div className="card-form-control" onClick={handleBackButtonClick}>
                  <CiCreditCard2 fontSize={30} />
                  <div style={{ fontWeight: "bolder" }}>Upload back</div>
                  <div style={{ fontSize: "70%" }}>JPEG or PNG only</div>
                </div>
              )}
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleBackUploadFileChange}
                ref={backUploadFileRef}
              />
            </div>
          </FlexBoxStage3>
          <FlexBoxStage3>
            <ErrorMessage>
              <div>{frontErrorMessageStage3}</div>
              <div>{backErrorMessageStage3}</div>
            </ErrorMessage>
            <RedirectContainer>
              <div
                style={{
                  color: "black",
                  fontSize: "larger",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handlePreviousStageChange}
              >
                Back
              </div>
              <FormButton onClick={handleUpdateImage}>Continue</FormButton>
            </RedirectContainer>
          </FlexBoxStage3>
        </Container3>
      )}
      <Footer percent={"72%"} />
      {frontImageCrop && (
        <CropImagePopUp
          action={() => setFrontImageCrop()}
          onSuccess={(image) => {
            setFrontUploadFile(image);
          }}
          image={frontImageCrop}
          aspect={1.586}
        />
      )}
      {backImageCrop && (
        <CropImagePopUp
          action={() => setBackImageCrop()}
          onSuccess={(image) => {
            setBackUploadFile(image);
          }}
          image={backImageCrop}
          aspect={1.586}
        />
      )}
      {isSuccess && (
        <SuccessPopUp
          action={() => {
            setIsSuccess(false);
            setStage(2);
          }}
          message={"Success update "}
        />
      )}
    </>
  );
}
