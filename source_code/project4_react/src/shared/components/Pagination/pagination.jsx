import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 7px;
  transition: all 0.5s;

  & button {
    cursor: pointer;
  }

  & .active {
    background-color: black;
    color: white;
  }

  & span {
    font-size: 17px;
  }
`;

const Button = styled.button`
  width: 2rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 100%;
`;

const Icon = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 100%;
  padding: 0.5rem;
`;

export default function Pagination({ currentPage, totalPage, setCurrentPage }) {
  const [renderPage, setRenderPage] = useState();

  const paginate = () => {
    const current = parseInt(currentPage);

    const paginate = [];

    if (current - 2 > 0) {
      paginate.push(current - 2);
    }

    if (current - 1 > 0) {
      paginate.push(current - 1);
    }

    paginate.push(current);

    if (current + 1 <= totalPage) {
      paginate.push(current + 1);
    }

    if (current + 2 <= totalPage) {
      paginate.push(current + 2);
    }

    return paginate;
  };

  useEffect(() => {
    const total = paginate();
    setRenderPage(total);

    if (totalPage < currentPage) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPage]);

  return (
    <Container>
      <Icon onClick={() => setCurrentPage(1)} disabled={currentPage == 1}>
        <MdKeyboardDoubleArrowLeft />
      </Icon>
      {renderPage?.map((item, index) => {
        return (
          <Button
            className={item == currentPage && "active"}
            onClick={() => setCurrentPage(item)}
            key={index}
          >
            {item}
          </Button>
        );
      })}
      <Icon
        onClick={() => setCurrentPage(totalPage)}
        disabled={currentPage == totalPage || totalPage == 0}
      >
        <MdKeyboardDoubleArrowRight />
      </Icon>
    </Container>
  );
}
