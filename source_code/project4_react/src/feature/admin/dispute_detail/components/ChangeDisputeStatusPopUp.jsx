import XButton from "@/shared/components/Button/XButton";
import TextEditor from "@/shared/components/editor/TextEditor";
import PopUp from "@/shared/components/PopUp/PopUp";
import React, { useState } from "react";
import styled from "styled-components";
import { ChangeDisputeStatusRequest } from "../api/disputeDetailApi";

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

const BodyStyled = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterStyled = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border-radius: 5px;
  }

  > button:active {
    transform: scale(0.9);
  }

  > button:nth-of-type(2) {
    background-color: black;
    color: white;
  }
`;

export default function ChangeDisputeStatusPopUp({ action, status, disputeId, query }) {
  const [resolution, setResolution] = useState("");
  const changeDisputeStatus = ChangeDisputeStatusRequest();

  const onChangeStatus = () => {
    const formData = new FormData();
    formData.append("disputeId", disputeId);
    formData.append("resolution", resolution);
    formData.append("status", status);

    changeDisputeStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          query.refetch();
          action();
        }
      },
    });
  };

  return (
    <PopUpStyled>
      <HeaderStyled>
        <h4>Booking detail</h4>
        <XButton action={action} />
      </HeaderStyled>
      <BodyStyled>
        <TextEditor state={resolution} setState={setResolution} />
      </BodyStyled>
      <FooterStyled>
        <button onClick={onChangeStatus}>{status}</button>
      </FooterStyled>
    </PopUpStyled>
  );
}
