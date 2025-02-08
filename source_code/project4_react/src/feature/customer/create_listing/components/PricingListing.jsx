import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import TextInput from "@/shared/components/Input/TextInput";
import NumberInput from "@/shared/components/Input/NumberInput";
import Radio from "@/shared/components/Input/RadioInput";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";

const Container = styled.div`
  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;

  p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Right = styled.div`
  position: sticky;
  top: 0;

  height: fit-content;

  > div {
    padding: 2rem;

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const BasePrice = styled.div`
  display: flex;
  flex-direction: row !important;
  align-items: center;
  gap: 2rem !important;
  h1 {
    font-size: 5rem;
  }
`;

const regex = /^(?=.*\d)\d*(?:\.\d*)?$/;

const CustomTextInput = styled(TextInput)`
  width: 10rem;
  font-size: 3rem;
  font-weight: 900;
  height: fit-content;
`;

const DiscountTextInput = styled(NumberInput)`
  width: 5rem;
  font-size: 1rem;
  font-weight: 900;
`;

const Discount = styled.div`
  display: flex;
  flex-direction: row !important;
  background-color: #f7f7f7;
  padding: 2rem 1rem;
  gap: 2rem !important;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

const RadioContainer = styled.div`
  & p {
    padding-bottom: 3px;
  }

  > div {
    display: flex;
    align-items: center;
  }
`;

const StayStyled = styled.div`
  margin: 0.5rem 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
`;

export default function PricingListing() {
  const [state, dispatch, ACTIONS] = useOutletContext();

  return (
    <>
      <Container>
        <Header>
          <h2>Now, set your price </h2>
          <p>You can change it anytime</p>
        </Header>
        <Body>
          <Left>
            <BasePrice>
              <h1>$</h1>
              <CustomTextInput
                state={state.basePrice}
                setState={(value) => {
                  if (regex.test(value) || value == "") {
                    dispatch({ type: ACTIONS.CHANGE_BASE_PRICE, next: value });
                  }
                }}
              />
            </BasePrice>
            <hr />
            <div>
              <h3>Add discounts</h3>
              <p>Help your place stand out to get booked faster and earn your first reviews.</p>
            </div>
            <Discount>
              <div>
                <DiscountTextInput
                  state={state.weeklyDiscount}
                  setState={(value) => {
                    if (Number(value) <= 90) {
                      dispatch({ type: ACTIONS.CHANGE_WEEKLY_DISCOUNT, next: value });
                    } else {
                      alert("Your WEEKLY_DISCOUNT can not be more that 90%");
                    }
                  }}
                />
              </div>
              <div>
                <h4>Weekly discount in %</h4>
                <p>For stays of 7 nights or more</p>
              </div>
            </Discount>
            <Discount>
              <div>
                <DiscountTextInput
                  state={state.monthlyDiscount}
                  setState={(value) => {
                    if (Number(value) <= 90) {
                      dispatch({ type: ACTIONS.CHANGE_MONTHLY_DISCOUNT, next: value });
                    } else {
                      alert("Your MONTHLY_DISCOUNT can not be more that 90%");
                    }
                  }}
                />
              </div>
              <div>
                <h4>Monthly discount in %</h4>
                <p>For stays of 28 nights or more</p>
              </div>
            </Discount>
            <hr />
            <div>
              <h3>How far in advance can guests</h3>
              <p>
                Tip: You'll get more reservation if you keep your calendar available and only block
                days you can't host
              </p>
              <RadioContainer>
                <div>
                  <Radio
                    checked={state.maximumMonthPreBook == 0}
                    onChange={() =>
                      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: 0 })
                    }
                    name={"advance"}
                  />
                  <p>Any time</p>
                </div>
                <div>
                  <Radio
                    checked={state.maximumMonthPreBook == 3}
                    onChange={() =>
                      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: 3 })
                    }
                    name={"advance"}
                  />
                  <p>3 months in advance</p>
                </div>
                <div>
                  <Radio
                    checked={state.maximumMonthPreBook == 6}
                    onChange={() =>
                      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: 6 })
                    }
                    name={"advance"}
                  />
                  <p>6 months in advance</p>
                </div>
                <div>
                  <Radio
                    checked={state.maximumMonthPreBook == 9}
                    onChange={() =>
                      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: 9 })
                    }
                    name={"advance"}
                  />
                  <p>9 months in advance</p>
                </div>
                <div>
                  <Radio
                    checked={state.maximumMonthPreBook == 12}
                    onChange={() =>
                      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: 12 })
                    }
                    name={"advance"}
                  />
                  <p>1 year in advance</p>
                </div>
              </RadioContainer>
            </div>
            <hr />
            <div>
              <h3>Trip length</h3>
              <StayStyled>
                <InputCheckBox
                  checked={state.minimumStay}
                  onChange={() =>
                    dispatch({
                      type: ACTIONS.CHANGE_MINIMUM_STAY,
                      next: state.minimumStay != null ? null : 1,
                    })
                  }
                />
                <p>Set minimum stay</p>
              </StayStyled>
              {state.minimumStay && (
                <Discount>
                  <div>
                    <DiscountTextInput
                      state={state.minimumStay}
                      setState={(value) => {
                        if (!state.maximumStay || Number(value) <= Number(state.maximumStay)) {
                          dispatch({ type: ACTIONS.CHANGE_MINIMUM_STAY, next: value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h4>Minimum stay</h4>
                    <p>Minimum stay is {state.minimumStay} days</p>
                  </div>
                </Discount>
              )}
              <StayStyled>
                <InputCheckBox
                  checked={state.maximumStay != null}
                  onChange={() =>
                    dispatch({
                      type: ACTIONS.CHANGE_MAXIMUM_STAY,
                      next:
                        state.maximumStay == null
                          ? state.minimumStay != null
                            ? state.minimumStay
                            : 1
                          : null,
                    })
                  }
                />
                <p>Set maximum stay</p>
              </StayStyled>
              {state.maximumStay && (
                <Discount>
                  <div>
                    <DiscountTextInput
                      state={state.maximumStay}
                      setState={(value) => {
                        if (!state.minimumStay || Number(value) >= Number(state.minimumStay)) {
                          dispatch({ type: ACTIONS.CHANGE_MAXIMUM_STAY, next: value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h4>Maximum stay</h4>
                    <p>Maximum stay is {state.maximumStay} days</p>
                  </div>
                </Discount>
              )}
            </div>
          </Left>
          <Right></Right>
        </Body>
      </Container>
    </>
  );
}
