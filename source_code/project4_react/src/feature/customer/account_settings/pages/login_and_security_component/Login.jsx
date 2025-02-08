import axiosClient from "@/shared/api/axiosClient";
import { UserRequest } from "@/shared/api/userApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  .title {
    font-weight: bold;
    color: rgb(0, 132, 137);
    padding: 3% 0px 1% 0px;
    display: inline-block;
    border-bottom: solid 2px rgb(0, 132, 137);
  }
  .title-option {
    font-size: larger;
    font-weight: 900;
    padding-top: 2%;
    padding-bottom: 3%;
    border-bottom: solid 1px rgb(235, 235, 235);
  }

  .password-input {
    width: 100%;
    height: 40px;
    margin: 5px 0px 5px 0px;
  }

  .update-password-button {
    background-color: rgb(0, 132, 137);
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bolder;
  }
`;

const ConfirmPasswordContainer = styled.div``;

const OtpContainer = styled.div`
  display: flex;
  flex-direction: column;

  .buttons-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 50%;
    margin-top: 4%;
  }

  .input {
    width: 40px;
    border: none;
    border-bottom: 3px solid rgba(0, 0, 0, 0.5);
    margin: 0 10px;
    text-align: center;
    font-size: 36px;
    cursor: not-allowed;
    pointer-events: none;
  }

  .input:focus {
    border-bottom: 3px solid orange;
    outline: none;
  }

  .input:nth-child(1) {
    cursor: pointer;
    pointer-events: all;
  }
`;
export default function Login() {
  const inputsRef = useRef([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const API_URL = "http://localhost:8080/userCM/changePassword";
  const API_URL_CHECK_OTP = "http://localhost:8080/userCM/checkOTP";
  const [stage, setStage] = useState(1);
  const user = UserRequest();
  const [otpErrorMessage, setOtpErrorMessage] = useState("");
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  const updateChangePasswordMutation = useMutation({
    mutationFn: (changePasswordRequest) => {
      return axiosClient.put(API_URL, changePasswordRequest);
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.data?.status == 200) {
        setErrorMessage("");
        setStage(2);
      }
      if (data?.data?.status == 404) {
        setErrorMessage(data?.data?.message);
      }
    },
  });

  const handleKeyUp = (index, e) => {
    const key = e.key.toLowerCase();
    if (key === "backspace" || key === "delete") {
      const prevInput = inputsRef.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleInput = (index, e) => {
    const val = e.target.value;
    const numberValue = Number(val);
    if (isNaN(val)) {
      e.target.value = "";
      return;
    }
    if (numberValue != 0) {
      const nextInput = inputsRef.current[index + 1];
      if (val.length > 1) {
        const valArray = val.split("");
        // console.log(valArray)
        e.target.value = valArray[0];
        if (nextInput) {
          nextInput.focus();
          nextInput.value = valArray[1];
        }
      }
      return;
    }
  };

  const putUpdatePassword = () => {
    if (currentPassword == "" || newPassword == "" || confirmPassword == "") {
      setErrorMessage("All field must be required");
      return;
    }
    if (newPassword.length < 6 || confirmPassword.length < 6) {
      setErrorMessage("New Password and Confirm Password cannot less than 6 characters");
      return;
    }
    if (newPassword != confirmPassword) {
      setErrorMessage("Confirm password doesn't match");
      return;
    }
    setErrorMessage("");
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmPassword", confirmPassword);
    updateChangePasswordMutation.mutate(formData);
  };

  const useCheckOtpMutation = useMutation({
    mutationFn: (otpConfirmRequest) => {
      return axiosClient.put(API_URL_CHECK_OTP, otpConfirmRequest);
    },
    onSuccess: (data) => {
      if (data?.data?.status == 200) {
        user.refetch();
        // alert(data?.data?.message)
        // setSuccess(data?.data?.message)

        navigate("/account-settings");
      }
      if (data?.data?.status == 404) {
        user.refetch();
        alert(data?.data?.message);
      }
    },
  });

  const putCheckOtp = () => {
    console.log(inputsRef);
    const values = inputsRef.current.map((input) => input.value);
    const valuesString = values.join("");

    if (valuesString.length != 4) {
      setOtpErrorMessage("OTP must have 4 digits");
      return;
    }
    setOtpErrorMessage("");

    const formData = new FormData();
    formData.append("Otp", valuesString);

    useCheckOtpMutation.mutate(formData);
  };

  if (updateChangePasswordMutation.isPending) {
    return <WaitingPopUp />;
  }
  return (
    <>
      <Container>
        <div className="title">Login</div>
        {stage == 1 && (
          <ConfirmPasswordContainer>
            <div className="title-option">Change Password</div>

            <div>Current Password</div>
            <input
              type="password"
              className="password-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <div style={{ color: "rgb(0,132,137)", cursor: "pointer" }}>Forget Password ?</div>

            <div>New password</div>
            <input
              type="password"
              className="password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div>Confirm password</div>
            <input
              type="password"
              className="password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div style={{ color: "red" }}>{errorMessage}</div>
            <button className="update-password-button" onClick={putUpdatePassword}>
              Update Password
            </button>
          </ConfirmPasswordContainer>
        )}
        {stage == 2 && (
          <OtpContainer>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bolder",
                marginTop: "3%",
                marginBottom: "2%",
              }}
            >
              Enter your verification code
            </div>
            <div>Enter the code we emailed to</div>
            <div> {user?.data?.data?.email}</div>
            <div id="inputs" className="inputs">
              {Array.from({ length: 4 }, (_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className="input"
                  type="text"
                  inputMode="numeric"
                  onChange={(e) => handleInput(index, e)}
                  onKeyUp={(e) => handleKeyUp(index, e)}
                />
              ))}
            </div>
            <div style={{ color: "red", paddingTop: "3%" }}>{otpErrorMessage}</div>
            <div className="buttons-options">
              <div onClick={(e) => setStage(1)} style={{ cursor: "pointer" }}>
                Back
              </div>
              <button
                style={{
                  backgroundColor: "white",
                  border: "solid thin black",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={putCheckOtp}
              >
                Submit
              </button>
            </div>
          </OtpContainer>
        )}
      </Container>
      {/* {success && <SuccessPopUp message={success} action={() => setSuccess('')}/>} */}
    </>
  );
}
