import Button1 from "@/shared/components/Button/Button1";
import TextInput from "@/shared/components/Input/TextInput";
import PopUp from "@/shared/components/PopUp/PopUp";
import React, { useState } from "react";
import styled from "styled-components";
import { ChangeEmployeePassswordRequest } from "../api/employeeListApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";

const CustomPopup = styled(PopUp)`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export default function EditPasswordPopUp({ action, empId }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const changeEmployeePasssword = ChangeEmployeePassswordRequest();
  const [isSuccess, setIsSuccess] = useState(false);

  const onChangePassword = () => {
    if (newPassword.length < 6) {
      alert("Password cannot smaller than 6");
      return;
    }

    if (newPassword != confirm) {
      alert("Wrong confirm password");
      return;
    }

    const formData = new FormData();
    formData.append("id", empId);
    formData.append("password", newPassword);

    changeEmployeePasssword.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setIsSuccess(true);
        }
      },
    });
  };

  return (
    <>
      <CustomPopup>
        <div>
          <div>
            <label>New password</label>
            <TextInput type="password" state={newPassword} setState={setNewPassword} />
          </div>
          <div>
            <label>Password confirm</label>
            <TextInput type="password" state={confirm} setState={setConfirm} />
          </div>
        </div>
        <ButtonContainer>
          <Button1 onClick={onChangePassword}>Reset Password</Button1>
          <Button1 onClick={action}>Cancel</Button1>
        </ButtonContainer>
      </CustomPopup>
      {isSuccess && (
        <SuccessPopUp
          message={"New password is send to employee"}
          action={() => {
            setIsSuccess(false);
            action();
          }}
        />
      )}
    </>
  );
}
