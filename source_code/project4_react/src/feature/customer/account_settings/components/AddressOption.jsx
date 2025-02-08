import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PersonalSettingOption from "./common/PersonalSettingOption";
import address from "../vietnamAddress.json";
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 4fr;
  gap: 0px;
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

  &:focus {
    outline: none;
    border: none;
  }
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

const FormSelectContainer = styled.div`
  width: 280px;
  height: 56px;
  position: relative;
`;

const FormSelect = styled.select`
  border: solid thin rgb(176, 176, 176);
  border-radius: 8px;
  width: 100%;
  height: 80%;
  position: relative;
  z-index: 1;
`;
const FormOption = styled.option``;
const FormSelectTitle = styled.div`
  font-size: 85%;
  position: absolute;
  left: 5px;
  top: -9px;
  z-index: 2;
  background-color: white;
`;
export default function AddressOption({ addressProp }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const [city, setCity] = useState();

  const [district, setDistrict] = useState();
  const [districts, setDistricts] = useState([]);

  const [ward, setWard] = useState();
  const [wards, setWards] = useState([]);

  const [addressDetail, setAddressDetail] = useState("");
  const [addressDetailError, setAddressDetailError] = useState({ isError: false, message: "" });

  const API_URL = "http://localhost:8080/userCM/address";
  const user = UserRequest();

  const handleCityChange = (event) => {
    setCity(event.target.value);
    address.map((item) => {
      if (item.Id === event.target.value) {
        setDistricts(item.Districts);
        setWards(item.Districts[0].Wards);
        setDistrict(item.Districts[0].Id);
        setWard(item.Districts[0].Wards[0].Id);
      }
    });
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
    const districtId = event.target.value;
    address.map((item) => {
      if (item.Id == city) {
        item.Districts.map((itemDistrict) => {
          if (itemDistrict.Id == districtId) {
            setWards(itemDistrict.Wards);
            setWard(itemDistrict.Wards[0].Id);
            // console.log(itemDistrict.Wards[0].Id);
          }
        });
      }
    });
  };

  const handleWardChange = (event) => {
    setWard(event.target.value);
  };

  const handleAddressDetailChange = (event) => {
    const value = event.target.value;
    setAddressDetail(value);
    if (value == null || value == "") {
      setAddressDetailError({ isError: true, message: "Address Detail cannot be blank" });
      return;
    }
    if (value.length > 30) {
      setAddressDetailError({
        isError: true,
        message: "Address Detail must be less than 30 characters)",
      });
      return;
    }

    const regex = /[!@#$%^&*(),.?":{}|<>]/;
    if (regex.test(value)) {
      setAddressDetailError({
        isError: true,
        message: "Address Detail cannot have special characters",
      });
      return;
    }

    setAddressDetailError({ isError: false, message: "" });
  };

  const putAddress = (event) => {
    event.preventDefault();
    let addressDetailRequest = "";

    address.map((item) => {
      if (item.Id == city) {
        console.log(item.Name);
        addressDetailRequest = item.Name;
        item.Districts.map((itemDistrict) => {
          if (itemDistrict.Id == district) {
            console.log(itemDistrict.Name);
            addressDetailRequest = itemDistrict.Name + ", " + addressDetailRequest;
            itemDistrict.Wards.map((itemDistrictWard) => {
              if (itemDistrictWard.Id == ward) {
                console.log(itemDistrictWard.Name);
                addressDetailRequest = itemDistrictWard.Name + ", " + addressDetailRequest;
              }
            });
          }
        });
      }
    });
    addressDetailRequest = addressDetail + ", " + addressDetailRequest;

    if (!addressDetailError.isError) {
      const formData = new FormData();
      formData.append("address", addressDetailRequest);
      useAddressMutation.mutate(formData);
    }
  };

  const useAddressMutation = useMutation({
    mutationFn: (AddressRequest) => {
      return axiosClient.put(API_URL, AddressRequest);
    },
    onSuccess: (data) => {
      if (data?.data?.status == 200) {
        user.refetch();
        setIsSuccess(true);
      }
    },
  });

  useEffect(() => {
    const cityId = "01";
    setCity(cityId);
    address.map((item) => {
      if (item.Id === cityId) {
        setDistrict(item.Districts[0].Id);
        setDistricts(item.Districts);

        setWard(item.Districts[0].Wards[0].Id);
        setWards(item.Districts[0].Wards);
      }
    });
    setAddressDetail("");
    setAddressDetailError({ isError: false, message: "" });
  }, [isDisplay]);

  return (
    <>
      <Container>
        <PersonalSettingOption
          title="Address"
          description={addressProp != null && addressProp != "" ? addressProp : "Not provided"}
          edit="Edit"
          isDisabled={false}
          onActionClick={setIsDisplay}
        />
        {isDisplay && (
          <FormGroup>
            <FormSelectContainer>
              <FormSelectTitle>City Town</FormSelectTitle>
              <FormSelect value={city} onChange={handleCityChange}>
                {address?.map((item) => (
                  <FormOption key={item.Id} value={item.Id}>
                    {item.Name}
                  </FormOption>
                ))}
                {/* <FormOption>Hồ Chí Minh</FormOption> */}
              </FormSelect>
            </FormSelectContainer>
            <FormSelectContainer>
              <FormSelectTitle>District</FormSelectTitle>
              <FormSelect value={district} onChange={handleDistrictChange}>
                {districts?.map((item) => (
                  <FormOption key={item.Id} value={item.Id}>
                    {item.Name}
                  </FormOption>
                ))}
                {/* <FormOption>Quận Gò Vấp</FormOption> */}
              </FormSelect>
            </FormSelectContainer>
            <FormSelectContainer>
              <FormSelectTitle>Ward</FormSelectTitle>
              <FormSelect value={ward} onChange={handleWardChange}>
                {wards?.map((item) => (
                  <FormOption key={item.Id} value={item.Id}>
                    {item.Name}
                  </FormOption>
                ))}
                {/* <FormOption>Phường 4</FormOption> */}
              </FormSelect>
            </FormSelectContainer>
            <FormSelectContainer></FormSelectContainer>
            <FormControl>
              <FormContainer>
                <FormTitle>Addres Detail</FormTitle>
                <FormInput
                  placeholder="Enter your address"
                  value={addressDetail}
                  onChange={handleAddressDetailChange}
                ></FormInput>
              </FormContainer>
              {addressDetailError.isError && <Error>{addressDetailError?.message}</Error>}
            </FormControl>
            <FormSelectContainer></FormSelectContainer>
            <FormButton onClick={putAddress}>Save</FormButton>
          </FormGroup>
        )}
      </Container>
      {isSuccess && <SuccessPopUp action={() => setIsSuccess(false)} message={"Success update "} />}
    </>
  );
}
