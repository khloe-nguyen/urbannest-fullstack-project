import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton from "react-loading-skeleton";

import styled from "styled-components";
import "react-loading-skeleton/dist/skeleton.css";

const StyledCarousel = styled.div`
  border-radius: 15px;
  aspect-ratio: 1 / 1;
`;

const StyledItemContainer = styled.div``;

const StyledImgSkeleton = styled(Skeleton)`
  aspect-ratio: 1;
  height: 100%;
  width: 100%;
`;

const StyledSkeletonContainer = styled.div`
  margin-top: 10px;
  position: relative;
  z-index: -1;
`;

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export function ItemSkeleton() {
  return (
    <StyledItemContainer>
      <StyledCarousel>
        <StyledImgSkeleton />
      </StyledCarousel>

      <Skeleton style={{ width: "90%" }} />
      <Skeleton style={{ width: "70%" }} />
      <Skeleton style={{ width: "40%" }} />
      <Skeleton style={{ width: "40%" }} />
    </StyledItemContainer>
  );
}
