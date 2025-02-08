import styled from "styled-components";
const StyledPage = styled.div`
  display: flex;
  font-size: 7rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  height: 100vh;
`;
export default function PageNotFound() {
  return <StyledPage>Page not found</StyledPage>;
}
