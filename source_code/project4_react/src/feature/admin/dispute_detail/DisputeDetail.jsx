import styled, { css } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { ChangeDisputeStatusRequest, GetDisputeDetailRequest } from "./api/disputeDetailApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import Avatar from "react-avatar";
import dchc from "@/shared/data/dchc";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import moment from "moment";
import formatDollar from "@/shared/utils/FormatDollar";
import { Tooltip } from "react-tooltip";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import RedButton from "@/shared/components/Button/RedButton1";
import ChangeDisputeStatusPopUp from "./components/ChangeDisputeStatusPopUp";
import BlackButton from "@/shared/components/Button/BlackButton";
import NewDisputeDetailPopUp from "./components/NewDisputeDetailPopUp";
import CloseDisputeCasePopUp from "./components/CloseDisputeCasePopUp";

const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const InfoContainer = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 2rem;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border-radius: 10px;
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

const PropertyButtonDetail = styled.button`
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

const PropertyStyled = styled.div`
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

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
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

const RefundStyled = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 18px;
  text-decoration: underline;
`;

const PersonStyled = styled.div`
  font-size: 18px;
  text-decoration: underline;
`;

const TypeStyled = styled.div`
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

const Left = styled.div``;

const Right = styled.div`
  position: relative;
`;

const InitialReport = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 2rem;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border-radius: 10px;
`;

const DisputeDetailStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 2rem;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  border-radius: 10px;
`;

const ReportReason = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 15px;
  min-height: 10rem;
  max-height: 20rem;
  overflow: auto;
