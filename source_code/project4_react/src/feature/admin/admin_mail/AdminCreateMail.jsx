import TextInput from "@/shared/components/Input/TextInput";
import styled from "styled-components";
import TextEditor from "@/shared/components/editor/TextEditor";
import Button1 from "@/shared/components/Button/Button1";
import { BsCloudUploadFill } from "react-icons/bs";
import { useEffect, useRef } from "react";
import { useState } from "react";
import XButton from "@/shared/components/Button/XButton";
import SelectInput from "@/shared/components/Input/SelectInput";
import { GetUserMailListRequest } from "./api/adminMailApi";
import { CreateNewEmailRequest } from "./api/adminMailApi";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 2rem;
  margin: 2rem;
  background-color: white;
  border-radius: 15px;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  h5 {
    color: #ea5e66;
    font-size: 14px;
  }

  .fragment {
    background-color: blue;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & label {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & label {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const ButtonContainer = styled.div`
  justify-content: flex-end;
  flex-direction: row !important;
`;

const Button1File = styled(Button1)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileNameContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse !important;
`;

const FileStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  position: relative;
`;

const XButtonStyled = styled(XButton)`
  position: absolute;
  transform: translate(10px, -3rem);
  right: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.4);
`;

const ScheduleStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CustomTextInput = styled.input`
  padding: 8px;
  width: 100%;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

const CustomTextEditor = styled(TextEditor)`
  height: 20rem;
`;

export default function AdminCreateMail() {
  const location = useLocation();
  const { getSubject, getBody, getList } = location.state || {};
  const navigate = useNavigate();
  const now = new Date();

  const [subject, setSubject] = useState(getSubject || "");
  const [body, setBody] = useState(getBody || "");
  const getUserMailList = GetUserMailListRequest();
  const [userList, setUserList] = useState(
    getList != null
      ? getList.split(",").map((item) => {
          return { label: item, value: item };
        })
      : []
  );
  const [isSchedule, setIsSchedule] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const createNewEmail = CreateNewEmailRequest();
  const [isSuccess, setIsSuccess] = useState(false);

  const onCreateNewEmail = () => {
    const formData = new FormData();
    formData.append("body", body);
    formData.append("subject", subject);
    formData.append("toList", userList.map((user) => user.value).join(","));
    formData.append("send", !isSchedule);

    if (isSchedule) {
      formData.append("sendDate", date + " " + time + ":00");
    }

    createNewEmail.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setIsSuccess(true);
        }
      },
    });
  };

  if (createNewEmail.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <Left>
          <div>
            <label>Subject</label>
            <TextInput state={subject} setState={setSubject} placeholder={"Mail subject"} />
          </div>
          <div>
            <TextEditor isMail={true} state={body} setState={setBody} />
          </div>

          <ButtonContainer>
            <Button1 onClick={onCreateNewEmail}>Send</Button1>
          </ButtonContainer>
        </Left>
        <Right>
          <div>
            <label>To</label>
            <SelectInput
              state={userList}
              setState={setUserList}
              options={
                getUserMailList.isSuccess &&
                getUserMailList.data.data.map((user) => {
                  return { label: user.email, value: user.email };
                })
              }
              isMulti
            />
          </div>
          <div>
            <label>Schedule</label>
            <ScheduleStyled>
              <InputCheckBox checked={isSchedule} onChange={() => setIsSchedule((prev) => !prev)} />{" "}
              Email scheduling
            </ScheduleStyled>
          </div>
          {isSchedule && (
            <div>
              <CustomTextInput
                min={`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`}
                value={date}
                onChange={(ev) => setDate(ev.target.value)}
                type={"date"}
              />
              <TextInput
                state={time}
                setState={(value) => {
                  if (date == `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`) {
                    const dateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    dateTime.setHours(value.split(":")[0]);
                    dateTime.setMinutes(value.split(":")[1]);

                    if (dateTime < now) {
                      alert("Can not schedule in the past");
                      setTime("");
                      return;
                    }
                  }

                  setTime(value);
                }}
                type={"time"}
              />
            </div>
          )}
        </Right>
      </Container>
      {isSuccess && (
        <SuccessPopUp
          message={"Success"}
          action={() => {
            setIsSuccess(false);
            navigate("/admin/mail_list");
          }}
        />
      )}
    </>
  );
}
