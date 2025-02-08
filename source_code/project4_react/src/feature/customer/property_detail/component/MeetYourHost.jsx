import Avatar from "react-avatar";
import styled from "styled-components";
import { MdOutlineStar } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { PiShieldWarningBold } from "react-icons/pi";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import { useNavigate } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import { CountByPropertyId } from "../api/api";
import formatDollar from "@/shared/utils/FormatDollar";

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 5fr;
  column-gap: 4rem;
  margin: 3rem 0;
`;
const StyledHeader = styled.div`
  font-size: 22px;
  font-weight: 600;
  padding-top: 2rem;
  margin-bottom: 3rem;
`;
const StyledFrame = styled.div`
  cursor: pointer;
  width: 100%;
  height: fit-content;
  padding: 2rem 0;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  border-radius: 8px;
  /* display: grid;
  grid-template-columns: 2fr 1fr; */
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 1rem;
`;
const StyledAvatar = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1.5;

  & > div {
    font-size: 28px;
    font-weight: bold;
  }
`;
const StyledInfo = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-right: 2rem;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  & > div:nth-child(2) {
    font-size: 12px;
    font-weight: 600;
  }
  & > div:first-child {
    display: flex;
    align-items: center;
  }
`;
const StyledBadge = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
  column-gap: 0.5rem;
  & > div {
    font-size: 15px;
  }
`;
const StyledConainerHostDetail = styled.div`
  margin-top: -1rem;
`;
const StyledHostDetail = styled.div`
  & > div:first-child {
    font-size: 18px;
    font-weight: 600;
    margin: 0.5rem 0;
  }
`;
const StyledWarning = styled.div`
  margin-top: 1rem;
  font-size: 13px;
  display: flex;
  justify-content: stretch;
  column-gap: 0.5rem;
  align-items: center;
`;
const StyledHostMessage = styled.button`
  width: fit-content;
  margin-top: 10px;
  padding: 7px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.9);
  }
`;

export default function MeetYourHost({ data }) {
  const user = UserRequest();
  const navigate = useNavigate();
  const [badgeHost, setBadgeHost] = useState([]);
  const countReview = CountByPropertyId(data.id);
  useEffect(() => {
    let badges = [];
    // alert(data.user.id);
    data.user.userBadges.map((badge) => {
      if (badge.show) {
        badges.push(badge.userBadgeId.badgeId);
      }
    });
    setBadgeHost(badges);
  }, [data.user.userBadges]);
  const getNameBadge = () => {
    for (let index = 0; index < badgeHost.length; index++) {
      if (badgeHost[index] == 2) {
        return "Superhost";
      } else {
        if (badgeHost[index] == 5) {
          return "Top Rated Host";
        }
      }
    }
    return "Verified User";
  };
  const calculateHostTime = () => {
    const createdAt = new Date(data.createdAt); // Parse createdAt to Date
    const nowTime = new Date();

    // Calculate the difference in milliseconds
    let timeDifference = nowTime - createdAt;

    // Calculate years
    const years = nowTime.getFullYear() - createdAt.getFullYear();

    // Calculate months
    const months = nowTime.getMonth() + 1 - (createdAt.getMonth() + 1) + years * 12;

    // Remove whole years and months from the time difference
    timeDifference -= years * 365.25 * 24 * 60 * 60 * 1000;
    timeDifference -= months * 30.44 * 24 * 60 * 60 * 1000;

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    return { years, months, days, hours, minutes };
  };

  // Example usage
  const timeSinceCreated = calculateHostTime();

  return (
    <div>
      <StyledHeader>Meet Your Host</StyledHeader>
      <StyledContainer>
        <StyledFrame onClick={() => navigate("/user/show/" + data.user.id)}>
          <div>
            <StyledAvatar>
              <Avatar
                src={data.user.avatar}
                size="120px"
                textSizeRatio={2}
                round={true}
                name={data.user.firstName}
              />
              <div>
                {capitalizeFirstLetter(data.user.firstName)} {data.user.lastName}
              </div>
              <StyledBadge>
                <FaUserCheck style={{ fontSize: "16px" }} />
                <div> {getNameBadge()}</div>
              </StyledBadge>
            </StyledAvatar>
          </div>
          {countReview.isSuccess && countReview.data.data > 0 && (
            <div>
              <StyledInfo>
                <div>{countReview.data.data}</div>
                <div>Reviews</div>
              </StyledInfo>
              <StyledInfo>
                <div>
                  <div>
                    {formatDollar(
                      (data.cleanlinessScore +
                        data.accuracyScore +
                        data.checkinScore +
                        data.communicationScore) /
                        4
                    )}
                  </div>
                  <div>
                    <MdOutlineStar style={{ fontSize: "14px" }} />
                  </div>
                </div>
                <div>Rating</div>
              </StyledInfo>
              <StyledInfo>
                <div>
                  {timeSinceCreated.years < 1
                    ? timeSinceCreated.months < 1
                      ? "New host"
                      : `${timeSinceCreated.months} `
                    : `${timeSinceCreated.years}`}
                </div>
                <div>
                  {timeSinceCreated.years < 1
                    ? timeSinceCreated.months < 1
                      ? "New host"
                      : ` months hosting`
                    : ` years hosting`}
                </div>
              </StyledInfo>
            </div>
          )}
        </StyledFrame>

        <StyledConainerHostDetail>
          <StyledHostDetail>
            <div>
              {capitalizeFirstLetter(data.user.firstName)} {data.user.lastName} is {getNameBadge()}
            </div>
            <div>
              Superhosts are experienced, highly rated hosts who are committed to providing great
              stays for guests.
            </div>
          </StyledHostDetail>
          <StyledHostDetail>
            <div>Host details</div>
            <div>Response rate: 100%</div>
            <div>Responds within an hour</div>
          </StyledHostDetail>

          {user.isSuccess && user.data.status == 200 && user.data.data.id != data.user.id && (
            <StyledHostMessage
              onClick={() =>
                navigate("/messages", {
                  state: {
                    userId: data.user.id,
                  },
                })
              }
            >
              Host message
            </StyledHostMessage>
          )}
          <StyledWarning>
            <PiShieldWarningBold style={{ fontSize: "20px", color: "red" }} />
            To protect your payment, never transfer money or communicate outside of the Airbnb
            website or app.
          </StyledWarning>
        </StyledConainerHostDetail>
      </StyledContainer>
    </div>
  );
}
