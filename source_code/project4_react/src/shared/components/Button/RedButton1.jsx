import styled, { css } from "styled-components";

const Button = styled.button`
  align-items: center;
  background-color: #ff385c; /* Airbnb red */
  border: none; /* Remove border */
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
  box-sizing: border-box;
  color: white; /* Text color */
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

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(255, 255, 255, 0.85); /* Lighter text on hover */
  }

  &:active {
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(255, 255, 255, 0.85); /* Lighter text on hover */
    scale: 0.97;
  }

  &:hover {
    transform: translateY(-1px);
    background-color: #ff2a50; /* Darker shade for hover effect */
  }

  &:active {
    background-color: #ff2a50; /* Keep the darker shade on active */
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    transform: translateY(0);
  }

  ${(props) => {
    if (props.$active == false) {
      return css`
        background-color: #e6e6e6;
        cursor: not-allowed;

        &:hover {
          background-color: #e6e6e6;
        }
      `;
    }
  }}
`;

export default function RedButton({ className, children, onClick, type, active }) {
  return (
    <Button $active={active} type={type} onClick={onClick} className={className}>
      {children}
    </Button>
  );
}
