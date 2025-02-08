import styled from "styled-components";
import { useState } from "react";
import { GetManagedCityRequest } from "./api/managedCityAp";
import Pagination from "@/shared/components/Pagination/Pagination";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import TextInput from "@/shared/components/Input/TextInput";
import SelectInput from "@/shared/components/Input/SelectInput";
import { UpdateCityStatusRequest } from "./api/managedCityAp";
import { Link } from "react-router-dom";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    /* background-color: #0091ea; */
    /* color: #ffffff; */
    border-bottom: 3px solid black;
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

const Filter = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const PropertyCount = styled.p`
  font-weight: 600;

  color: rgba(0, 0, 0, 0.7);
`;

const CustomSelectInput = styled(SelectInput)`
  width: 12rem;
`;

const ActionStyled = styled.div`
  display: flex;
  gap: 1rem;

  & a {
    color: #701e8b;
  }

  & a:hover {
    color: red;
  }
`;

const optionsPage = [
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
  { label: "100 items", value: 100 },
];

const optionStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: true },
  { label: "Not Active", value: false },
];

export default function ManagedCity() {
  const updateCityStatus = UpdateCityStatusRequest();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [status, setStatus] = useState(optionStatus[0]);
  const managedCity = GetManagedCityRequest(currentPage - 1, totalPage.value, search, status.value);

  const onChangeCityStatus = (id, status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    updateCityStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          managedCity.refetch();
        }
      },
    });
  };

  return (
    <Container>
      <Filter>
        <TextInput placeholder={"Search for location"} state={search} setState={setSearch} />
        <CustomSelectInput state={status} setState={setStatus} options={optionStatus} />
        <CustomSelectInput state={totalPage} setState={setTotalPage} options={optionsPage} />
      </Filter>
      <TableContent>
        <thead>
          <tr>
            <th>CITY</th>
            <th>PROPERTY TOTAL</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {managedCity.isSuccess &&
            managedCity.data.data.map((city, index) => {
              return (
                <tr key={index}>
                  <td>{city.cityName}</td>
                  <td>
                    <PropertyCount>{city.propertyCount} property</PropertyCount>
                  </td>
                  <td>
                    <InputCheckBox
                      onChange={() => onChangeCityStatus(city.id, !city.managed)}
                      checked={city.managed}
                    />
                  </td>
                  <td>
                    {" "}
                    <ActionStyled>
                      {/* <Link to={"/admin/edit_amenity?id=" + city.id}>Send mail</Link> */}
                      <Link to={"/admin/listing_list?city=" + city.id}>View property</Link>
                    </ActionStyled>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableContent>
      <Footer>
        {managedCity.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={managedCity.data.totalPages}
          />
        )}
      </Footer>
    </Container>
  );
}
