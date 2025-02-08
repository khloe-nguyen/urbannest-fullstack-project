import React, { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { CreateFavouriteMutation, FavouriteRequest } from "./api/collectionFavApi";
import { UserRequest } from "@/shared/api/userApi";

const StylePopUp = styled(PopUp)`
  width: 30rem;
  height: 55vh;
  overflow-y: auto;
  padding: 0;
`;

const StyleTitle = styled.div`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid lightgray;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 2;
`;

const StyleBody = styled.div`
  width: 100%;
  padding: 0;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const StyleWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyleLabel = styled.label`
  position: absolute;
  left: 14%;
  top: 50%;
  transform: translateY(-50%);
  transition: 0.2s ease all;
  color: gray;
  font-size: 1rem;
  pointer-events: none;
`;

const StyleInput = styled.input`
  width: 80%;
  padding: 1.3rem 0.5rem;
  border: 1px solid lightgray;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    border-color: black;
    outline: none;
  }

  &:focus + ${StyleLabel}, &:not(:placeholder-shown) + ${StyleLabel} {
    top: 20%;
    font-size: 0.8rem;
    color: black;
  }
`;

const StyleSubmit = styled.div`
  position: sticky;
  bottom: 0;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid lightgray;
  background-color: white;
  z-index: 2;
`;

const StyleCreateButton = styled.div`
  padding: 1rem 1rem;
  border-radius: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const NewCollectionPopup = ({ properties, favouriteRequest, action }) => {
  const user = UserRequest();
  const createFavouriteMutation = CreateFavouriteMutation();
  const [collectionName, setCollectionName] = useState("");
  const [searchParams] = useSearchParams();

  const HandleSubmit = () => {
    if (!collectionName) {
      return;
    }
    const userId = searchParams.get("userId") || "";
    const propertyId = searchParams.get("propertyId") || "";

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("propertyId", propertyId);
    formData.append("collectionName", collectionName);

    createFavouriteMutation.mutate(formData, {
      onSuccess: () => {
        setCollectionName(""); // Reset collection name after success
        favouriteRequest.refetch();
        properties.refetch();
        user.refetch();

        action();
      },
      onError: (error) => {
        console.error("Error Adding Collection:", error);
      },
    });
  };

  //Check Form Valid
  const isFormValid = () => {
    const userId = searchParams.get("userId") || "";
    const propertyId = searchParams.get("propertyId") || "";
    return collectionName && userId && propertyId;
  };

  return (
    <StylePopUp action={action}>
      <StyleTitle>Create your new wishlist</StyleTitle>
      <StyleBody>
        <StyleWrapper>
          <StyleInput
            required
            type="text"
            value={collectionName}
            onChange={(e) => {
              if (e.target.value.length <= 20) {
                setCollectionName(e.target.value);
              }
            }}
            placeholder=" " // Placeholder must be a space for the effect to work
          />
          <StyleLabel>Name</StyleLabel>
        </StyleWrapper>
        <p>{collectionName.length}/20</p>
      </StyleBody>
      <StyleSubmit>
        <StyleCreateButton
          onClick={HandleSubmit}
          disabled={!isFormValid() || createFavouriteMutation.isLoading}
        >
          {createFavouriteMutation.isLoading ? "Adding..." : "Submit"}
        </StyleCreateButton>
        {createFavouriteMutation.isError && (
          <p style={{ color: "red" }}>Adding collection failed!</p>
        )}
        {createFavouriteMutation.isSuccess && <p style={{ color: "green" }}>Collection added!</p>}
      </StyleSubmit>
    </StylePopUp>
  );
};
