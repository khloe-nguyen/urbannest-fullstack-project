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
import { UserRequest } from "@/shared/api/userApi";
import moment from "moment";
import WhiteButton from "@/shared/components/Button/WhiteButton";
import { MdOutlineReportProblem } from "react-icons/md";
import ReportBooking from "./ReportBooking";
import { CancelReservationRequest, UpdateRefundForBookingMutation } from "../api/customerTripApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  max-width: 40rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  & h3 {
    font-size: 17px;
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
  max-height: 40rem;
  overflow: auto;
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
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  & button {
    display: flex;
    align-items: center;
    gap: 10px;

    background-color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }

  > div {
    display: flex;
    gap: 1rem;
    align-items: center;
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

export default function TripDetail({ action, booking }) {
  const navigate = useNavigate();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const user = UserRequest();
  const [isShowInstruction, setIsShowInstruction] = useState();
  const [reportBooking, setReportBooking] = useState();
  const queryClient = useQueryClient();

  const updateRefundForBookingMutation = UpdateRefundForBookingMutation();
  const cancelReservation = CancelReservationRequest();

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

  const checkIfModerateRefundable = (type, checkIn) => {
    if (new Date(checkIn).getTime() - new Date().getTime() > 604800000) {
      return true;
    }
  };

  const checkIfFlexibleRefundable = (type, checkIn) => {
    if (new Date(checkIn).getTime() - new Date().getTime() > 172800000) {
      return true;
    }
  };

  const returnTimeRefundable = (checkIn, day) => {
    let miliTotal = day * 1000 * 60 * 60 * 24;

    return new Date(new Date(checkIn).getTime() - miliTotal);
  };

  const showCheckInInstruction = (checkIn) => {
    const checkInDate = new Date(checkIn);
    checkInDate.setHours(0, 0, 0);
    const showInstructionDate = checkInDate.getTime() - 172800000;

    if (new Date().getTime() > showInstructionDate) {
      return true;
    }
    return false;
  };

  const checkIfReportable = (checkIn) => {
    const checkInDate = new Date(checkIn);
    const now = new Date();

    if (
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
        new Date(
          checkInDate.getFullYear(),
          checkInDate.getMonth(),
          checkInDate.getDate()
        ).getTime() >
      172800000
    ) {
      return false;
    }

    return true;
  };

  const postUpdateRefundForBooking = (bookingId) => {
    const formData = new FormData();
    formData.append("bookingId", bookingId);
    updateRefundForBookingMutation.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          queryClient.invalidateQueries({ queryKey: ["trips"] });
          queryClient.invalidateQueries({ queryKey: ["user_refund"] });
          action();
        }
      },
    });
  };

  const onCancelReservation = (bookingId) => {
    const formData = new FormData();
    formData.append("reservationId", bookingId);
    cancelReservation.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          queryClient.invalidateQueries({ queryKey: ["reserved_count"] });
          queryClient.invalidateQueries({ queryKey: ["trips_reserved"] });
          action();
        }
      },
    });
  };

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
                <Avatar size={70} src={booking.host.avatar} name={booking.host.firstName} round />
              </div>
              <div>
                <h3>
                  {booking.host.firstName} {booking.host.lastName}
                </h3>
                <p>{booking.host.email}</p>
              </div>
            </div>
            <SendMessageButtonStyled
              onClick={() =>
                navigate("/hosting/host_messages", {
                  state: { userId: booking.host.id },
                })
              }
            >
              Send message
            </SendMessageButtonStyled>
          </UserStyled>
          <hr />
          <PropertyStyled>
            <div>
              <div>
                <Avatar src={booking.property.propertyImages[0]} round={10} size="70" />
              </div>
              <div>
                <h3 onClick={() => navigate("/property_detail/" + booking.property.id)}>
                  {booking.property.propertyTitle}
                </h3>
                <p>
                  {district?.name}, {province?.name}
                </p>
              </div>
            </div>
            {/* {checkIfReportable(booking.checkInDay) && (
              <button onClick={() => setReportBooking(booking)}>
                Report <MdOutlineReportProblem />{" "}
              </button>
            )} */}
          </PropertyStyled>
          <PriceStyled>
            <p data-tooltip-id={"book_detail"}>
              {formatDate(booking.checkInDay)} - {formatDate(booking.checkOutDay)} (
              {booking.bookDateDetails.length} nights)
            </p>
            <p>$ {formatDollar(booking.amount)}</p>
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
              {booking.adult} adults
              {booking.children ? ", " + booking.children + " children." : "."}
            </p>
          </PersonStyled>
          <TypeStyled>
            <p>{booking.bookingType == "instant" ? "Instant" : "Reserved"} book</p>
          </TypeStyled>
          <RuleAndInstruction>
            <p>Rules and instructions</p>
            <p data-tooltip-id={"instruction"}>Detail</p>
            <Tooltip
              style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
              id={"instruction"}
              clickable
            >
              <>
                {booking.selfCheckIn && (
                  <p>
                    Self check in
                    {booking.selfCheckInType ? " with " + booking.selfCheckInType : "."}
                  </p>
                )}
                {booking.property.smokingAllowed ? <p>No smoking</p> : <p>Smoking allowed</p>}
                {booking.property.petAllowed ? <p>No pet</p> : <p>Pet allowed</p>}
                <p>Maximum guest is {booking.property.maximumGuest}</p>
              </>
            </Tooltip>
          </RuleAndInstruction>
          {booking.status == "ACCEPT" &&
            booking.selfCheckInInstruction &&
            showCheckInInstruction(booking.checkInDay) && (
              <RuleAndInstruction>
                <p>Self checkin instruction</p>
                <button onClick={() => setIsShowInstruction(booking.selfCheckInInstruction)}>
                  Detail
                </button>
              </RuleAndInstruction>
            )}

          {booking.status == "ACCEPT" && (
            <>
              {booking.refundPolicy.policyName == "Moderate" &&
                booking.status == "ACCEPT" &&
                checkIfModerateRefundable(booking.refundPolicy.policyName, booking.checkInDay) && (
                  <>
                    <hr />
                    <h3>Cancellation policy</h3>
                    <p>
                      Cancel before{" "}
                      {moment(returnTimeRefundable(booking.checkInDay, 5)).format("HH:mm")} on{" "}
                      {moment(returnTimeRefundable(booking.checkInDay, 7)).format("DD MMM")} for a
                      full refund. After that, the reservation is non-refunable
                    </p>
                    <RedButton onClick={() => postUpdateRefundForBooking(booking.id)}>
                      Refund
                    </RedButton>
                  </>
                )}

              {booking.refundPolicy.policyName == "Flexible" &&
                booking.status == "ACCEPT" &&
                checkIfFlexibleRefundable(booking.refundPolicy.policyName, booking.checkInDay) && (
                  <>
                    <hr />
                    <h3>Cancellation policy</h3>
                    <p>
                      Cancel before{" "}
                      {moment(returnTimeRefundable(booking.checkInDay, 5)).format("HH:mm")} on{" "}
                      {moment(returnTimeRefundable(booking.checkInDay, 5)).format("DD MMM")} for a
                      full refund or before{" "}
                      {returnTimeRefundable(booking.checkInDay, 7)
                        .toTimeString()
                        .split(" ")[0]
                        .substring(0, 5)}{" "}
                      on {moment(returnTimeRefundable(booking.checkInDay, 2)).format("DD MMM")} for
                      a 50% refund. After that, the reservation is non-refunable
                    </p>
                    <RedButton onClick={() => postUpdateRefundForBooking(booking.id)}>
                      Refund
                    </RedButton>
                  </>
                )}
            </>
          )}

          {booking.status == "PENDING" && (
            <>
              <hr />
              <RedButton onClick={() => onCancelReservation(booking.id)}>
                Cancel reservation
              </RedButton>
            </>
          )}
        </BodyStyled>
      </PopUpStyled>
      {isShowInstruction && (
        <SelfCheckInInstruction
          action={() => setIsShowInstruction()}
          instruction={isShowInstruction}
        />
      )}
      {reportBooking && <ReportBooking action={() => setReportBooking()} booking={reportBooking} />}
    </>
  );
}

const SelfCheckIntContainer = styled.div`
  padding: 1rem;
`;

function SelfCheckInInstruction({ action, instruction }) {
  return (
    <PopUpStyled action={action}>
      <SelfCheckIntContainer>
        <div dangerouslySetInnerHTML={{ __html: instruction }} />
      </SelfCheckIntContainer>
    </PopUpStyled>
  );
}
