import React from "react";
import { useState } from "react";
import styled from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import { GetAdminPropertyReviewRequest } from "../api/adminPropertyDetailApi";
import Avatar from "react-avatar";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import Pagination from "@/shared/components/Pagination/Pagination";
import TextInput from "@/shared/components/Input/TextInput";
import SelectInput from "@/shared/components/Input/SelectInput";

const PopUpContainer = styled(PopUp)`
  padding: 1rem;
  width: 50rem;
  height: 40rem;
  overflow: auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const ReviewContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentContainerStyled = styled.div`
  border-radius: 15px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 1rem;

  display: grid;
  grid-template-columns: 12rem 1fr;

  > div:nth-of-type(1) {
    display: flex;
    flex-direction: column;
    padding: 10px;
    align-items: center;
    gap: 5px;

    & button {
      background-color: black;
      color: white;
      border-radius: 15px;
      padding: 5px 10px;
      cursor: pointer;
    }

    & button:active {
      transform: scale(0.9);
    }
  }

  & p {
    font-weight: 600;
  }
`;

const ReviewContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem;

  > div:nth-of-type(1) {
    > div:nth-of-type(1) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  > div:nth-of-type(2) {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const FilterStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
`;

const options = [
  { label: "Most recent", value: "recent" },
  { label: "Highst rated", value: "highest" },
  { label: "Lowest rated", value: "lowest" },
];

export default function PropertyDetailReviewPopUp({ propertyId, action }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(options[0]);

  const getPropertyReview = GetAdminPropertyReviewRequest(
    propertyId,
    currentPage - 1,
    10,
    search,
    status.value
  );

  return (
    <PopUpContainer action={action}>
      <FilterStyled>
        <TextInput placeholder={"Search review"} setState={setSearch} state={search} />
        <SelectInput options={options} state={status} setState={setStatus} />
      </FilterStyled>

      {getPropertyReview.isSuccess && (
        <ReviewContainerStyled>
          {getPropertyReview.data.data.map((review, index) => {
            return (
              <CommentContainerStyled key={index}>
                <div>
                  <Avatar round={15} src={review.user.avatar} />
                  <button>Booking detail</button>
                </div>
                <ReviewContentStyled>
                  <div>
                    <div>
                      <div>
                        <ReactStars
                          edit={false}
                          onChange={() => {}}
                          size={20}
                          count={5}
                          color="black"
                          activeColor="#FFD700"
                          value={review.totalScore}
                          isHalf={true}
                          emptyIcon={<FaRegStar />}
                          halfIcon={<FaStarHalfStroke />}
                          filledIcon={<FaStar />}
                        />
                      </div>
                      {formatDate(review.createdAt)}
                    </div>
                    <div>{review.review}</div>
                  </div>
                </ReviewContentStyled>
              </CommentContainerStyled>
            );
          })}
        </ReviewContainerStyled>
      )}

      {getPropertyReview.isSuccess && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={getPropertyReview.data.totalPages}
        />
      )}
    </PopUpContainer>
  );
}
