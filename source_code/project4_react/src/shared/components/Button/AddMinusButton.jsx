import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 45px;
    cursor: pointer;
  }

  svg:active {
    transform: scale(0.9);
  }

  p {
    font-size: 20px;
  }
`;

export default function AddMinusButton({ state, setState, min, max, className }) {
  const onAdd = () => {
    if (state < max) {
      setState(state + 1);
    }
  };

  const onMinus = () => {
    if (state > min) {
      setState(state - 1);
    }
  };

  return (
    <Container className={className}>
      <CiCircleMinus onClick={onMinus} />

      <p>{state}</p>

      <CiCirclePlus onClick={onAdd} />
    </Container>
  );
}
