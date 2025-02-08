import { useEffect, useState } from "react";
import styled from "styled-components";
import { GetPolicies } from "../api/api";
import { FaChevronRight, FaSmoking, FaSmokingBan } from "react-icons/fa";
import PopUpContainer from "@/shared/components/PopUp/giu/PopUpContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { RiDoorOpenLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { MdOutlinePets } from "react-icons/md";

const StyledHeader = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 4rem 0 1rem 0;
`;
const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
`;
const StyledBlock = styled.div`
  line-height: 2.5;
  & > div:first-child {
    font-size: 18px;
    font-weight: bold;
  }
`;
const StyledShowMore = styled.div`
  display: flex;
  justify-content: stretch;
  column-gap: 4px;
  align-items: center;
  font-weight: 600;
  cursor: pointer;

  & > div:first-child {
    text-decoration: 1px underline;
  }
`;
const StyledPopup = styled(PopUpContainer)`
  top: 0;
  left: 0;
  width: 800px;
  height: 38rem;
  transform: translate(50%, 4rem);
  overflow-y: scroll;
`;
const StyledPopupContainer = styled.div`
  padding: 2rem;
`;
const Styledbutton = styled.button`
  width: 40px;
  height: 40px;
  margin: 1rem;
  border: none;
  border-radius: 50%;
`;
const StyledPopupContent = styled.div`
  > div:first-child {
    font-size: 2.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;
const StyledCheckDuring = styled.div`
  & > div:first-child {
    margin: 2rem 0;
    font-size: 24px;
    font-weight: 600;
  }
`;
const StyledFlex = styled.div`
  display: flex;
  justify-content: stretch;
  column-gap: 1rem;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 18px;
`;
export default function RulePolicy({ data }) {
  const policies = GetPolicies();
  const [policy, setPolicy] = useState("");
  const [showRules, setShowRule] = useState(false);

  useEffect(() => {
    if (policies.isSuccess) {
      const listPolicies = policies.data.data;
      for (let index = 0; index < listPolicies.length; index++) {
        if (listPolicies[index].id == data.refundPolicyId) {
          return setPolicy(listPolicies[index].policyDescription);
        }
      }
    }
  }, [policies, data]);
  return (
    <div>
      <StyledHeader>Things to know</StyledHeader>
      <StyledContainer>
        <StyledBlock>
          <div>House rules</div>
          <div>Check-in after: {data.checkInAfter} PM</div>
          <div>Check-out before: {data.checkOutBefore} PM</div>
          <div>{data.maximumGuest} guests maximum</div>
          <StyledShowMore>
            <div
              onClick={() => {
                setShowRule(true);
              }}
            >
              Show more
            </div>
            <FaChevronRight />
          </StyledShowMore>
        </StyledBlock>
        {showRules && (
          <StyledPopup setShowPopUp={setShowRule}>
            <StyledPopupContainer>
              <div>
                <Styledbutton onClick={() => setShowRule(false)}>
                  <FontAwesomeIcon icon={faXmark} />
                </Styledbutton>
              </div>

              <StyledPopupContent className="containerText">
                <div>House rules</div>
                <div>
                  You'll be staying in someone's home, so please treat it with care and respect.
                </div>
                <div>
                  <StyledCheckDuring>
                    <div>Checking in and out</div>
                    <StyledFlex>
                      <div>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: "24px" }} />
                      </div>
                      <div>Check-in after: {data.checkInAfter} PM</div>
                    </StyledFlex>
                    <StyledFlex>
                      <div>
                        <FontAwesomeIcon icon={faClock} style={{ fontSize: "24px" }} />
                      </div>
                      <div>Check-in after: {data.checkOutBefore} PM</div>
                    </StyledFlex>
                    {data.selfCheckIn ? (
                      <StyledFlex>
                        <RiDoorOpenLine style={{ fontSize: "24px" }} />
                        <div>Self check-in</div>
                      </StyledFlex>
                    ) : (
                      <StyledFlex>
                        <RiDoorOpenLine style={{ fontSize: "24px" }} />
                        <div>Check-in with Host</div>
                      </StyledFlex>
                    )}
                  </StyledCheckDuring>
                  <StyledCheckDuring>
                    <div>During your stay</div>
                    <StyledFlex>
                      <GrGroup style={{ fontSize: "24px" }} />
                      <div> {data.maximumGuest} guests maximum</div>
                    </StyledFlex>
                    <div>
                      <div>
                        {data.smokingAllowed ? (
                          <StyledFlex>
                            <FaSmoking style={{ fontSize: "24px" }} />
                            <div> Smoking allowed</div>
                          </StyledFlex>
                        ) : (
                          <StyledFlex>
                            <FaSmokingBan style={{ fontSize: "24px" }} />
                            <div>Smoking not allowed</div>
                          </StyledFlex>
                        )}
                      </div>
                      <div>
                        {data.petAllowed ? (
                          <StyledFlex>
                            <MdOutlinePets style={{ fontSize: "24px" }} />
                            <div> Pets allowed</div>
                          </StyledFlex>
                        ) : (
                          <StyledFlex>
                            <MdOutlinePets style={{ fontSize: "24px" }} />
                            <div>Pets not allowed</div>
                          </StyledFlex>
                        )}
                      </div>
                    </div>
                  </StyledCheckDuring>
                </div>
              </StyledPopupContent>
            </StyledPopupContainer>
          </StyledPopup>
        )}
        <StyledBlock>
          <div>Safety & property</div>
          <div>Carbon monoxide alarm not reported</div>
          <div>Smoke alarm</div>
        </StyledBlock>
        <StyledBlock>
          <div>Cancellation policy</div>
          <div>{policy} </div>
        </StyledBlock>
      </StyledContainer>
    </div>
  );
}
