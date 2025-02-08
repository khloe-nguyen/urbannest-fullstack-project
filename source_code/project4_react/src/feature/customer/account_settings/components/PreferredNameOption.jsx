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

const Error = styled.div`
  color: red;
`;

export default function PreferredNameOption({ preferredName }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [descriptionAfter, setDescriptionAfter] = useState(
    "This is how your first name will appear to Hosts and guests. Learn more"
  );
  const [editAfter, setEditAfter] = useState("Add");
  const [preferredNameInput, setPreferredNameInput] = useState(preferredName || "");
  const [preferredNameError, setPreferredNameError] = useState({ isError: false, message: "" });
  const API_URL = "http://localhost:8080/userCM/preferredName";
  const user = UserRequest();
  useEffect(() => {
    setPreferredNameInput(preferredName || "");
    setPreferredNameError({ isError: false, message: "" });
    if (isDisplay) {
      setDescriptionAfter("Make sure this matches the name on your government ID.");
      setEditAfter("Cancel");
    } else {
      preferredName == null || preferredName === ""
        ? setDescriptionAfter("Not Provided")
        : setDescriptionAfter(preferredName);
      // setDescriptionAfter("Not Provided");
      setEditAfter("Add");
    }
  }, [isDisplay]);

  const handlePreferredNameInput = (value) => {
    setPreferredNameInput(value);
    if (value == "") {
      setPreferredNameError({ isError: true, message: "Preferred Name cannot be blank" });
      return;
    }
    if (value.length > 10) {
      setPreferredNameError({ isError: true, message: "Preferred Name cannot too long" });
      return;
    }
    setPreferredNameError({ isError: false, message: "" });
  };

  const useUpdatePreferredNameMutation = useMutation({
    mutationFn: (preferredNameRequest) => {
      return axiosClient.put(API_URL, preferredNameRequest);
    },
    onSuccess: (data) => {
      if (data?.data?.status == 200) {
        user.refetch();
        setIsSuccess(true);
      }
    },
  });

  const putPreferredName = (event) => {
    event.preventDefault();

    if (preferredNameError.isError) {
      return;
    }

    console.log(preferredNameInput);
    const formData = new FormData();
    formData.append("preferredName", preferredNameInput);

    useUpdatePreferredNameMutation.mutate(formData);
  };
  return (
    <>
      <Container>
        <PersonalSettingOption
          title="Preferred name"
          description={descriptionAfter}
          edit={editAfter}
          isDisabled={false}
          onActionClick={setIsDisplay}
        />
        {isDisplay && (
          <FormGroup>
            <FormControl>
              <FormContainer>
                <FormTitle>Prefered Name (Optional)</FormTitle>
                <FormInput
                  value={preferredNameInput}
                  onChange={(e) => handlePreferredNameInput(e.target.value)}
                ></FormInput>
              </FormContainer>
              {preferredNameError.isError && <Error>{preferredNameError.message}</Error>}
            </FormControl>
            <FormButton onClick={(event) => putPreferredName(event)}>Save</FormButton>
          </FormGroup>
        )}
      </Container>
      {isSuccess && <SuccessPopUp action={() => setIsSuccess(false)} message={"Success update "} />}
    </>
  );
}
