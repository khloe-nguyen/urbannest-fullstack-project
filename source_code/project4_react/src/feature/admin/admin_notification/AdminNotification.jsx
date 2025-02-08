import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import {
  DeleteNotificationRequest,
  GetNotificationRequest,
  UpdateNotificationRequest,
} from "./api/adminNotificationApi";
import Pagination from "@/shared/components/Pagination/Pagination";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { Link } from "react-router-dom";
import { AllSelection } from "@tiptap/pm/state";
import SelectInput from "@/shared/components/Input/SelectInput";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
  min-height: 30rem;

  display: flex;
  flex-direction: column;
  gap: 5rem;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  flex-direction: row !important;

  row-gap: none !important;
  justify-content: flex-end;
`;

const HeaderButtonStyled = styled.button`
  background-color: white;
  border: none;
  padding: 10px 20px;

  cursor: pointer;
  font-weight: 600;
  transition: all 1s;

  & svg {
    font-size: 25px;
  }
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

export default function AdminNotification() {
  const updateNotification = UpdateNotificationRequest();
  const deleteNotification = DeleteNotificationRequest();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(statusOptions[0]);

  const getNotification = GetNotificationRequest(currentPage - 1, 10, status.value);

  const onChangeReadStatus = (id) => {
    const formData = new FormData();

    formData.append("id", id);

    updateNotification.mutate(formData, {
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

    deleteNotification.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getNotification.refetch();
        }
      },
    });
  };

  return (
    <Container>
      <div>
        <HeaderStyled>
          <CustomSelectInput options={statusOptions} state={status} setState={setStatus} />
        </HeaderStyled>

        <TableContent>
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
        </TableContent>
      </div>

      {getNotification.isSuccess && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={getNotification.data.totalPages}
        />
      )}
    </Container>
  );
}
