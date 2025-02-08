import BlackButton from "@/shared/components/Button/BlackButton";
import XButton from "@/shared/components/Button/XButton";
import TextInput from "@/shared/components/Input/TextInput";
import PopUp from "@/shared/components/PopUp/PopUp";
import formatDollar from "@/shared/utils/FormatDollar";
import React, { useState } from "react";
import Avatar from "react-avatar";
import styled from "styled-components";

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
`;

const UserTransactionDetail = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  > div:nth-of-type(1) {
    display: flex;
  }
  gap: 1rem;
`;

const HeaderPrice = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
`;

export default function CloseDisputeCasePopUp({ action, disputeId, query }) {
  const data = query.data.data;
  const [totalAmount, setTotalAmount] = useState(data.booking.amount);
  const [customerPrice, setCustomerPrice] = useState();
  const [hostPrice, setHostPrice] = useState();

  console.log(data);
  return (
    <PopUpStyled>
      <HeaderStyled>
        <h4>Dispute conclusion</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <HeaderPrice>
          <h3>Total: ${formatDollar(totalAmount)}</h3>
        </HeaderPrice>
        <UserTransactionDetail>
          <div>
            <div>
              <Avatar round size="70" src={data.booking.customer.avatar} />
            </div>
            <div>
              <h4>{data.booking.customer.email}</h4>
              <p>
                {data.booking.customer.firstName} {data.booking.customer.lastName}
              </p>
            </div>
          </div>
          <div>
            <TextInput state={customerPrice} setState={setCustomerPrice} />
          </div>
        </UserTransactionDetail>
        <UserTransactionDetail>
          <div>
            <div>
              <Avatar round size="70" src={data.booking.host.avatar} />
            </div>
            <div>
              <h4>{data.booking.host.email}</h4>
              <p>
                {data.booking.host.firstName} {data.booking.host.lastName}
              </p>
            </div>
          </div>
          <div>
            <TextInput state={hostPrice} setState={setHostPrice} />
          </div>
        </UserTransactionDetail>
        <div></div>
      </BodyStyled>
      <hr />
      <FooterStyled>
        <BlackButton>Close Case</BlackButton>
      </FooterStyled>
    </PopUpStyled>
  );
}
