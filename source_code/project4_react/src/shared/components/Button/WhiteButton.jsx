import styled from "styled-components";

const Button = styled.button`
  align-items: center;
  background-color: white; /* Set background to white */
  border: none;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
  box-sizing: border-box;
  color: #ff385c; /* Airbnb red for text color */
  cursor: pointer;
  display: inline-flex;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
  border: 2px solid black;
  color: black;
  width: 100%;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(255, 56, 92, 0.85); /* Slightly lighter red on hover */
    transform: translateY(-1px);
  }

  &:active {
    background-color: #f7f7f7; /* Light gray shade for active state */
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    color: #ff385c;
    transform: translateY(0);
  }
`;

export default function WhiteButton({ className, children, onClick, type }) {
  return (
    <Button type={type} onClick={onClick} className={className}>
      {children}
    </Button>
  );
}
