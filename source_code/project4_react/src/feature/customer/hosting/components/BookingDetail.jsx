import styled from "styled-components";
import { useEffect, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import Avatar from "react-avatar";
import dchc from "@/shared/data/dchc";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { Tooltip } from "react-tooltip";
import RedButton from "@/shared/components/Button/RedButton1";
import { useNavigate } from "react-router-dom";
import formatDollar from "@/shared/utils/FormatDollar";
import moment from "moment";
import { UserRequest } from "@/shared/api/userApi";
import TextEditor from "@/shared/components/editor/TextEditor";
import { ChangeBookingInstructionRequest } from "../api/hostingApi";

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

const UserStyled = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
    gap: 1rem;

    > div:nth-of-type(2) {
      display: flex;
      flex-direction: column;

      h3 {
        cursor: pointer;
      }

      p {
        color: rgba(0, 0, 0, 0.7);
      }
    }

    > div:nth-of-type(2):hover {
      text-decoration: underline;
    }
  }
`;

const PropertyStyled = styled.div`
  display: flex;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;

    h3 {
      cursor: pointer;
    }

    p {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const PriceStyled = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 20rem 1fr;

  text-decoration: underline;
  font-size: 18px;

  > p:nth-of-type(1) {
    cursor: pointer;
  }

  > p:nth-of-type(2) {
    text-align: right;
  }
`;

const PersonStyled = styled.div`
  font-size: 18px;
  text-decoration: underline;
`;

const TypeStyled = styled.div`
  font-size: 18px;
  text-decoration: underline;
`;

const RefundStyled = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 18px;
  text-decoration: underline;
`;

const DetailStyled = styled.div`
  display: flex;
  width: 20rem;
  justify-content: space-between;
  padding: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const SendMessageButtonStyled = styled.button`
  align-self: center;
  padding: 0;
  background-color: white;
  padding: 10px 1rem;
  border-radius: 25px;
  cursor: pointer;

  &:active {
    transform: scale(0.9);
  }
`;

const RuleAndInstruction = styled.div`
  font-size: 18px;

  & p {
    text-decoration: underline;
  }

  display: flex;
  justify-content: space-between;

  & button {
    background-color: black;
    color: white;
    cursor: pointer;
    border-radius: 25px;
    padding: 4px 1rem;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

export default function BookingDetail({ action, booking, bookingsFetch }) {
  const navigate = useNavigate();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [isShowInstruction, setIsShowInstruction] = useState();

  useEffect(() => {
    const province = dchc.data.find(
      (dchcProvince) => dchcProvince.level1_id == booking.property.addressCode.split("_")[0]
    );
    const district = province.level2s.find(
      (dchcDistrict) => dchcDistrict.level2_id == booking.property.addressCode.split("_")[1]
    );

    setProvince(province);
    setDistrict(district);
  }, []);

  return (
    <>
      <PopUpStyled>
        <HeaderStyled>
          <h4>Booking detail</h4>
          <XButton action={action} />
        </HeaderStyled>
        <hr />
        <BodyStyled>
          <UserStyled>
            <div>
              <div>
                <Avatar
                  size={70}
                  src={booking.customer.avatar}
                  name={booking.customer.firstName}
                  round
                />
              </div>
              <div>
                <h3>
                  {booking.customer.firstName} {booking.customer.lastName}
                </h3>
                <p>{booking.customer.email}</p>
              </div>
            </div>
            <SendMessageButtonStyled
              onClick={() =>
                navigate("/hosting/host_messages", {
                  state: { userId: booking.customer.id },
                })
              }
            >
              Send message
            </SendMessageButtonStyled>
          </UserStyled>
          <hr />
          <PropertyStyled>
            <div>
              <Avatar src={booking.property.propertyImages[0]} round={10} size="70" />
            </div>
            <div>
              <h3 onClick={() => navigate("/become_a_host/" + booking.property.id)}>
                {booking.property.propertyTitle}
              </h3>
              <p>
                {district?.name}, {province?.name}
              </p>
            </div>
          </PropertyStyled>
          <PriceStyled>
            <p data-tooltip-id={"book_detail"}>
              {formatDate(booking.checkInDay)} -{" "}
              {formatDate(moment(booking.checkOutDay).subtract(1, "days").format("YYYY-MM-DD"))} (
              {booking.bookDateDetails.length} nights)
            </p>
            <p>$ {formatDollar(booking.hostFee)}</p>
            <Tooltip
              style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
              id={"book_detail"}
              clickable
            >
              {booking.bookDateDetails.map((detail, index) => (
                <DetailStyled key={index}>
                  <p>{formatDate(detail.night)}</p>
                  <p>$ {formatDollar(detail.price)}</p>
                </DetailStyled>
              ))}
            </Tooltip>
          </PriceStyled>
          <RefundStyled>
            <p>Refund policy</p>
            <p data-tooltip-id={"refund"}>{booking.refundPolicy.policyName}</p>
            <Tooltip
              style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
              id={"refund"}
              clickable
            >
              {booking.refundPolicy.policyDescription}
            </Tooltip>
          </RefundStyled>
          <PersonStyled>
            <p>
              {" "}
              {booking.adult} adults
              {booking.children ? ", " + booking.children + " children." : "."}
            </p>
          </PersonStyled>
          <TypeStyled>
            <p>{booking.bookingType == "instant" ? "Instant" : "Reserved"} book</p>
          </TypeStyled>
          {booking.selfCheckInInstruction && (
            <RuleAndInstruction>
              <p>Self checkin instruction</p>
              <button onClick={() => setIsShowInstruction(booking)}>Detail</button>
            </RuleAndInstruction>
          )}
        </BodyStyled>
      </PopUpStyled>
      {isShowInstruction && (
        <SelfCheckInInstruction
          bookingsFetch={bookingsFetch}
          action={() => setIsShowInstruction()}
          booking={isShowInstruction}
        />
      )}
    </>
  );
}

const FooterEditor = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1rem;
  gap: 1rem;

  & button {
    padding: 10px 20px;
    color: white;
    background-color: black;
    border-radius: 15px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const PopUpContainer = styled.div`
  padding: 2rem;
`;

function SelfCheckInInstruction({ action, booking, bookingsFetch }) {
  const changeBookingInstruction = ChangeBookingInstructionRequest();
  const [instruction, setInstruction] = useState(booking.selfCheckInInstruction);

  const editInInstruction = (checkIn) => {
    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0);
    const showInstructionDate = checkInDate.getTime() - 172800000;

    if (new Date().getTime() > showInstructionDate) {
      return false;
    }
    return true;
  };

  const onChangeInstruction = () => {
    if (!instruction) {
      alert("Instruction cannot be empty");
    }
    const formData = new FormData();

    formData.append("bookingId", booking.id);
    formData.append("instruction", instruction);

    changeBookingInstruction.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          bookingsFetch.refetch();
          action();
          booking.selfCheckInInstruction = instruction;
        }
      },
    });
  };

  return (
    <PopUpStyled action={action}>
      <PopUpContainer>
        {editInInstruction(booking.checkInDay) ? (
          <div>
            <div>
              <TextEditor setState={setInstruction} state={instruction} />
              <FooterEditor>
                <button onClick={onChangeInstruction}>Edit</button>
                <button onClick={action}>Cancel</button>
              </FooterEditor>
            </div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: instruction }} />
        )}
      </PopUpContainer>
    </PopUpStyled>
  );
}
