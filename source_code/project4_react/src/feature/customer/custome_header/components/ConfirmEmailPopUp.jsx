import styled from "styled-components";
import { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import VerificationInput from "react-verification-input";
import { CreateAuthenticationCodeRequest } from "../api/loginSignUpApi";
import { RegisterRequest } from "../api/loginSignUpApi";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import { useEffect } from "react";

const PopUpContainer = styled(PopUp)`
  width: 33rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-radius: 10px;

  & .error {
    color: red;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 2rem;

  h4 {
    font-size: 17px;
  }

  & svg {
    width: 20px;
  }
`;

const Body = styled.form`
  padding: 10px 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  max-height: 80vh;
  overflow: auto;

  > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  p {
    font-size: 16px;
  }

  & button {
    background-color: white;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    font-weight: 600;
  }
`;

export default function ConfirmEmailPopUp({
  action,
  email,
  firstName,
  lastName,
  password,
  dob,
  offPopUp,
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [code, setCode] = useState("");
  const createAuthenticationCode = CreateAuthenticationCodeRequest();
  const register = RegisterRequest();

  const onResend = (ev) => {
    ev.preventDefault();
    const formData = new FormData();

    formData.append("email", email);

    createAuthenticationCode.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          alert("success");
        }
      },
    });
  };

  useEffect(() => {
    if (code.length == 6) {
      onFinish();
    }
  }, [code]);

  const onFinish = () => {
    if (code.length == 6) {
      const formData = new FormData();
      const dobDate = new Date(dob);

      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("code", code);
      formData.append(
        "dob",
        `${dobDate.getFullYear()}-${dobDate.getMonth() + 1}-${dobDate.getDate()}`
      );

      register.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            setSuccess(true);
          }

          if (response.status == 403) {
            setError(response.message);
          }
        },
      });
    }
  };

  return (
    <>
      <PopUpContainer>
        <Header>
          <XButton action={action} />
          <h4>Log in or sign up</h4>
          <span></span>
        </Header>
        <hr />
        <Body>
          <div>
            <h2>Enter your verification code</h2>
            <p>Enter the code we emailed to {email}</p>
          </div>
          <VerificationInput
            length={6}
            value={code}
            onChange={setCode}
            validChars="a-zA-Z0-9!@#\$%\^\&*\)\(+=._-"
            classNames={{
              container: "container",
              character: "character",
              characterInactive: "character--inactive",
              characterSelected: "character--selected",
              characterFilled: "character--filled",
            }}
          />
          <p>
            Didn't get an email?<button onClick={onResend}>Try again</button>
          </p>
        </Body>
      </PopUpContainer>
      {error && <ErrorPopUp action={() => setError("")} message={error} />}
      {success && (
        <SuccessPopUp
          action={() => {
            setSuccess(false);
            action();
            offPopUp();
          }}
          message={"Successfully register, please login to your account"}
        />
      )}
    </>
  );
}
