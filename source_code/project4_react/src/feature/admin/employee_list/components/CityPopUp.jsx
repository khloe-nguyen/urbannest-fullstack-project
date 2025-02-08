import { useEffect, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import styled, { css } from "styled-components";
import XButton from "@/shared/components/Button/XButton";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import TextInput from "@/shared/components/Input/TextInput";
import { ChangeEmployeeManagedCityRequest } from "../api/employeeListApi";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  h4 {
    font-size: 18px;
  }
`;

const BodyStyled = styled.div`
  padding: 1rem 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h4 {
    font-size: 17px;
    font-weight: 600;
    padding: 0.5rem 0;
  }

  height: 30rem;
  overflow: auto;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }
`;

const FooterStyled = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border-radius: 5px;
  }

  > button:active {
    transform: scale(0.9);
  }

  > button:nth-of-type(2) {
    background-color: black;
    color: white;
  }
`;

const ManagedCityStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.2rem 0;

  ${(props) => {
    if (!props.$active) {
      return css`
        color: rgba(0, 0, 0, 0.4);
      `;
    }
  }}
`;

export default function CityPopUp({ action, employee, employeeList }) {
  const managedCityAdmin = ManagedCityAdminRequest();
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState(employee.cities.map((empCity) => empCity.id));
  const changeEmployeeManagedCity = ChangeEmployeeManagedCityRequest();

  const onAccept = () => {
    const formData = new FormData();
    formData.append("userId", employee.id);
    cities.forEach((city) => formData.append("cityId", city));

    changeEmployeeManagedCity.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          employeeList.refetch();
          action();
        }
      },
    });
  };

  return (
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h4>Managed city</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <TextInput state={search} setState={setSearch} placeholder={"Search"} />

        {managedCityAdmin.isSuccess &&
          managedCityAdmin.data.data
            .filter(
              (city) =>
                (city.managed == true ||
                  employee.cities.find((empCity) => empCity.id == city.id)) &&
                city.cityName.toLowerCase().includes(search.toLowerCase())
            )
            .map((city, index) => {
              return (
                <ManagedCityStyled key={index} $active={city.managed}>
                  <p>{city.cityName}</p>
                  <div>
                    <InputCheckBox
                      checked={cities.includes(city.id)}
                      onChange={() => {
                        if (cities.includes(city.id)) {
                          setCities(cities.filter((empCity) => empCity != city.id));
                        } else {
                          cities.push(city.id);
                          setCities([...cities]);
                        }
                      }}
                    />
                  </div>
                </ManagedCityStyled>
              );
            })}
      </BodyStyled>
      <hr />
      <FooterStyled>
        <button onClick={action}>Cancel</button>
        <button onClick={onAccept}>Accept</button>
      </FooterStyled>
    </PopUpStyled>
  );
}
