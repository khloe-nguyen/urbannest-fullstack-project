import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PersonalSettingOption from "./common/PersonalSettingOption";
import phones from "../phones.json";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "@/shared/api/axiosClient";
import { UserRequest } from "@/shared/api/userApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
const Container = styled.div`
  border-bottom: solid thin rgb(176, 176, 176);
  padding-bottom: 3%;
  padding-top: 3%;
`;

const FormGroup = styled.form`
  display: grid;
  grid-template-columns: 1fr;
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
  padding: 1%;
`;

const FormTitle = styled.div`
  color: rgb(176, 176, 176);
  cursor: default;
`;

const FormInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
`;
const FormButton = styled.button`
  height: 48px;
  width: 80px;
  border-radius: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
`;
const FormSelect = styled.select`
  width: 300px;
  border-radius: 8px;
`;
const FormOption = styled.option``;

const TitleOption = styled.div`
  margin-bottom: 2%;
  font-weight: bolder;
`;

const FormInputPhoneParent = styled.div`
  /* position: relative; */
  display: flex;
  flex-direction: row;
  gap: 3%;
`;
const FormInputPhoneChild = styled.div`
  /* position: absolute; */
`;
const FormInputPhone = styled.input`
  border: none;
  outline: none;
  width: 100%;
`;
const Error = styled.div`
  color: red;
`;

export default function PhoneNumberOption({ phoneNumber }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [descriptionAfter, setDescriptionAfter] = useState(
    "Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used."
  );
  const [editAfter, setEditAfter] = useState("Add");
  const [dialCode, setDialCode] = useState(phones[0]?.dial_code);
  const [countryName, setCountryName] = useState(phones[0]?.name);
  const [phoneInput, setPhoneInput] = useState("");
  const user = UserRequest();
  const API_URL = "http://localhost:8080/userCM/phoneNumber";

  useEffect(() => {
    if (isDisplay) {
      setEditAfter("Close");
    } else {
      setEditAfter("Add");
    }
  }, [isDisplay]);

  useEffect(() => {
    getPhoneNumberCallback(
      phoneNumber,
      (prefix) => {
        setDialCode(prefix);
      },
      (suffix) => {
        setPhoneInput(suffix);
      }
    );
  }, [phoneNumber, isDisplay]);

  const putPhoneNumber = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const phoneNumberRequest = dialCode + "," + phoneInput;
    formData.append("phoneNumber", phoneNumberRequest);
    updatePhoneNumberMutation.mutate(formData);
  };
  const updatePhoneNumberMutation = useMutation({
    mutationFn: (phoneNumberRequest) => {
      return axiosClient.put(API_URL, phoneNumberRequest);
    },
    onSuccess: (data) => {
      user.refetch();
      setIsSuccess(true);
    },
  });

  const handleOptionChange = (event) => {
    setDialCode(event.target.value);
  };

  const handlePhoneInput = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue) && inputValue.length < 11) {
      setPhoneInput(event.target.value);
    }
    return;
  };

  const getPhoneNumberCallback = (phone, prefix, suffix) => {
    if (phone == null || phone == "") {
      prefix(phones[0]?.dial_code);
      suffix("");
      return;
    }
    const phoneNumberArraySplit = phone.split(",");
    prefix(phoneNumberArraySplit[0]);
    suffix(phoneNumberArraySplit[1]);
    return;
  };

  return (
    <>
      <Container>
        <PersonalSettingOption
          title="Phone numbers"
          description={
            phoneNumber
              ? phoneNumber
              : "Add a number so confirmed guests and Airbnb can get in touch. You can add other numbers and choose how they’re used."
          }
          edit={editAfter}
          isDisabled={false}
          onActionClick={setIsDisplay}
        />
        {isDisplay && (
          <FormGroup>
            <TitleOption>Enter a new phone number</TitleOption>
            <FormControl>
              <FormContainer>
                <FormTitle>Country Code</FormTitle>
                <FormSelect value={dialCode} onChange={handleOptionChange}>
                  {phones?.map((phone, index) => (
                    <FormOption key={index} value={phone.dial_code}>
                      {phone.name} {phone.dial_code}
                    </FormOption>
                  ))}
                </FormSelect>
              </FormContainer>
            </FormControl>
            <FormControl>
              <FormContainer>
                <FormTitle>Phone Number</FormTitle>
                <FormInputPhoneParent>
                  <FormInputPhoneChild>{dialCode}</FormInputPhoneChild>
                  <FormInputPhone value={phoneInput} onChange={handlePhoneInput}></FormInputPhone>
                </FormInputPhoneParent>
              </FormContainer>
            </FormControl>
            <FormButton onClick={putPhoneNumber}>Verify</FormButton>
          </FormGroup>
        )}
      </Container>
      {isSuccess && <SuccessPopUp action={() => setIsSuccess(false)} message={"Success update "} />}
    </>
  );
}