`;

const ImageContainerStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 9rem;
  gap: 10px;

  > div:nth-of-type(1) {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  > div {
    border: 1px dotted rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const RightContainerStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 15px;
  width: 19rem;
  background-color: white;
  padding: 2rem 0;
  margin: 2rem 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Dicision = styled.div`
  padding: 2rem;
  margin: 2rem;

  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  & button {
    background-color: white;
    cursor: pointer;
    padding: 10px 1rem;
    border-radius: 15px;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const BodyStyled = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonContainerStyled = styled.div`
  justify-content: flex-end !important;
  gap: 1rem;
`;

export default function DisputeDetail() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [isChangeStatus, setIsChangeStatus] = useState(false);
  const [isNewDetail, setIsNewDetail] = useState(false);
  const [closeCasePopUp, setCloseCasePopUp] = useState(false);

  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const getDisputeDetail = GetDisputeDetailRequest(id);
  const [bookingDetail, setBookingDetail] = useState(false);
  const [onInitialReport, setOnInitialReport] = useState(false);
  const [disputeDetailStatusList, setDisputeDetailStatusList] = useState([]);

  const rightRef = useRef();

  useEffect(() => {
    const obj = {
      status: true,
      customer: false,
      host: false,
      adminNote: false,
    };

    if (getDisputeDetail.isSuccess) {
      setDisputeDetailStatusList(
        Array(getDisputeDetail.data.data.bookingDisputeDetails.length).fill({ ...obj })
      );
    }
  }, [getDisputeDetail.fetchStatus]);

  useEffect(() => {
    const event = () => {
      if (window.scrollY > 150) {
        rightRef.current.style.position = "fixed";
        rightRef.current.style.top = "0";
      } else {
        rightRef.current.style.position = "relative";
      }
    };

    document.addEventListener("scroll", event);

    return () => {
      document.removeEventListener("scroll", event);
    };
  }, []);

  useEffect(() => {
    if (getDisputeDetail.isSuccess) {
      const province = dchc.data.find(
        (dchcProvince) =>
          dchcProvince.level1_id == onGetData().booking.property.addressCode.split("_")[0]
      );
      const district = province.level2s.find(
        (dchcDistrict) =>
          dchcDistrict.level2_id == onGetData().booking.property.addressCode.split("_")[1]
      );

      setProvince(province);
      setDistrict(district);
    }
  }, [getDisputeDetail.isSuccess]);

  if (getDisputeDetail.isLoading) {
    return <WaitingPopUp />;
  }

  const onGetData = () => {
    return getDisputeDetail.data.data;
  };

  return (
    <>
      <Container>
        <Left>
          <InfoContainer>
            <HeaderStyled onClick={() => setBookingDetail((prev) => !prev)}>
              <h4>Booking information</h4>{" "}
              {bookingDetail ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
            </HeaderStyled>
            {bookingDetail && (
              <>
                <UserStyled>
                  <div>
                    <div>
                      <Avatar
                        size={70}
                        src={onGetData().booking.customer.avatar}
                        name={onGetData().booking.customer.firstName}
                        round
                      />
                    </div>
                    <div>
                      <h4>Customer</h4>
                      <h3>
                        {onGetData().booking.customer.firstName}{" "}
                        {onGetData().booking.customer.lastName}
                      </h3>
                      <p>{onGetData().booking.customer.email}</p>
                    </div>
                  </div>
                  <SendMessageButtonStyled
                    onClick={() =>
                      navigate("/admin/messages", {
                        state: { userId: onGetData().booking.customer.id },
                      })
                    }
                  >
                    Send message
                  </SendMessageButtonStyled>
                </UserStyled>

                <UserStyled>
                  <div>
                    <div>
                      <Avatar
                        size={70}
                        src={onGetData().booking.host.avatar}
                        name={onGetData().booking.host.firstName}
                        round
                      />
                    </div>
                    <div>
                      <h4>Host</h4>
                      <h3>
                        {onGetData().booking.host.firstName} {onGetData().booking.host.lastName}
                      </h3>
                      <p>{onGetData().booking.host.email}</p>
                    </div>
                  </div>
                  <SendMessageButtonStyled
                    onClick={() =>
                      navigate("/admin/messages", {
                        state: { userId: onGetData().booking.host.id },
                      })
                    }
                  >
                    Send message
                  </SendMessageButtonStyled>
                </UserStyled>

                <PropertyStyled>
                  <div>
                    <div>
                      <Avatar
                        src={onGetData().booking.property.propertyImages[0]}
                        round={10}
                        size="70"
                      />
                    </div>
                    <div>
                      <h3
                        onClick={() =>
                          navigate("/become_a_host/" + onGetData().booking.property.id)
                        }
                      >
                        {onGetData().booking.property.propertyTitle}
                      </h3>
                      <p>
                        {district?.name}, {province?.name}
                      </p>
                    </div>
                  </div>
                  <PropertyButtonDetail>Detail</PropertyButtonDetail>
                </PropertyStyled>

                <PriceStyled>
                  <p data-tooltip-id={"book_detail"}>
                    {formatDate(onGetData().booking.checkInDay)} -{" "}
                    {formatDate(
                      moment(onGetData().booking.checkOutDay)
                        .subtract(1, "days")
                        .format("YYYY-MM-DD")
                    )}{" "}
                    ({onGetData().booking.bookDateDetails.length} nights)
                  </p>
                  <p>$ {formatDollar(onGetData().booking.hostFee)}</p>
                  <Tooltip
                    style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
                    id={"book_detail"}
                    clickable
                  >
                    {onGetData().booking.bookDateDetails.map((detail, index) => (
                      <DetailStyled key={index}>
                        <p>{formatDate(detail.night)}</p>
                        <p>$ {formatDollar(detail.price)}</p>
                      </DetailStyled>
                    ))}
                  </Tooltip>
                </PriceStyled>
                <RefundStyled>
                  <p>Refund policy</p>
                  <p data-tooltip-id={"refund"}>{onGetData().booking.refundPolicy.policyName}</p>
                  <Tooltip
                    style={{ backgroundColor: "#2c3e50", borderRadius: "25px" }}
                    id={"refund"}
                    clickable
                  >
                    {onGetData().booking.refundPolicy.policyDescription}
                  </Tooltip>
                </RefundStyled>
                <PersonStyled>
                  <p>
                    {" "}
                    {onGetData().booking.adult} adults
                    {onGetData().booking.children
                      ? ", " + onGetData().booking.children + " children."
                      : "."}
                  </p>
                </PersonStyled>
                <TypeStyled>
                  <p>
                    {onGetData().booking.bookingType == "instant" ? "Instant" : "Reserved"} book
                  </p>
                </TypeStyled>
                {/* {onGetData().booking.selfCheckInInstruction && (
                  <RuleAndInstruction>
                    <p>Self checkin instruction</p>
                    <button onClick={() => setIsShowInstruction(booking)}>Detail</button>
                  </RuleAndInstruction>
                )} */}
              </>
            )}
          </InfoContainer>
          <InitialReport>
            <HeaderStyled onClick={() => setOnInitialReport((prev) => !prev)}>
              <h4>Customer report</h4>{" "}
              {onInitialReport ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
            </HeaderStyled>

            {onInitialReport && (
              <>
                <ReportReason>
                  <div dangerouslySetInnerHTML={{ __html: onGetData().reason }} />
                </ReportReason>
                <ImageContainerStyled $length={onGetData().images.split(",").length}>
                  {onGetData()
                    .images.split(",")
                    .map((image, index) => (
                      <div key={index}>
                        <img src={image} />
                      </div>
                    ))}
                </ImageContainerStyled>
              </>
            )}
          </InitialReport>
          {onGetData().status == "PENDING" && (
            <Dicision>
              <button onClick={() => setIsChangeStatus("IGNORE")}>No action</button>
              <button onClick={() => setIsChangeStatus("PROGRESS")}>Accept</button>
            </Dicision>
          )}

          {onGetData().bookingDisputeDetails.length > 0 &&
            onGetData().bookingDisputeDetails.map((detail, index) => {
              return (
                <DisputeDetailStyled key={index}>
                  <HeaderStyled
                    onClick={() =>
                      setDisputeDetailStatusList((prev) => {
                        const updatedList = [...prev];

                        updatedList[index] = {
                          ...updatedList[index],
                          status: !updatedList[index].status,
                        };

                        return updatedList;
                      })
                    }
                  >
                    <h4>
                      <Avatar
                        src={detail.admin.avatar}
                        name={detail.admin.firstName}
                        round
                        size="40"
                      />{" "}
                      New detail from {moment(detail.createdAt).format("YYYY-MM-DD hh:mm:a")}{" "}
                    </h4>{" "}
                    {disputeDetailStatusList[index]?.status ? (
                      <RiArrowRightSLine />
                    ) : (
                      <RiArrowDownSLine />
                    )}
                  </HeaderStyled>
                  <BodyStyled>
                    {disputeDetailStatusList[index]?.status && (
                      <>
                        <Header
                          onClick={() =>
                            setDisputeDetailStatusList((prev) => {
                              const updatedList = [...prev];

                              updatedList[index] = {
                                ...updatedList[index],
                                customer: !updatedList[index].customer,
                              };

                              return updatedList;
                            })
                          }
                        >
                          <Avatar
                            src={onGetData().booking.customer.avatar}
                            name={onGetData().booking.customer.firstName}
                            round
                            size="30"
                          />
                          <h4>Customer reason</h4>
                          {disputeDetailStatusList[index].customer ? (
                            <RiArrowRightSLine />
                          ) : (
                            <RiArrowDownSLine />
                          )}
                        </Header>
                        <hr />
                        {disputeDetailStatusList[index].customer && (
                          <>
                            <ReportReason>
                              <div dangerouslySetInnerHTML={{ __html: detail.customerReason }} />
                            </ReportReason>
                            <ImageContainerStyled $length={detail.customerImages.split(",").length}>
                              {detail.customerImages.split(",").map((image, index) => (
                                <div key={index}>
                                  <img src={image} />
                                </div>
                              ))}
                            </ImageContainerStyled>
                          </>
                        )}

                        <Header
                          onClick={() =>
                            setDisputeDetailStatusList((prev) => {
                              const updatedList = [...prev];

                              updatedList[index] = {
                                ...updatedList[index],
                                host: !updatedList[index].host,
                              };

                              return updatedList;
                            })
                          }
                        >
                          <Avatar
                            src={onGetData().booking.host.avatar}
                            name={onGetData().booking.host.firstName}
                            round
                            size="30"
                          />
                          <h4>Host reason</h4>
                          {disputeDetailStatusList[index].customer ? (
                            <RiArrowRightSLine />
                          ) : (
                            <RiArrowDownSLine />
                          )}
                        </Header>
                        <hr />
                        {disputeDetailStatusList[index].host && (
                          <>
                            <ReportReason>
                              <div dangerouslySetInnerHTML={{ __html: detail.hostReason }} />
                            </ReportReason>
                            <ImageContainerStyled $length={detail.customerImages.split(",").length}>
                              {detail.hostImages.split(",").map((image, index) => (
                                <div key={index}>
                                  <img src={image} />
                                </div>
                              ))}
                            </ImageContainerStyled>
                          </>
                        )}

                        <Header
                          onClick={() =>
                            setDisputeDetailStatusList((prev) => {
                              const updatedList = [...prev];

                              updatedList[index] = {
                                ...updatedList[index],
                                adminNote: !updatedList[index].adminNote,
                              };

                              return updatedList;
                            })
                          }
                        >
                          <h4>Admin note</h4>
                          {disputeDetailStatusList[index].adminNote ? (
                            <RiArrowRightSLine />
                          ) : (
                            <RiArrowDownSLine />
                          )}
                        </Header>
                        {disputeDetailStatusList[index].adminNote && (
                          <>
                            <ReportReason>
                              <div dangerouslySetInnerHTML={{ __html: detail.adminNote }} />
                            </ReportReason>
                            <div></div>
                          </>
                        )}
                      </>
                    )}
                  </BodyStyled>
                </DisputeDetailStyled>
              );
            })}
        </Left>
        <Right>
          <RightContainerStyled ref={rightRef}>
            <div>
              <h4>{moment(onGetData().createdAt).format("YYYY-MM-DD hh:mm:a")}</h4>
              <p>Report day</p>
            </div>

            {onGetData().status == "IGNORE" && (
              <div>
                <h4>{moment(onGetData().updatedAt).format("YYYY-MM-DD hh:mm:a")}</h4>
                <p>Ignore</p>
              </div>
            )}

            {onGetData().acceptedAt && (
              <div>
                <h4>{moment(onGetData().acceptedAt).format("YYYY-MM-DD hh:mm:a")}</h4>
                <p>Accept</p>
              </div>
            )}

            {onGetData().bookingDisputeDetails.length > 0 &&
              onGetData().bookingDisputeDetails.map((detail, index) => {
                return (
                  <div key={index}>
                    <h4>{moment(detail.createdAt).format("YYYY-MM-DD hh:mm:a")}</h4>
                    <p>New detail</p>
                  </div>
                );
              })}

            <hr />

            {onGetData().status == "PROGRESS" && (
              <ButtonContainerStyled>
                <BlackButton onClick={() => setIsNewDetail(true)}>New detail</BlackButton>
                <BlackButton onClick={() => setCloseCasePopUp(true)}>Close</BlackButton>
              </ButtonContainerStyled>
            )}
          </RightContainerStyled>
        </Right>
      </Container>
      {isChangeStatus && (
        <ChangeDisputeStatusPopUp
          query={getDisputeDetail}
          disputeId={onGetData().id}
          status={isChangeStatus}
          action={() => setIsChangeStatus()}
        />
      )}
      {isNewDetail && (
        <NewDisputeDetailPopUp
          disputeId={onGetData().id}
          query={getDisputeDetail}
          action={() => setIsNewDetail()}
        />
      )}
      {closeCasePopUp && (
        <CloseDisputeCasePopUp
          action={() => setCloseCasePopUp()}
          disputeId={onGetData().id}
          query={getDisputeDetail}
        />
      )}
    </>
  );
}
