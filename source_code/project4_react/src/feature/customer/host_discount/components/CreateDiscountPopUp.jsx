import XButton from "@/shared/components/Button/XButton";
import PopUp from "@/shared/components/PopUp/PopUp";
import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import moment from "moment";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import Radio from "@/shared/components/Input/RadioInput";
import NumberInput from "@/shared/components/Input/NumberInput";
import SelectInput from "@/shared/components/Input/SelectInput";
import { UserBadgeRequest } from "@/shared/api/badgeClientApi";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import ListingSelectionPopUp from "../../host_calendar/components/ListingSelectionPopUp";
import { GetHostCalendarRequest } from "../../host_calendar/api/hostCalendarApi";
import WhiteButton from "@/shared/components/Button/WhiteButton";
import { CreateDiscountRequest } from "../api/hostDiscountApi";
import DiscountListingSelectionPopUp from "./DiscountListingSelectionPopUp";

const PopUpContainer = styled(PopUp)`
  padding: 0;
  width: 40rem;
  border-radius: 15px;

  & h4 {
    font-size: 16px;
  }

  & h5 {
    color: red;
  }

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  padding: 1rem 1rem;
  display: flex;
  justify-content: space-between;
`;

const Body = styled.div`
  padding: 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 35rem;
  overflow: auto;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    > p {
      color: rgba(0, 0, 0, 0.6);
    }
  }
`;

const Footer = styled.div`
  padding: 1rem;

  display: flex;
  justify-content: flex-end;
  gap: 10px;

  & button {
    width: fit-content;
  }
`;

const MethodStyled = styled.div`
  & label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 15px;
  }
`;

const VolumeStyled = styled.div`
  display: grid !important;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const TitleStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckBoxStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;

  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 2px solid black;
  }

  &:active {
    border: 2px solid black;
  }
`;

