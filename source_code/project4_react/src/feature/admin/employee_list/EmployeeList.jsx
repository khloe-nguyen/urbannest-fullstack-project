import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { GetEmployeeListRequest } from "./api/employeeListApi";
import TextInput from "@/shared/components/Input/TextInput";
import Pagination from "@/shared/components/Pagination/Pagination";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import SelectInput from "@/shared/components/Input/SelectInput";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { ChangeEmployeeStatusRequest } from "./api/employeeListApi";
import { useSearchParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
import CityPopUp from "./components/CityPopUp";
import RolePopUp from "./components/RolePopUp";
import { AdminRequest } from "@/shared/api/adminApi";
import { useNavigate } from "react-router-dom";
import { VscSettings } from "react-icons/vsc";
import { useRef } from "react";
import { RoleRequest } from "@/shared/api/roleAdminApi";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import EditPasswordPopUp from "./components/EditPasswordPopUp";

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
  justify-content: space-between;

  > div:nth-of-type(2) {
    display: flex;
    gap: 1rem;
  }

  > div:nth-of-type(1) {
    position: relative;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
`;

const EmployeeColumn = styled.div`
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

const CustomTextInput = styled(TextInput)`
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
  width: 20rem;

  display: flex;
  flex-direction: column;
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

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionStatus = [
  { label: "All", value: null },
  { label: "Active", value: true },
  { label: "Not Active", value: false },
];

export default function EmployeeList() {
  const [isResetPassword, setIsResetPassword] = useState();
  const [filterCity, setFilterCity] = useState([]);
  const [filterRole, setFIlterRole] = useState([]);
  const filterContainerRef = useRef();
  const filterButtonRef = useRef();
  const [isFilter, setIsFilter] = useState(false);
  const navigate = useNavigate();
  const rolesAdmin = RoleRequest();
  const managedCityAdmin = ManagedCityAdminRequest();
  const admin = AdminRequest();
  let [searchParams, setSearchParams] = useSearchParams();
  const [cityPopUp, setCityPopUp] = useState();
  const [rolePopUp, setRolePopUp] = useState();
  const changeEmployeeStatus = ChangeEmployeeStatusRequest();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [search, setSearch] = useState(
    searchParams.get("search") ? searchParams.get("search") : ""
  );
  const [status, setStatus] = useState(optionStatus[0]);
  const getEmployeeList = GetEmployeeListRequest(
    currentPage - 1,
    totalPage.value,
    search,
    status.value,
    filterCity?.map((item) => item.value),
    filterRole?.map((item) => item.value)
  );

  useEffect(() => {
    if (
      !admin.data.data.roles.find(
        (role) => role.roleName == "EMPLOYEE_MANAGEMENT" || role.roleName == "ADMIN"
      )
    ) {
      navigate("admin_login");
    }
  }, []);

  useEffect(() => {
    const event = (ev) => {
      if (
        filterContainerRef.current &&
        !filterButtonRef.current.contains(ev.target) &&
        !filterContainerRef.current.contains(ev.target)
      ) {
        setIsFilter(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  const onChangeStatus = (employeeId) => {
    const formData = new FormData();
    formData.append("employeeId", employeeId);

    changeEmployeeStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getEmployeeList.refetch();
        }
      },
    });
  };

  return (
    <>
      <Container>
        <Filter>
          <div>
            <FilterButtonStyled ref={filterButtonRef} onClick={() => setIsFilter((prev) => !prev)}>
              Filter <VscSettings />
            </FilterButtonStyled>
            {isFilter && (
              <FilterContainerStyled ref={filterContainerRef}>
                <div>
                  <p>Filter by role</p>
                  <SelectInput
                    isMulti={true}
                    state={filterRole}
                    setState={setFIlterRole}
                    options={
                      rolesAdmin.isSuccess &&
                      rolesAdmin.data.data
                        .filter((role) => role.roleName != "ADMIN" && role.roleName != "EMPLOYEE")
                        .map((role) => {
                          return { label: role.roleName, value: role.id };
                        })
                    }
                  />
                </div>
                <div>
                  <p>Filter by managed city</p>
                  <SelectInput
                    isMulti={true}
                    state={filterCity}
                    setState={setFilterCity}
                    options={
                      managedCityAdmin.isSuccess &&
                      managedCityAdmin.data.data
                        .filter((city) => city.managed == true)
                        .map((city) => {
                          return { label: city.cityName, value: city.id };
                        })
                    }
                  />
                </div>
                <hr />
                <div>
                  <button
                    onClick={() => {
                      setFIlterRole([]);
                      setFilterCity([]);
                    }}
                  >
                    Clear filter
                  </button>
                </div>
              </FilterContainerStyled>
            )}
          </div>
          <div>
            <CustomTextInput
              placeholder={"Search for email and name"}
              state={search}
              setState={(value) => {
                setSearchParams({ search: value });
                setSearch(value);
              }}
            />
            <CustomSelectInput state={status} setState={setStatus} options={optionStatus} />
            <CustomSelectInput state={totalPage} setState={setTotalPage} options={optionsPage} />
          </div>
        </Filter>
        <TableContent>
          <thead>
            <tr>
              <th>EMAIL</th>
              <th>PHONE NUMBER</th>
              <th>ROLE</th>
              <th>MANAGED CITY</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {getEmployeeList.isSuccess &&
              getEmployeeList.data.data.map((employee, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <EmployeeColumn>
                        <div>
                          <Avatar round size="70" src={employee.avatar} name={employee.firstName} />
                        </div>
                        <div>
                          <h4>{employee.email}</h4>
                          <p>
                            {employee.firstName} {employee.lastName}
                          </p>
                        </div>
                      </EmployeeColumn>
                    </td>
                    <td>{employee.phoneNumber}</td>
                    <td>
                      <ButtonStyled onClick={() => setRolePopUp(employee)}>Detail</ButtonStyled>
                    </td>
                    <td>
                      <ButtonStyled onClick={() => setCityPopUp(employee)}>Detail</ButtonStyled>
                    </td>
                    <td>
                      <InputCheckBox
                        onChange={() => onChangeStatus(employee.id)}
                        checked={employee.status}
                      />
                    </td>
                    <td>
                      <ActionStyled>
                        <Link to={"/admin/update_employee/" + employee.id}>Edit</Link>

                        <Link onClick={() => setIsResetPassword(employee.id)}>Edit password</Link>
                      </ActionStyled>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableContent>
        <Footer>
          {getEmployeeList.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getEmployeeList.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {cityPopUp && (
        <CityPopUp
          action={() => setCityPopUp()}
          employee={cityPopUp}
          employeeList={getEmployeeList}
        />
      )}
      {rolePopUp && (
        <RolePopUp
          action={() => setRolePopUp()}
          employee={rolePopUp}
          employeeList={getEmployeeList}
        />
      )}
      {isResetPassword && (
        <EditPasswordPopUp empId={isResetPassword} action={() => setIsResetPassword()} />
      )}
    </>
  );
}
