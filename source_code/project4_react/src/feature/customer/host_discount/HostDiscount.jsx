import styled, { css } from "styled-components";
import { useState } from "react";
import Pagination from "@/shared/components/Pagination/Pagination";
import CreateDiscountPopUp from "./components/CreateDiscountPopUp";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h2 {
    font-size: 30px;
  }
`;

const TableContentStyled = styled.table`
  margin: 1rem 0;
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;

  thead tr {
    text-align: left;
    font-weight: bold;
    font-size: 16px;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  tbody tr {
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:hover {
    background-color: #f7f7f7;
  }

  tbody tr svg {
    font-size: 20px;
    color: white;
  }
  tbody tr:hover svg {
    color: black;
    font-size: 20px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;

  & button {
    background-color: black;
    color: white;
    padding: 10px;
    border-radius: 15px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;

  align-items: center;

  > div:nth-of-type(1) {
    cursor: pointer;

    svg {
      font-size: 25px;
    }
  }
`;

const ReservationStyled = styled.div``;

const ReservationHeaderStyled = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 10px;

  > button {
    background-color: white;
    border: none;
    font-size: 18px;
    padding-bottom: 10px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.7);
    border-bottom: 2px solid white;
  }
`;

const FilterContainerStyled = styled.div`
  position: relative;

  > button {
    background-color: white;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 10px 1rem;
    border-radius: 25px;
    cursor: pointer;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const HeaderButtonStyled = styled.button`
  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid black !important;
      `;
    }
  }}
`;

export default function HostDiscount() {
  const [isCreate, setIsCreate] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <HeaderStyled>
          <div>
            <MdKeyboardArrowLeft onClick={() => navigate("/hosting")} />
          </div>
          <FilterContainerStyled>
            <button onClick={() => setIsCreate(true)}>Create new Discount</button>
          </FilterContainerStyled>
        </HeaderStyled>
        <h2>Discount</h2>
        <ReservationStyled>
          <ReservationHeaderStyled>
            <HeaderButtonStyled>Active</HeaderButtonStyled>
            <HeaderButtonStyled>Upcoming</HeaderButtonStyled>
            <HeaderButtonStyled>Canceled</HeaderButtonStyled>
            <HeaderButtonStyled>All</HeaderButtonStyled>
          </ReservationHeaderStyled>
          <TableContentStyled>
            <thead>
              <tr>
                <td>Code</td>
                <td>Property</td>
                <td>Quantity</td>
                <td>Status</td>
                <td></td>
              </tr>
            </thead>
          </TableContentStyled>
        </ReservationStyled>
      </Container>
      {isCreate && <CreateDiscountPopUp action={() => setIsCreate()} />}
    </>
  );
}