export default function CreateDiscountPopUp({ action }) {
  const userBadge = UserBadgeRequest();
  const now = new Date();
  const getHostCalendar = GetHostCalendarRequest();

  const [range, setRange] = useState();
  const [isDateSelect, setIsDateSelect] = useState(false);
  const [badgeOptions, setBadgeOptions] = useState([]);
  const [errors, setErrors] = useState({});

  const [method, setMethod] = useState("PUBLIC");
  const [title, setTitle] = useState(
    `Discount from ${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  );
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState("10");
  const [minimumPrice, setMinimumPrice] = useState();
  const [maximumPrice, setMaximumPrice] = useState();
  const [badgeOption, setBadgeOption] = useState({ label: "All", value: null });
  const [minimumStay, setMinimumStay] = useState();
  const [startDate, setStartDate] = useState(
    moment(new Date()).add(3, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState();
  const [endOption, setEndOption] = useState(false);
  const [property, setProperty] = useState([]);
  const [propertyPopUp, setPropertyPopUp] = useState(false);
  const createDiscount = CreateDiscountRequest();

  useEffect(() => {
    if (userBadge.isSuccess) {
      const option = userBadge.data.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });

      setBadgeOptions([
        {
          label: "All",
          value: null,
        },
        ...option,
      ]);
    }
  }, [userBadge.isSuccess]);

  const onCreateDiscount = () => {
    let isOk = true;

    if (!title) {
      setErrors((prev) => {
        return { ...prev, title: "Title cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, title: null };
      });
    }

    if (property.length == 0) {
      setErrors((prev) => {
        return { ...prev, property: "Property cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, property: null };
      });
    }

    if (!quantity) {
      setErrors((prev) => {
        return { ...prev, quantity: "Discount quantity cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, quantity: null };
      });
    }

    if (!discount) {
      setErrors((prev) => {
        return { ...prev, discount: "Discount percentage cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, discount: null };
      });
    }

    if (!maximumPrice) {
      setErrors((prev) => {
        return { ...prev, maximumPrice: "Maximum price cannot be empty " };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, maximumPrice: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("private", method == "PRIVATE" ? true : false);
      property.forEach((item) => formData.append("propertyIds", item.id));
      if (badgeOption.value) {
        formData.append("badgeRequirementId", badgeOption.value);
      }
      formData.append("discountPercentage", discount);
      formData.append("maximumDiscount", maximumPrice);
      formData.append("minimumPriceRequirement", minimumPrice ? minimumPrice : 0);
      formData.append("quantity", quantity);
      formData.append("minimumStayRequirement", minimumStay ? minimumStay : 0);
      formData.append("startDate", moment(startDate).format("YYYY-MM-DD"));
      if (endDate) {
        formData.append("expiredDate", moment(endDate).format("YYYY-MM-DD"));
      }

      createDiscount.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            console.log(response);
            action();
          }
        },
      });
    }
  };

  return (
    <>
      <PopUpContainer action={() => {}}>
        <Header>
          <h4>Create new discount</h4>
          <XButton action={action} />
        </Header>
        <hr />
        <Body>
          <MethodStyled>
            <h4>Method</h4>
            <div>
              <Radio checked={method == "PUBLIC"} onChange={() => setMethod("PUBLIC")} />{" "}
              <label>Public</label>
            </div>
            <div>
              <Radio checked={method == "PRIVATE"} onChange={() => setMethod("PRIVATE")} />{" "}
              <label>Private</label>
            </div>
            <TitleStyled>
              <h4>Title </h4>
              <TextInput state={title} setState={setTitle} />
              {errors.title && <h5>{errors.title}</h5>}
            </TitleStyled>
            <TitleStyled>
              <h4>Property</h4>
              <Input
                value={property.map((item) => item.propertyTitle).join(", ")}
                readOnly
                onClick={() => setPropertyPopUp(true)}
              />
              {errors.property && <h5>{errors.property}</h5>}
            </TitleStyled>
          </MethodStyled>

          <hr />

          <VolumeStyled>
            <div>
              <h4>Maximum quantity</h4>
              <NumberInput state={quantity} setState={setQuantity} placeholder={10} />
              {errors.quantity && <h5>{errors.quantity}</h5>}
            </div>
            <div>
              <h4>Discount percentage</h4>
              <TextInput
                state={discount}
                setState={(value) => {
                  if (Number(value) > 99) {
                    return;
                  }
                  setDiscount(value);
                }}
                placeholder={10}
              />
              {errors.discount && <h5>{errors.discount}</h5>}
            </div>
            <div>
              <h4>Maximum discount price </h4>
              <NumberInput state={maximumPrice} setState={setMaximumPrice} />
              {errors.maximumPrice && <h5>{errors.maximumPrice}</h5>}
            </div>
            <div>
              <h4>Minimum price requirement </h4>
              <NumberInput state={minimumPrice} setState={setMinimumPrice} />
            </div>

            <div>
              <h4>Badge requirement</h4>
              <SelectInput options={badgeOptions} state={badgeOption} setState={setBadgeOption} />
            </div>
            <div>
              <h4>Minimum stay </h4>
              <NumberInput state={minimumStay} setState={setMinimumStay} />
            </div>
          </VolumeStyled>
          <hr />
          <div>
            <h4>Active date (3 days from now)</h4>
            <div>
              <TextInput
                state={startDate}
                setState={setStartDate}
                min={moment(new Date()).add(3, "days").format("YYYY-MM-DD")}
                type={"date"}
              />
            </div>
            <CheckBoxStyled>
              <InputCheckBox
                checked={endOption}
                onChange={() => {
                  if (endOption == true) {
                    setEndDate();
                  }
                  setEndOption((prev) => !prev);
                }}
              />{" "}
              <label>End date</label>
            </CheckBoxStyled>
            {endOption && (
              <div>
                <TextInput min={startDate} state={endDate} setState={setEndDate} type={"date"} />
              </div>
            )}
          </div>
        </Body>
        <hr />
        <Footer>
          <WhiteButton onClick={() => action()}>Cancel</WhiteButton>
          <WhiteButton onClick={onCreateDiscount}>Submit</WhiteButton>
        </Footer>
      </PopUpContainer>
      {propertyPopUp && getHostCalendar.isSuccess && (
        <DiscountListingSelectionPopUp
          action={() => setPropertyPopUp(false)}
          setChosenProperty={setProperty}
          chosenProperty={property}
          listings={getHostCalendar.data.data}
        />
      )}
    </>
  );
}
