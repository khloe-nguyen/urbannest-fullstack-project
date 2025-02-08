import React, { useState } from "react";
import styled from "styled-components";
import { GetMailListRequest } from "./api/mailListApi";
import Pagination from "@/shared/components/Pagination/Pagination";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { BsFillSendCheckFill } from "react-icons/bs";
import { BsSendExclamationFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";
import TextInput from "@/shared/components/Input/TextInput";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
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

const Footer = styled.div`
  margin-top: 5rem;
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & svg {
    font-size: 20px;
    color: black;
  }

  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
`;

const ActionStyled = styled.div`
  display: flex;
  gap: 10px;
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
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

const CustomTextInput = styled(TextInput)`
  width: 20rem;
`;

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionStatus = [
  { label: "All", value: "All" },
  { label: "Send", value: "send" },
  { label: "Not send", value: "notsend" },
];

export default function MailList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(optionStatus[0]);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const getMailList = GetMailListRequest(currentPage - 1, 10, search, status.value);

  return (
    <Container>
      <Filter>
        <div></div>
        <div>
          <CustomTextInput
            placeholder={"Search for email and name"}
            state={search}
            setState={(value) => {
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
            <th>SUBJECT</th>
            <th>CREATED AT</th>
            <th>SEND STATUS</th>
            <th>SEND DATE</th>
          </tr>
        </thead>
        <tbody>
          {getMailList.isSuccess &&
            getMailList.data.data.map((mail, index) => {
              return (
                <tr key={index}>
                  <td>{mail.subject}</td>
                  <td>{formatDate(mail.createdAt)}</td>
                  <td>
                    <StatusStyled>
                      {mail.send ? (
                        <>
                          <BsFillSendCheckFill /> Send
                        </>
                      ) : (
                        <>
                          <BsSendExclamationFill /> Schedule
                        </>
                      )}
                    </StatusStyled>
                  </td>
                  <td>{formatDate(mail.sendDate)}</td>
                  <td>
                    <ActionStyled>
                      {mail.send ? (
                        <>
                          <Link
                            to={"/admin/create_mail"}
                            state={{
                              getSubject: mail.subject,
                              getBody: mail.body,
                              getList: mail.toList,
                            }}
                          >
                            Copy
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to={"/admin/edit_mail/" + mail.id}>Edit</Link>
                        </>
                      )}
                    </ActionStyled>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableContent>
      <Footer>
        {getMailList.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getMailList.data.totalPages}
          />
        )}
      </Footer>
    </Container>
  );
}
