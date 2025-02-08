import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import Pagination from "@/shared/components/Pagination/Pagination";
import {
  DeleteCustomerNotificationRequest,
  GetCustomerNotificationRequest,
  UpdateCustomerNotificationRequest,
} from "./api/customerNotificationApi";
import ChatHeader from "../custome_header/ChatHeader";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import Cookies from "js-cookie";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import SelectInput from "@/shared/components/Input/SelectInput";

const Container = styled.div``;

const HeaderStyled = styled.div`
  display: flex;
  flex-direction: row !important;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
  row-gap: none !important;
  justify-content: space-between;
  align-items: center;
`;

const HeaderButtonStyled = styled.button`
  background-color: white;
  border: none;
  padding: 10px 15px;
  border-bottom: 3px solid black;

  cursor: pointer;
  font-weight: 600;
  transition: all 1s;

  & svg {
    font-size: 25px;
  }
`;

const BodyStyled = styled.div`
  min-height: 30rem;

  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;

  padding: 0 8.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TableContentStyled = styled.table`
  margin: 1rem 0;
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;

  thead tr {
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  tbody tr {
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:hover {
    background-color: #f7f7f7;
  }

  tbody tr svg {
    font-size: 20px;
    color: white;
  }
  tbody tr:hover svg {
    color: black;
    font-size: 20px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }

  & p {
    width: 40rem;
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

const CustomSelectInput = styled(SelectInput)`
  width: 10rem;
`;

const statusOptions = [
  { label: "All", value: null },
  { label: "Not read", value: false },
  { label: "Read", value: true },
];

export default function CustomerNotification() {
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(statusOptions[0]);
  const deleteCustomerNotification = DeleteCustomerNotificationRequest();
  const updateCustomerNotification = UpdateCustomerNotificationRequest();

  const getNotification = GetCustomerNotificationRequest(currentPage - 1, 10, status.value);

  const user = UserRequest();
  const navigate = useNavigate();

  if (user.isLoading) {
    return <WaitingPopUp />;
  }

  if (user.isError) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    navigate("/");
  }

  if (user.isSuccess && user.data.status == 404) {
    navigate("/");
    return;
  }

  if (user.isSuccess && user.data.status == 200 && user.data.data.status == false) {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    user.refetch();
  }

  const onChangeReadStatus = (id) => {
    const formData = new FormData();

    formData.append("id", id);

    updateCustomerNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getNotification.refetch();
        }
      },
    });
  };

  const onDeleteNotification = (id) => {
    const formData = new FormData();

    formData.append("id", id);

    deleteCustomerNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getNotification.refetch();
        }
      },
    });
  };

  return (
    <Container>
      <ChatHeader padding={"10rem"} />
      <BodyStyled>
        <div>
          <HeaderStyled>
            <HeaderButtonStyled>
              <h2>Notification</h2>
            </HeaderButtonStyled>
            <CustomSelectInput options={statusOptions} state={status} setState={setStatus} />
          </HeaderStyled>

          <TableContentStyled>
            <thead>
              <tr>
                <th>MESSAGE</th>
                <th>CREATED AT</th>
                <th>IS READ</th>
              </tr>
            </thead>
            <tbody>
              {getNotification.isSuccess &&
                getNotification.data.data.map((notification, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <p>{notification.message}</p>
                      </td>
                      <td>{formatDate(notification.createdAt)}</td>
                      <td>
                        <InputCheckBox
                          onChange={() => {
                            if (!notification.read) {
                              onChangeReadStatus(notification.id);
                            }
                          }}
                          checked={notification.read}
                        />
                      </td>
                      <th>
                        <ActionStyled>
                          <Link to={notification.url}>Detail</Link>
                          <Link onClick={() => onDeleteNotification(notification.id)}>Remove</Link>
                        </ActionStyled>
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </TableContentStyled>
        </div>

        {getNotification.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getNotification.data.totalPages}
          />
        )}
      </BodyStyled>
      <Footer percent={"78%"} />
    </Container>
  );
}
