import React, { useState } from "react";
import { GetUserDocumentImageQuery } from "./api/UserDocumentApi";
import Pagination from "@/shared/components/Pagination/pagination";
import styled from "styled-components";
import DatePicker from "react-date-picker";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { now } from "lodash";
import { useMutation } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaHourglassHalf } from "react-icons/fa";
import Avatar from "react-avatar";
import DocumentDetailPopUp from "./components/DocumentDetailPopUp";
import { IoMdCloseCircle } from "react-icons/io";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
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

  .disable {
    opacity: 0.5;
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

  & button {
    background-color: black;
    color: white;
    border-radius: 5px;
    padding: 10px 1rem;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }

  & button:disabled {
    cursor: not-allowed;
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
    color: #ea5e66;
    font-size: 25px;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:nth-of-type(2) {
    > button {
      color: white;
      padding: 10px 1rem;
      border-radius: 15px;
      cursor: pointer;
      background-color: black !important;
    }

    > button:active {
      transform: scale(0.9);
    }
  }
`;

const FooterStyled = styled.div`
  margin: 1rem;
`;

export default function UserDocument() {
  const [isShowDetail, setIsShowDetail] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusId, setStatusId] = useState(1);
  const [fromDateTime, setFromDateTime] = useState(dayjs("2022-04-17T15:30"));
  const [toDateTime, setToDateTime] = useState(dayjs());
  const [errorMessage, setErrorMessage] = useState("");
  const [fromDateTimeFetch, setFromDateTimeFetch] = useState(dayjs("2019-04-17T15:30"));
  const [toDateTimeFetch, setToDateTimeFecth] = useState(dayjs());
  const navigate = useNavigate();

  const getUserDocumentImageQuery = GetUserDocumentImageQuery(
    currentPage - 1,
    10,
    statusId,
    fromDateTimeFetch,
    toDateTimeFetch
  );
  const [statusList, setStatusList] = useState([
    {
      id: 1,
      name: "ALL",
    },
    {
      id: 2,
      name: "ACCEPTED",
    },
    {
      id: 3,
      name: "PENDING",
    },
    {
      id: 4,
      name: "DENY",
    },
  ]);
  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatusId(value);
  };

  const handleButtonSearchClick = () => {
    const fromDateTimeFormat = dayjs(fromDateTime);
    const toDateTimeFormat = dayjs(toDateTime);
    const nowFormat = dayjs();
    if (!fromDateTimeFormat.isValid()) {
      setErrorMessage("From Date is not valid");
      return;
    }
    if (!toDateTimeFormat.isValid()) {
      setErrorMessage("To Date is not valid");
      return;
    }
    if (fromDateTimeFormat.isAfter(toDateTimeFormat)) {
      setErrorMessage("From Date must before To Date");
      return;
    }
    if (toDateTimeFormat.isAfter(nowFormat)) {
      setErrorMessage("To Date cannot over time now");
      return;
    }
    setFromDateTimeFetch(fromDateTimeFormat);
    setToDateTimeFecth(toDateTimeFormat);
    setErrorMessage("");
  };

  const formatDateTime = (datetime) => {
    const date = dayjs(datetime);
    const formattedDate = date.format("YYYY-MM-DD HH:mm");
    return formattedDate;
  };

  const updateUserDocumentMutation = useMutation({
    mutationFn: (formData) => {
      return axiosAdmin.post("userCM/userDocuments", formData);
    },
    onSuccess: (data) => {
      getUserDocumentImageQuery.refetch();
      alert("oke");
    },
  });

  const handleButtonActionClick = (userDocumentId, status) => {
    const formData = new FormData();
    formData.append("id", userDocumentId);
    formData.append("statusId", status);
    updateUserDocumentMutation.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getUserDocumentImageQuery.refetch();
        }
      },
    });
  };

  return (
    <>
      <Container>
        <HeaderStyled>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <DateTimePicker
              label="From DateTime"
              value={fromDateTime}
              onChange={(newValue) => setFromDateTime(newValue)}
            />
            <DateTimePicker
              label="To DateTime"
              value={toDateTime}
              onChange={(newValue) => setToDateTime(newValue)}
            />
          </div>
          <div>
            <div style={{ color: "red" }}>{errorMessage}</div>
            <button style={{ backgroundColor: "#1974D3" }} onClick={handleButtonSearchClick}>
              Search
            </button>
          </div>
        </HeaderStyled>
        <TableContainerStyled>
          <TableContent>
            <thead>
              <tr>
                <th>ID</th>
                <th>Real Avatar</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Create Date</th>
                <th>
                  <div>Status</div>
                  <select onChange={handleStatusChange}>
                    {statusList.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getUserDocumentImageQuery?.isSuccess &&
                getUserDocumentImageQuery.data?.data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <b>{item.id}</b>
                      </td>
                      <td>
                        <Avatar round size="80" src={item.realAvatar} />
                      </td>
                      <td style={{ width: "300px" }}>{item.user.email}</td>
                      <td>{item.phoneNumber}</td>

                      <td>{formatDateTime(item.createDate)}</td>
                      <td>
                        {item.status == "ACCEPTED" && (
                          <StatusStyled>
                            <FaCheck color="lightgreen" /> <span>Accepted</span>
                          </StatusStyled>
                        )}
                        {item.status == "PENDING" && (
                          <StatusStyled>
                            <FaHourglassHalf /> <span>Pending</span>
                          </StatusStyled>
                        )}
                        {item.status == "DENY" && (
                          <StatusStyled>
                            <IoMdCloseCircle /> <span>Denied</span>
                          </StatusStyled>
                        )}
                      </td>
                      <td>
                        <ActionStyled>
                          <Link onClick={() => setIsShowDetail(item)}>Detail</Link>
                          <Link
                            onClick={() => navigate("/admin/user_list?search=" + item.user.email)}
                          >
                            View user
                          </Link>
                          {!(item.status == "ACCEPTED" || item.status == "DENY") && (
                            <>
                              <Link onClick={() => handleButtonActionClick(item.id, 1)}>
                                Accepted
                              </Link>
                              <Link onClick={() => handleButtonActionClick(item.id, 2)}>
                                Denied
                              </Link>
                            </>
                          )}
                        </ActionStyled>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </TableContent>
        </TableContainerStyled>
        <FooterStyled>
          {getUserDocumentImageQuery?.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getUserDocumentImageQuery?.data?.totalPages}
            />
          )}
        </FooterStyled>
      </Container>
      {isShowDetail && (
        <DocumentDetailPopUp
          handleButtonActionClick={handleButtonActionClick}
          action={() => setIsShowDetail()}
          detail={isShowDetail}
        />
      )}
    </>
  );
}
