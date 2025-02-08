import styled from "styled-components";
import { GetAllReviewByPropertyId } from "../api/api";
import Avatar from "react-avatar";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import Pagination from "@/shared/components/Pagination/pagination";
import { useState } from "react";
import formatDollar from "@/shared/utils/FormatDollar";
import { SiCcleaner } from "react-icons/si";
import { CiCircleCheck } from "react-icons/ci";
import { IoKeyOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";
import { BsTag } from "react-icons/bs";
import leftReview from "@/shared/assets/images/left_review.png";
import rightReview from "@/shared/assets/images/right_review.png";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import { SlLike } from "react-icons/sl";
import Stars from "./Stars";

const StyledReview = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;
const StyledContainerReview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;
const StyledHeader = styled.div`
  margin: 2rem 0 5rem 5rem;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  justify-content: center;
  font-weight: bold;

  & > div {
    padding: 0 1rem;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    & > div {
      padding-bottom: 0.2rem;
    }
    & > div:last-child {
      padding-bottom: 0;
    }
  }
  & > div:last-child {
    border-right: none;
  }
`;
const StyledNameAndAvatar = styled.div`
  display: flex;
  justify-content: stretch;
  column-gap: 1rem;
  align-items: center;
`;
const StyledName = styled.div`
  line-height: 1.7;

  & > div:nth-child(1) {
    font-weight: bold;
  }
`;
const StyledReviewText = styled.div`
  padding: 1rem 1rem 0 0;
`;

const StyledPage = styled.div`
  margin-top: 1rem;
`;
const StyledValue = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  font-weight: bold;
`;
export default function Review({ data }) {
  const [currentPage, setCurrentPage] = useState(1);

  const getAllReviewByPropertyId = GetAllReviewByPropertyId(data.id, currentPage - 1, 6);

  if (getAllReviewByPropertyId.isLoading) {
    return <div />;
  }

  return (
    <StyledReview>
      {getAllReviewByPropertyId.isSuccess && (
        <div>
          <StyledValue>
            <div>
              <img src={leftReview} alt="left review" style={{ width: "120px", height: "auto" }} />
            </div>
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
              <img
                src={rightReview}
                alt="right review"
                style={{ width: "120px", height: "auto" }}
              />
            </div>
          </StyledValue>
          <StyledHeader>
            <div>
              <div>Cleanliness</div>
              <div>{formatDollar(data.cleanlinessScore)}</div>
              <div>
                <SiCcleaner style={{ fontSize: "40px", marginTop: "15px" }} />
              </div>
            </div>
            <div>
              <div>Accuracy</div>
              <div>{formatDollar(data.accuracyScore)}</div>
              <div>
                <CiCircleCheck style={{ fontSize: "40px", marginTop: "15px" }} />
              </div>
            </div>
            <div>
              <div>Check-in</div>
              <div>{formatDollar(data.checkinScore)}</div>
              <div>
                <IoKeyOutline style={{ fontSize: "40px", marginTop: "15px" }} />
              </div>
            </div>
            <div>
              <div>Communication</div>
              <div>{formatDollar(data.communicationScore)}</div>
              <div>
                <FaRegMessage style={{ fontSize: "40px", marginTop: "15px" }} />
              </div>
            </div>
            <div>
              <div>Value</div>
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
                <BsTag style={{ fontSize: "40px", marginTop: "15px" }} />
              </div>
            </div>
          </StyledHeader>
          <div>
            <StyledContainerReview>
              {getAllReviewByPropertyId.data.data.map((review, index) => (
                <div key={index}>
                  <StyledNameAndAvatar>
                    <Avatar
                      src={review.user.avatar}
                      size="55px"
                      textSizeRatio={2}
                      round={true}
                      name={review.user.firstName}
                    />
                    <StyledName>
                      <div>{capitalizeFirstLetter(review.user.firstName)} </div>
                      <div style={{ fontSize: "14px" }}>{formatDate(review.createdAt)}</div>
                    </StyledName>
                  </StyledNameAndAvatar>
                  <div>
                    <StyledReviewText>
                      <Stars totalScore={review.totalScore} />
                      {capitalizeFirstLetter(review.review)}
                    </StyledReviewText>
                  </div>
                </div>
              ))}
            </StyledContainerReview>
            <StyledPage>
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPage={getAllReviewByPropertyId.data.totalPages}
              />
            </StyledPage>
          </div>
          {/* <ReviewPopUp /> */}
        </div>
      )}
    </StyledReview>
  );
}
