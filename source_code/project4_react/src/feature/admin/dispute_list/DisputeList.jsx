import SelectInput from "@/shared/components/Input/SelectInput";
import TextThrottleInput from "@/shared/components/Input/TextThrottleInput";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import { GetDisputeListRequest } from "./api/disputeListApi";
import { Link, useSearchParams } from "react-router-dom";
import { VscSettings } from "react-icons/vsc";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import { FaHourglassHalf, FaSort } from "react-icons/fa";
import Pagination from "@/shared/components/Pagination/Pagination";
import Avatar from "react-avatar";
import getWords from "@/shared/utils/getWords";
import { formatDate } from "@/shared/utils/DateTimeHandle";

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
  min-width: max-content;
  font-size: 0.9em;
  overflow: visible;

  thead tr {
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
  justify-content: space-between;

  > div:nth-of-type(2) {
    display: flex;
    gap: 1rem;
  }

  > div:nth-of-type(1) {
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
  width: 100%;
`;

const PropertyColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const ActionStyled = styled.div`
  display: flex;
  gap: 10px;

  & a {
    color: #551a8b;
  }

  & a:hover {
    color: red;
  }
`;

const ButtonStyled = styled.button`
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: black;
  color: white;
  font-weight: 700;

  border: 1px solid rgba(0, 0, 0, 0.5);

  &:active {
    transform: scale(0.9);
  }
`;

const ExportStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;

  > button:nth-of-type(1) {
    background-color: black;
    color: white;
  }

  > button {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    cursor: pointer;
    gap: 5px;
    font-weight: 600;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const CustomTextInput = styled(TextThrottleInput)`
  width: 20rem;
`;

const FilterButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const FilterContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 40rem;

  /* display: flex;
  flex-direction: column;
  gap: 1rem; */

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  transform: translateY(1rem);

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const MailContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem 2rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 20rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateY(1rem);

  > div {
    display: flex;
    flex-direction: column;
  }

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const FilterStyled = styled.div`
  position: relative;
`;

const StyledCheckBox = styled.div`
  width: fit-content;
`;

const MessageStyled = styled.div`
  position: relative;
`;

const MessageButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const TypeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & h4 {
    font-size: 16px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const BookingTypeStyled = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  svg {
    color: yellow !important;
    font-size: 25px;
  }
`;
const UserColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const TableContainerStyled = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & span {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }

  svg {
    color: #ea5e66 !important;
    font-size: 25px;
  }
`;

const ButtonContainerStyled = styled.div`
  position: relative;
`;

const SortButtonStyled = styled.button`
  background-color: white;
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  background-color: black;
  color: white;
  cursor: pointer;
  gap: 10px;

  &:active {
    transform: scale(0.9);
  }
`;

const SortContainerStyled = styled.div`
  position: relative;
`;

const SortDropDownStyled = styled.div`
  z-index: 1;
  position: absolute;
  width: 19rem;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  transform: translate(-4.5rem, 10px);
  background-color: white;
  padding: 1rem;
  transform: translate(-15rem, 10px);

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AmenityListStyled = styled.p`
  width: 20rem;
`;

const StyledTextInput = styled.input`
  padding: 8px;
  width: 100%;

  border: 2px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionStatus = [
  { label: "All", value: "All" },
  { label: "PENDING", value: "PENDING" },
  { label: "IGNORE", value: "IGNORE" },
  { label: "PROGRESS", value: "PROGRESS" },
  { label: "CLOSED", value: "CLOSED" },
];

export default function DisputeList() {
  const [isFilter, setIsFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [status, setStatus] = useState(optionStatus[0]);
  const [hostSearch, setHostSearch] = useState(
    searchParams.get("host") ? searchParams.get("host") : ""
  );
  const [customerSearch, setCustomerSearch] = useState(
    searchParams.get("customer") ? searchParams.get("customer") : ""
  );
  const [locationFilter, setLocationFilter] = useState([]);
  const [propertySearch, setPropertySearch] = useState(
    searchParams.get("property") ? searchParams.get("property") : ""
  );
  const filterContainerRef = useRef();
  const filterButtonRef = useRef();
  const managedCityAdmin = ManagedCityAdminRequest();
  const [isSort, setIsSort] = useState(false);
  const sortButtonRef = useRef();
  const sortDropDownRef = useRef();

  const getDisputeList = GetDisputeListRequest(
    currentPage - 1,
    totalPage.value,
    status.value,
    hostSearch,
    customerSearch,
    locationFilter?.map((item) => item.value),
    propertySearch
  );

  return (
    <Container>
      <Filter>
        <div>
          <FilterStyled>
            <FilterButtonStyled ref={filterButtonRef} onClick={() => setIsFilter((prev) => !prev)}>
              Filter <VscSettings />
            </FilterButtonStyled>
            {isFilter && (
              <FilterContainerStyled ref={filterContainerRef}>
                <div>
                  <h4>Search for host</h4>
                  <TextThrottleInput
                    placeholder={"Search for name, email of host"}
                    state={hostSearch}
                    setState={(value) => {
                      setSearchParams((prev) => {
                        const newSearchParams = new URLSearchParams(prev); // Create a new instance
                        newSearchParams.set("host", value);
                        return newSearchParams; // Return the new object
                      });
                      setHostSearch(value);
                    }}
                  />
                </div>
                <div>
                  <h4>Search for customer</h4>
                  <TextThrottleInput
                    placeholder={"Search for name, email of customer"}
                    state={customerSearch}
                    setState={(value) => {
                      setSearchParams((prev) => {
                        const newSearchParams = new URLSearchParams(prev); // Create a new instance
                        newSearchParams.set("customer", value);
                        return newSearchParams; // Return the new object
                      });
                      setCustomerSearch(value);
                    }}
                  />
                </div>
                <div>
                  <h4>Location</h4>
                  <SelectInput
                    state={locationFilter}
                    setState={setLocationFilter}
                    isMulti={true}
                    options={
                      managedCityAdmin.isSuccess &&
                      managedCityAdmin.data.data.map((city) => {
                        return { label: city.cityName, value: city.id };
                      })
                    }
                  />
                </div>
              </FilterContainerStyled>
            )}
          </FilterStyled>
        </div>
        <div>
          <CustomTextInput
            placeholder={"Search for proprety id, name"}
            state={propertySearch}
            setState={(value) => {
              setSearchParams((prev) => {
                const newSearchParams = new URLSearchParams(prev); // Create a new instance
                newSearchParams.set("property", value);
                return newSearchParams; // Return the new object
              });
              setPropertySearch(value);
            }}
          />
          <SortContainerStyled>
            <SortButtonStyled ref={sortButtonRef} onClick={() => setIsSort((prev) => !prev)}>
              Sort <FaSort />
            </SortButtonStyled>
            {isSort && (
              <SortDropDownStyled ref={sortDropDownRef}>
                <div>
                  <h4>Page size</h4>
                  <CustomSelectInput
                    state={totalPage}
                    setState={setTotalPage}
                    options={optionsPage}
                  />
                </div>
                {/* <div>
                  <h4>View column</h4>
                  <CustomSelectInput
                    setState={setShowColumn}
                    options={optionColumn}
                    isMulti={true}
                    state={showColumn}
                  />
                </div> */}
                <div>
                  <h4>Status</h4>
                  <CustomSelectInput setState={setStatus} options={optionStatus} state={status} />
                </div>
              </SortDropDownStyled>
            )}
          </SortContainerStyled>
        </div>
      </Filter>

      <TableContainerStyled>
        <TableContent>
          <thead>
            <tr>
              <th>CUSTOMER</th>
              <th>HOST</th>
              <th>PROPERTY</th>
              <th>CREATED AT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {getDisputeList.isSuccess &&
              getDisputeList.data.data.map((dispute, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <UserColumn>
                        <div>
                          <Avatar
                            round
                            size="70"
                            src={dispute.booking.customer.avatar}
                            name={dispute.booking.customer.firstName}
                          />
                        </div>
                        <div>
                          <h4>{dispute.booking.customer.email}</h4>
                          <p>
                            {dispute.booking.customer.firstName} {dispute.booking.customer.lastName}
                          </p>
                        </div>
                      </UserColumn>
                    </td>

                    <td>
                      <UserColumn>
                        <div>
                          <Avatar
                            round
                            size="70"
                            src={dispute.booking.host.avatar}
                            name={dispute.booking.host.firstName}
                          />
                        </div>
                        <div>
                          <h4>{dispute.booking.host.email}</h4>
                          <p>
                            {dispute.booking.host.firstName} {dispute.booking.host.lastName}
                          </p>
                        </div>
                      </UserColumn>
                    </td>

                    <td>
                      <PropertyColumn>
                        <div>
                          <Avatar
                            round={12}
                            size="80"
                            src={dispute.booking.property.propertyImages[0]}
                          />
                        </div>
                        <div>
                          <h4>{getWords(dispute.booking.property.propertyTitle, 3)}</h4>
                          <p>{dispute.booking.propertyCity}</p>
                        </div>
                      </PropertyColumn>
                    </td>
                    <td>{formatDate(dispute.createdAt)}</td>
                    <td>
                      {dispute.status == "PENDING" && (
                        <StatusStyled>
                          <FaHourglassHalf /> <span>Pending</span>
                        </StatusStyled>
                      )}
                    </td>
                    <td>
                      <ActionStyled>
                        <Link to={"/admin/dispute_detail/" + dispute.id}>Detail</Link>
                      </ActionStyled>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableContent>
      </TableContainerStyled>
      <Footer>
        {getDisputeList.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getDisputeList.data.totalPages}
          />
        )}
      </Footer>
    </Container>
  );
}
