import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PersonalSettingOption from "./common/PersonalSettingOption";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/shared/api/axiosClient";
import { UserRequest } from "@/shared/api/userApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";

const Container = styled.div`
  border-bottom: solid thin rgb(176, 176, 176);
  padding-bottom: 3%;
`;
const FormGroup = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 10px;
  margin-top: 3%;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
`;
const FormContainer = styled.div`
  min-width: 289px;
  min-height: 52px;
  border: solid thin rgb(176, 176, 176);
  border-radius: 10px;
  padding: 3%;
`;

const FormTitle = styled.div`
  color: rgb(176, 176, 176);
  cursor: default;
`;

const FormInput = styled.input`
  width: 100%;
  border: none !important;
  outline: none !important;
`;
const FormButton = styled.button`
  height: 48px;
  width: 80px;
  border-radius: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
`;

const Error = styled.div`
  color: red;
`;
export default function LegalNameOption({ firstName, lastName }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [descriptionAfter, setDescriptionAfter] = useState(`${firstName} ${lastName}`);
  const [editAfter, setEditAfter] = useState("Edit");
  const [firstNameInput, setFirstNameInput] = useState(firstName);
  const [lastNameInput, setLastNameInput] = useState(lastName);
  const [firstNameError, setFirstNameError] = useState({ isError: false, message: "" });
  const [lastNameError, setLastNameError] = useState({ isError: false, message: "" });
  const API_URL = "http://localhost:8080/userCM/legalName";
  const user = UserRequest();
  const useLegalNameMutation = useMutation({
    mutationFn: (legalNameRequest) => {
      return axiosClient.put(API_URL, legalNameRequest);
    },
    onSuccess: (data) => {
      if (data?.data?.status == 200) {
        user.refetch();
        setIsSuccess(true);
      }
    },
  });

  useEffect(() => {
    setFirstNameInput(firstName);
    setLastNameInput(lastName);
    setFirstNameError({ isError: false, message: "" });
    setLastNameError({ isError: false, message: "" });
    if (isDisplay) {
      setDescriptionAfter("Make sure this matches the name on your government ID.");
      setEditAfter("Cancel");
    } else {
      setDescriptionAfter(`${firstName} ${lastName}`);
      setEditAfter("Edit");
    }
  }, [isDisplay]);

  const putLegalName = (event) => {
    event.preventDefault();
    if (firstNameError.isError || lastNameError.isError) {
      return;
    }
    const formData = new FormData();
    formData.append("firstName", firstNameInput);
    formData.append("lastName", lastNameInput);
    useLegalNameMutation.mutate(formData);
  };

  const handleFirstNameInput = (value) => {
    setFirstNameInput(value);
    if (value == "") {
      setFirstNameError({ isError: true, message: "First Name cannot be blank" });
      return;
    }
    if (value.length > 10) {
      setFirstNameError({ isError: true, message: "First Name cannot too long" });
      return;
    }
    setFirstNameError({ isError: false, message: "" });
  };

  const handleLastNameInput = (value) => {
    setLastNameInput(value);
    if (value == "") {
      setLastNameError({ isError: true, message: "Last Name cannot be blank" });
      return;
    }
    if (value.length > 10) {
      setLastNameError({ isError: true, message: "Last Name cannot too long" });
      return;
    }
    setLastNameError({ isError: false, message: "" });
  };
  return (
    <>
      <Container>
        <PersonalSettingOption
          title="Legal name"
          description={descriptionAfter}
          edit={editAfter}
          isDisabled={false}
          onActionClick={setIsDisplay}
        />
        {isDisplay && (
          <FormGroup>
            <FormControl>
              <FormContainer>
                <FormTitle>First name on ID</FormTitle>
                <FormInput
                  value={firstNameInput}
                  onChange={(e) => handleFirstNameInput(e.target.value)}
                ></FormInput>
              </FormContainer>
              {firstNameError.isError && <Error>{firstNameError.message}</Error>}
            </FormControl>
            <FormControl>
              <FormContainer>
                <FormTitle>Last name on ID</FormTitle>
                <FormInput
                  value={lastNameInput}
                  onChange={(e) => handleLastNameInput(e.target.value)}
                ></FormInput>
              </FormContainer>
              {lastNameError.isError && <Error>{lastNameError.message}</Error>}
            </FormControl>
            <FormButton onClick={(event) => putLegalName(event)}>Save</FormButton>
          </FormGroup>
        )}
      </Container>
      {isSuccess && <SuccessPopUp action={() => setIsSuccess(false)} message={"Success update "} />}
    </>
  );
}
