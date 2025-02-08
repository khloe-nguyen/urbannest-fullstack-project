import styled from "styled-components";
import PropertyInfo from "./PropertyInfo";
import { useEffect, useState } from "react";
import Checkout from "./Checkout";
import { UserRequest } from "@/shared/api/userApi";

const StyeldContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 3fr;
  column-gap: 2rem;
  margin: 2rem 0 3rem 0;
`;

export default function InforAndCheckout({ data }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [isErrorBadge, setIsErrorBadge] = useState(false);
  const [showErrorBadge, setShowErrorBadge] = useState();
  const user = UserRequest();

  useEffect(() => {
    if (user.isSuccess && user.data.status == 200) {
      if (data.instantBookRequirementID != null) {
        const checkBadge = user.data.data.badgeList.find(
          (badge) => badge.id == data.instantBookRequirementID
        );
        if (!checkBadge) {
          setIsErrorBadge(true);
          if (data.instantBookRequirementID == 1) {
            setShowErrorBadge("<h2>You need to stay at least 5 different locations.</h2>");
          }
          if (data.instantBookRequirementID == 4) {
            setShowErrorBadge(
              <>
                <h2>Please verify your identity to earn the 'Verified User' badge.</h2>
              </>
            );
          }
        }
      }
    }
  }, [data, user]);
  return (
    <StyeldContainer>
      <PropertyInfo data={data} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      {isErrorBadge ? (
        <>{showErrorBadge} </>
      ) : (
        <Checkout data={data} selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
      )}
    </StyeldContainer>
  );
}
