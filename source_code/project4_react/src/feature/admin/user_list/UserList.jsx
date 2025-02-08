import React, { useEffect } from "react";
import TextInput from "@/shared/components/Input/TextInput";
import SelectInput from "@/shared/components/Input/SelectInput";
import styled from "styled-components";
import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { GetUserListRequest } from "./api/userListApi";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Avatar from "react-avatar";
import Pagination from "@/shared/components/Pagination/Pagination";
import { useRef } from "react";
import { VscSettings } from "react-icons/vsc";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { IoMailOpen } from "react-icons/io5";
import { AdminBadgeRequest } from "@/shared/api/badgeAdminApi";
import { useNavigate } from "react-router-dom";
import UserBadge from "./components/UserBadge";

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
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
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

const ActionStyled = styled.div`
  display: flex;
  gap: 10px;

  & a {
    color: #ad428b;
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

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionsUser = [
  { label: "All user", value: "all" },
  { label: "Host only", value: "host" },
  { label: "Customer only", value: "customer" },
];

export default function UserList() {
  const [badgePopUp, setBadgePopUp] = useState(false);
  const navigate = useNavigate();
  const adminBadge = AdminBadgeRequest();
  const [checkList, setCheckList] = useState([]);
  const [badges, setBadges] = useState([]);
  const [userType, setUserType] = useState(optionsUser[0]);
  const filterContainerRef = useRef();
  const filterButtonRef = useRef();
  const mailContainerRef = useRef();
  const mailButtonRef = useRef();
  const [isFilter, setIsFilter] = useState(false);
  const [isMail, setIsMail] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [search, setSearch] = useState(
    searchParams.get("search") ? searchParams.get("search") : ""
  );
  const getUserList = GetUserListRequest(
    currentPage - 1,
    totalPage.value,
    search,
    badges?.map((item) => item.value),
    userType.value
  );

  useEffect(() => {
    const event = (ev) => {
      if (
        filterContainerRef.current &&
        !filterButtonRef.current.contains(ev.target) &&
        !filterContainerRef.current.contains(ev.target)
      ) {
        setIsFilter(false);
      }

      if (
        mailContainerRef.current &&
        !mailButtonRef.current.contains(ev.target) &&
        !mailContainerRef.current.contains(ev.target)
      ) {
        setIsMail(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    setCheckList([]);
  }, [currentPage]);

  return (
    <>
      <Container>
        {/* <ExportStyled>
          <button onClick={() => setBadgePopUp(true)}>Badge assignment</button>
        </ExportStyled> */}
        <Filter>
          <div>
            <FilterStyled>
              <FilterButtonStyled
                ref={filterButtonRef}
                onClick={() => setIsFilter((prev) => !prev)}
              >
                Filter <VscSettings />
              </FilterButtonStyled>
              {isFilter && (
                <FilterContainerStyled ref={filterContainerRef}>
                  <div>
                    <p>User selection</p>
                    <SelectInput state={userType} setState={setUserType} options={optionsUser} />
                  </div>
                  <div>
                    <p>Badge</p>
                    <SelectInput
                      isMulti={true}
                      state={badges}
                      setState={setBadges}
                      options={
                        adminBadge.isSuccess &&
                        adminBadge.data.data.map((badge) => {
                          return { value: badge.id, label: badge.name };
                        })
                      }
                    />
                  </div>
                </FilterContainerStyled>
              )}
            </FilterStyled>

            <MessageStyled>
              <MessageButtonStyled ref={mailButtonRef} onClick={() => setIsMail((prev) => !prev)}>
                Send mail <IoMailOpen />
              </MessageButtonStyled>
              {isMail && (
                <MailContainerStyled ref={mailContainerRef}>
                  <div>
                    <button>Send all</button>
                  </div>
                  {checkList.length != 0 && (
                    <div>
                      <button>Send Selected</button>
                    </div>
                  )}
                </MailContainerStyled>
              )}
            </MessageStyled>
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
            <CustomSelectInput state={totalPage} setState={setTotalPage} options={optionsPage} />
          </div>
        </Filter>
        <TableContent>
          <thead>
            <tr>
              <th>
                <InputCheckBox
                  onChange={() => {
                    if (getUserList.isSuccess) {
                      if (checkList.length == getUserList.data.data.length) {
                        setCheckList([]);
                      } else {
                        const newCheckList = [];
                        getUserList.data.data.forEach((item) => newCheckList.push(item.id));
                        setCheckList([...newCheckList]);
                      }
                    }
                  }}
                  checked={
                    getUserList.isSuccess && checkList.length == getUserList.data.data.length
                  }
                />
              </th>
              <th>EMAIL</th>
              <th>SIGN UP</th>
            </tr>
          </thead>
          <tbody>
            {getUserList.isSuccess &&
              getUserList.data.data.map((user, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <StyledCheckBox>
                        <InputCheckBox
                          checked={checkList.includes(user.id)}
                          onChange={() => {
                            if (checkList.includes(user.id)) {
                              setCheckList(checkList.filter((check) => check != user.id));
                            } else {
                              checkList.push(user.id);
                              setCheckList([...checkList]);
                            }
                          }}
                        />
                      </StyledCheckBox>
                    </td>
                    <td>
                      <UserColumn>
                        <div>
                          <Avatar round size="70" src={user.avatar} name={user.firstName} />
                        </div>
                        <div>
                          <h4>{user.email}</h4>
                          <p>
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </UserColumn>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <ActionStyled>
                        <Link to={"/admin/listing_list?host=" + user.email}>View property</Link>
                        <Link to={"/admin/booking_list?customer=" + user.email}>View booking</Link>
                        <Link to="/admin/messages" state={{ userId: user.id }}>
                          Message
                        </Link>
                      </ActionStyled>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableContent>
        <Footer>
          {getUserList.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getUserList.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {badgePopUp && <UserBadge action={() => setBadgePopUp()} />}
    </>
  );
}
