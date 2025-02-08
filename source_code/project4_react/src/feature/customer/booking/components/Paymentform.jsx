import styled from "styled-components";

const StyledContainerInput = styled.div``;

const StyledInput = styled.input`
  border: none;
  padding: 0.7rem;
  font-size: 18px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.7);
  &:focus {
    border-radius: 4px;
    border: 1px solid #ea5e66;
    outline: none;
  }
`;

const StyledError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const StyledContainerExandCvv = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 4fr 3fr;
  gap: 1rem;
`;

export default function Paymentform({
  cardName,
  cardnumber,
  expiration,
  cvv,
  setCardName,
  setCardnumber,
  setCvv,
  setExpiration,
  cardNameError,
  setCardNameError,
  cardnumberError,
  setCardnumberError,
  expirationError,
  setExpirationError,
  cvvError,
  setCvvError,
}) {
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "");
    value = value.slice(1);
    value = "4" + value;

    if (/^[0-9]*$/.test(value) && value.length <= 16) {
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardnumber(formattedValue);

      if (value.length < 16) {
        setCardnumberError("Card number must have 16 digits.");
      } else {
        setCardnumberError("");
      }
    } else {
      setCardnumberError("");
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^[0-9]*$/.test(value)) {
      setCvv(value);
      setCvvError("");
    }

    if (value.length !== 3) {
      setCvvError("CVV must be 3 digits.");
    }
  };

  const handleExpirationChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear() % 100;

    if (value.length > 4) return;

    if (value.length === 2 && value[0] === "0" && parseInt(value[1], 10) === 0) {
      return;
    }
    if (value.length === 2 && value[0] === "1" && parseInt(value[1], 10) > 2) {
      return;
    }

    if (value.length === 1 && parseInt(value, 10) > 1) {
      value = "0" + value;
    }

    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
      setExpirationError("input year");
    }

    const [monthStr, yearStr] = value.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (yearStr?.length === 2) {
      if (year < currentYear) {
        setExpirationError("Year must not be in the past.");
        return;
      } else if (year === currentYear && month < currentMonth) {
        setExpirationError("Expiration date cannot be in the past.");
        return;
      }
    }

    setExpirationError("");
    setExpiration(value);
  };
  const handleCardNameChange = (e) => {
    let value = e.target.value.replace(/\s+/g, " ");
    const namePattern = /^[A-Za-z\s]*$/;

    if (value.length === 0) {
      setCardNameError("Card name cannot be empty.");
      return;
    }

    if (!namePattern.test(value)) {
      setCardNameError("Card name must contain only letters and single spaces between words.");
      return;
    }

    setCardNameError("");
    setCardName(value);
  };

  return (
    <div>
      <StyledContainerInput>
        <StyledInput
          type="text"
          placeholder="Card number (e.g., 4111 1111 1111 1111)"
          value={cardnumber}
          onChange={handleCardNumberChange}
        />
        {cardnumberError && <StyledError>{cardnumberError}</StyledError>}
      </StyledContainerInput>

      <StyledContainerInput>
        <StyledInput
          type="text"
          placeholder="Card name"
          value={cardName}
          onChange={handleCardNameChange}
          maxLength={30}
          minLength={3}
        />
        {cardNameError && <StyledError>{cardNameError}</StyledError>}
      </StyledContainerInput>

      <StyledContainerExandCvv>
        <StyledContainerInput>
          <StyledInput
            type="text"
            placeholder="MM/YY (e.g., 04/26)"
            value={expiration}
            onChange={handleExpirationChange}
          />
          {expirationError && <StyledError>{expirationError}</StyledError>}
        </StyledContainerInput>

        <StyledContainerInput>
          <StyledInput
            type="text"
            placeholder="CVV (3 digits)"
            value={cvv}
            onChange={handleCvvChange}
            maxLength={3} // Giới hạn tối đa 3 ký tự
          />
          {cvvError && <StyledError>{cvvError}</StyledError>}
        </StyledContainerInput>
      </StyledContainerExandCvv>
    </div>
  );
}
