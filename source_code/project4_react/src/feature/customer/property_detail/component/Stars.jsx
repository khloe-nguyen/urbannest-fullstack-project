import { FaStar } from "react-icons/fa";
import styled from "styled-components";
const StarsWrapper = styled.div`
  display: flex;
  gap: 2px;
`;
const Star = styled.span`
  font-size: 18px;
  color: #ddd;
  position: relative;
  &.full {
    color: gold;
  }
  &.half {
    color: gold;
    overflow: hidden;
  }
  &.half::before {
    content: "★";
    color: #ddd;
    position: absolute;
    left: 0;
    z-index: 1;
  }
  &.half::after {
    content: "★";
    color: gold;
    position: absolute;
    left: 0;
    width: 50%;
    overflow: hidden;
    z-index: 2;
  }
`;
const Stars = ({ totalScore }) => {
  const roundedScore =
    Math.floor(totalScore) + (totalScore % 1 >= 0.7 ? 1 : totalScore % 1 >= 0.4 ? 0.5 : 0);
  const fullStars = Math.floor(roundedScore);
  const hasHalfStar = roundedScore % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const stars = [
    ...Array(fullStars).fill("full"),
    ...(hasHalfStar ? ["half"] : []),
    ...Array(emptyStars).fill("empty"),
  ];
  return (
    <StarsWrapper>
      {stars.map((star, index) => (
        <Star key={index} className={star}>
          ★
        </Star>
      ))}
    </StarsWrapper>
  );
};
export default Stars;
