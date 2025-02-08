import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useOutletContext } from "react-router-dom";
import SelectInput from "@/shared/components/Input/SelectInput";
import SelectInputDescription from "@/shared/components/Input/SelectInputDescription";
import { PolicyRequest } from "@/shared/api/policyClientApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { UserBadgeRequest } from "@/shared/api/badgeClientApi";
import TextInput from "@/shared/components/Input/TextInput";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import TextEditor from "@/shared/components/editor/TextEditor";

const Container = styled.div`
  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  margin-bottom: 10rem;
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

  & p {
    color: rgba(0, 0, 0, 0.5);
    text-align: justify;
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

const bookOptions = [
  {
    label: "Instant book",
    value: "instant",
    description:
      "Guests can book properties instantly without waiting for host approval. Perfect for last-minute stays, ensuring quick confirmation and hassle-free reservations",
  },
  {
    label: "Reserved book",
    value: "reserved",
    description:
      "Guests request a booking and wait for host approval before confirming. Ideal for those who prefer more flexibility and time to finalize details.",
  },
];

const BookingType = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem !important;
`;

const InstantBook = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem !important;
`;

const SelfCheckIn = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem !important;
`;

const CheckBoxStyled = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.2rem 0;
`;

const checkInOptions = [
  {
    value: false,
    label: "Host-Managed Check-in",
    description:
      "This method requires the guest to meet the host or a property manager upon arrival. The host will physically hand over the key and show the guest around the property.",
  },
  {
    value: true,
    label: "Self Check-in",
    description:
      "Self check-in allows guests to independently access the property without needing to meet the host in person.",
  },
];

const selfCheckInOptions = [
  {
    value: "Keypad/Keyless Entry",
    label: "Keypad/Keyless Entry",
    description:
      "This method involves a keypad or smart lock where guests can enter a code to access the property. The code can be set by the host and sent to the guest prior to check-in.",
  },
  {
    value: "Smart Lock",
    label: "Smart Lock",
    description:
      "Smart locks can be accessed via a smartphone app, giving guests access to the property without a physical key. The app typically generates a unique access code for each guest or reservation.",
  },
  {
    value: "Lockbox",
    label: "Lockbox",
    description:
      "A lockbox is a secure container, usually mounted on the property (often near the front door), that holds a key. Guests are provided with the combination to access the key when it's time to check in.",
  },
  {
    value: "Digital Door Lock",
    label: "Digital Door Lock",
    description:
      "These locks are similar to smart locks but might not require an app; instead, they work with a pin code that the host provides to the guest.",
  },
  {
    value: "Bluetooth Access",
    label: "Bluetooth Access",
    description:
      "Some properties use Bluetooth-enabled locks that allow guests to unlock the door through their mobile devices when they are within a certain range.",
  },
  {
    value: "Remote Host/Property Manager",
    label: "Remote Host/Property Manager",
    description:
      "In some cases, a property manager may be available remotely to assist with access, guiding guests through unlocking the door without physical interaction.",
  },
  {
    value: null,
    label: "Additional type",
    description: "Different type of check in.",
  },
];

export default function PolicyListing() {
  const policy = PolicyRequest();
  const userBadge = UserBadgeRequest();
  const [state, dispatch, ACTIONS] = useOutletContext();

  useEffect(() => {
    if (state.selfCheckInInstruction == "<p></p>") {
      dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN_INSTRUCTION, next: "" });
    }
  }, [state.selfCheckInInstruction]);

  if (policy.isLoading) {
    return <WaitingPopUp />;
  }

  return (
    <Container>
      <Header>
        <h2>Policies and rules</h2>
      </Header>
      <Body>
        <Left>
          <div>
            <div>
              <p>Choose a refund policy</p>
            </div>
            <SelectInputDescription
              state={policy.data.data
                .map((item) => {
                  return {
                    label: item.policyName,
                    description: item.policyDescription,
                    value: item.id,
                  };
                })
                .find((type) => type.value == state.refundPolicyId)}
              setState={(type) => {
                dispatch({ type: ACTIONS.CHANGE_REFUND_POLICY_ID, next: type.value });
              }}
              options={policy.data.data.map((item) => {
                return {
                  label: item.policyName,
                  description: item.policyDescription,
                  value: item.id,
                };
              })}
            />
          </div>
          <hr />
          <div>
            <h4>Choose check-in type</h4>
            <SelectInputDescription
              state={checkInOptions.find((option) => option.value == state.selfCheckIn)}
              setState={(value) => {
                if (value.value == false) {
                  dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN_INSTRUCTION, next: "" });
                }

                dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN, next: value.value });
              }}
              options={checkInOptions}
            />

            {state.selfCheckIn && (
              <SelfCheckIn>
                <h4>Self Check-in type</h4>
                <SelectInputDescription
                  state={selfCheckInOptions.find((type) => type.value == state.selfCheckInType)}
                  setState={(value) =>
                    dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN_TYPE, next: value.value })
                  }
                  options={selfCheckInOptions}
                />
              </SelfCheckIn>
            )}

            {state.selfCheckIn && (
              <TextEditor
                setState={(value) => {
                  dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN_INSTRUCTION, next: value });
                }}
                state={state.selfCheckInInstruction}
              />
            )}
          </div>

          <hr />
          <BookingType>
            <h4>Choose a booking type</h4>
            <p>
              Our platform offers two flexible booking options to cater to every type of traveler:
              Instant Booking and Reserved Booking.
            </p>
            <SelectInputDescription
              state={bookOptions.find((book) => book.value == state.bookingType)}
              setState={(item) => dispatch({ type: ACTIONS.CHANGE_BOOKING_TYPE, next: item.value })}
              options={bookOptions}
            />

            {state.bookingType == "instant" && (
              <InstantBook>
                <h4>Instant booking requirement</h4>
                <SelectInputDescription
                  state={
                    userBadge.isSuccess &&
                    [
                      {
                        label: "All",
                        description: "Accept all kind of guests",
                        value: null,
                      },
                      ...userBadge.data.data.map((item) => {
                        return {
                          label: item.name,
                          description: item.description,
                          value: item.id,
                        };
                      }),
                    ].find((requirement) => requirement.value == state.instantBookRequirementID)
                  }
                  setState={(item) =>
                    dispatch({ type: ACTIONS.CHANGE_INSTANT_BOOK_REQUIREMENT_ID, next: item.value })
                  }
                  options={
                    userBadge.isSuccess && [
                      {
                        label: "All",
                        description: "Accept all kind of guests",
                        value: null,
                      },
                      ...userBadge.data.data
                        .filter((item) => item.id == 4)
                        .map((item) => {
                          return {
                            label: item.name,
                            description: item.description,
                            value: item.id,
                          };
                        }),
                    ]
                  }
                />
              </InstantBook>
            )}
          </BookingType>
          <hr />
          <div>
            <h4>Checking in and out</h4>
            <p>Check in after {state.checkInAfter}</p>
            <TextInput
              type="time"
              state={state.checkInAfter}
              setState={(value) => dispatch({ type: ACTIONS.CHANGE_CHECK_IN_AFTER, next: value })}
            />
            <p>Check out before {state.checkOutBefore}</p>
            <TextInput
              state={state.checkOutBefore}
              setState={(value) => dispatch({ type: ACTIONS.CHANGE_CHECK_OUT_BEFORE, next: value })}
              type="time"
            />
          </div>
          <hr />
          <div>
            <h4>Additional policy</h4>
            <p>
              To ensure a comfortable and safe experience for all our guests, we have established a
              few additional policies
            </p>
            <CheckBoxStyled>
              <InputCheckBox
                checked={state.petAllowed}
                onChange={() => {
                  dispatch({ type: ACTIONS.CHANGE_PET_ALLOWED, next: !state.petAllowed });
                }}
              />
              <span>Allow for pet</span>
            </CheckBoxStyled>
            <CheckBoxStyled>
              <InputCheckBox
                checked={state.smokingAllowed}
                onChange={() => {
                  dispatch({ type: ACTIONS.CHANGE_SMOKING_ALLOWED, next: !state.smokingAllowed });
                }}
              />
              <span>Allow for smoking</span>
            </CheckBoxStyled>
          </div>
        </Left>
        <Right></Right>
      </Body>
    </Container>
  );
}
