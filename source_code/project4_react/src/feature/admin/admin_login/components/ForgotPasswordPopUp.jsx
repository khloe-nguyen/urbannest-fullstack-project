import styled from "styled-components";
import { useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import TextInput from "@/shared/components/Input/TextInput";
import XButton from "@/shared/components/Button/XButton";
import BlackButton from "@/shared/components/Button/BlackButton";
import { ForgotPasswordRequest } from "../api/adminLoginApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  max-width: 40rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const BodyStyled = styled.div`
  background-color: white;
  margin: 2rem;

  border-radius: 15px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function ForgotPasswordPopUp({ action }) {
  const [email, setEmail] = useState("");
  const forgotPassword = ForgotPasswordRequest();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = () => {
    if (!email) {
      alert("Please fill email");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);

    forgotPassword.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          setIsSuccess(true);
        } else {
          alert(response.message);
        }
      },
    });
  };

  return (
    <>
      <PopUpStyled action={() => {}}>
        <HeaderStyled>
          <h4>Forgot password</h4>
          <XButton action={action} />
        </HeaderStyled>
        <hr />
        <BodyStyled>
          <div>
            <h4>Email</h4>
            <br />
            <TextInput state={email} setState={setEmail} />
          </div>
        </BodyStyled>
        <hr />
        <FooterStyled>
          <BlackButton onClick={onSubmit}>Send request</BlackButton>
        </FooterStyled>
      </PopUpStyled>
      {isSuccess && (
        <SuccessPopUp
          action={() => {
            setIsSuccess(false);
            action();
          }}
          message={"Please check your email and wait for admin response"}
        />
      )}
    </>
  );
}
