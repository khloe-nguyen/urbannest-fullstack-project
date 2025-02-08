import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import RedButton from "@/shared/components/Button/RedButton1";
import { GetPropertyReviewRequest, PublicListingRequest } from "../api/createListingApi";
import { UpdatePropertyRequest } from "../api/createListingApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { useQueryClient } from "@tanstack/react-query";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import TextEditor from "@/shared/components/editor/TextEditor";
import PopUp from "@/shared/components/PopUp/PopUp";
import { CiSquareInfo } from "react-icons/ci";
import Avatar from "react-avatar";
import ReactStars from "react-rating-stars-component";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import Pagination from "@/shared/components/Pagination/Pagination";
import BookingDetail from "../../hosting/components/BookingDetail";
import PublicState from "./PublicState";

const Container = styled.div``;

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

const StyledLi = styled.li`
  color: rgba(0, 0, 0, 0.5);
  margin: 1rem 0;
`;

export default function ListingDetailIntro() {
  const [state, dispatch, ACTIONS] = useOutletContext();

  return (
    <Container>
      <Header>
        <h2>Overview</h2>
        <p>Concise summary that provides key information about a real estate property</p>
      </Header>

      <Body>
        <Left>
          {state.status == "ADMIN_DISABLED" && (
            <h2 style={{ color: "red" }}>Your booking being disabled by admin</h2>
          )}
          {state.status == "PROGRESS" && (
            <ProgressState dispatch={dispatch} ACTIONS={ACTIONS} state={state} />
          )}

          {state.status == "DENIED" && (
            <DeniedState dispatch={dispatch} ACTIONS={ACTIONS} state={state} />
          )}

          {state.status == "PENDING" && (
            <PendingState dispatch={dispatch} ACTIONS={ACTIONS} state={state} />
          )}

          {(state.status == "PUBLIC" ||
            state.status == "DISABLED" ||
            state.status == "ADMIN_DISABLED") && (
            <PublicState dispatch={dispatch} ACTIONS={ACTIONS} state={state} />
          )}
        </Left>
        <Right></Right>
      </Body>
    </Container>
  );
}

/* #region   */

function PendingState() {
  return (
    <>
      <div>
        <h3>Property Pending Approval</h3>
        <p>
          Thank you for submitting your property listing! Your listing is currently under review by
          our admin team and is pending approval. During this time, we’ll be verifying the details
          to ensure everything meets our platform’s guidelines.
        </p>
        <p>What’s Next:</p>
        <ul>
          <StyledLi>
            Review Process: Our admin team will review your listing to ensure it complies with all
            necessary policies and requirements.
          </StyledLi>
          <StyledLi>
            Approval or Feedback: Once the review is complete, we’ll notify you if your property is
            approved to go live. If there are any issues, we’ll provide feedback and guide you on
            how to resolve them.
          </StyledLi>
        </ul>
      </div>
    </>
  );
}
/* #endregion */

/* #region DeniedState  */

const ButtonContainerStyled = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: flex-end;
`;

function DeniedState({ state, dispatch, ACTIONS }) {
  const publicListing = PublicListingRequest();
  const queryClient = useQueryClient();
  const user = UserRequest();
  const updateProperty = UpdatePropertyRequest();

  const onPublicRequest = () => {
    if (
      state.refundPolicyId != null &&
      user.data.data.badgeList.find((badge) => badge.name == "Verified User") &&
      state.checkInAfter &&
      state.checkOutBefore &&
      state.basePrice &&
      state.propertyImages.length >= 0 &&
      state.propertyAmenities.length != 0 &&
      state.propertyTitle.length != 0 &&
      state.aboutProperty.length != 0 &&
      state.addressCode != null &&
      state.addressDetail != null &&
      state.coordinatesX != null &&
      state.propertyType != null &&
      state.propertyCategoryID != null &&
      state.maximumGuest != 0 &&
      state.numberOfBathRoom != 0 &&
      state.numberOfBed != 0
    ) {
      const formData = new FormData();

      formData.append("id", state.id);

      formData.append("propertyType", state.propertyType);
      formData.append("propertyTitle", state.propertyTitle);
      formData.append("maximumMonthPreBook", state.maximumMonthPreBook);
      formData.append("bookingType", state.bookingType);
      formData.append("basePrice", state.basePrice);
      formData.append("weeklyDiscount", state.weeklyDiscount);
      formData.append("monthlyDiscount", state.monthlyDiscount);

      if (state.addressCode) {
        formData.append("addressCode", state.addressCode);
      }

      if (state.addressDetail) {
        formData.append("addressDetail", state.addressDetail);
      }

      if (state.checkInAfter) {
        formData.append("checkInAfter", state.checkInAfter);
      }

      if (state.checkOutBefore) {
        formData.append("checkOutBefore", state.checkOutBefore);
      }

      formData.append("maximumGuest", state.maximumGuest);
      formData.append("numberOfBathRoom", state.numberOfBathRoom);
      formData.append("numberOfBedRoom", state.numberOfBedRoom);
      formData.append("numberOfBed", state.numberOfBed);
      formData.append("petAllowed", state.petAllowed);
      formData.append("smokingAllowed", state.smokingAllowed);
      formData.append("additionalRules", state.additionalRules);

      if (state.maximumStay) {
        formData.append("maximumStay", state.maximumStay);
      }

      if (state.minimumStay) {
        formData.append("minimumStay", state.minimumStay);
      }

      formData.append("aboutProperty", state.aboutProperty);
      if (state.guestAccess) {
        formData.append("guestAccess", state.guestAccess);
      }

      if (state.detailToNote) {
        formData.append("detailToNote", state.detailToNote);
      }

      formData.append("selfCheckIn", state.selfCheckIn);

      if (state.selfCheckInType) {
        formData.append("selfCheckInType", state.selfCheckInType);
      }

      if (state.coordinatesX) {
        formData.append("coordinatesX", state.coordinatesX);
        formData.append("coordinatesY", state.coordinatesY);
      }

      formData.append("status", state.status);

      if (state.managedCityId) {
        formData.append("managedCityId", state.managedCityId);
      }

      if (state.refundPolicyId) {
        formData.append("refundPolicyId", state.refundPolicyId);
      }

      formData.append("userId", user.data.data.id);
      formData.append("propertyCategoryID", state.propertyCategoryID);

      if (state.instantBookRequirementID) {
        formData.append("instantBookRequirementID", state.instantBookRequirementID);
      }

      state.propertyImages.forEach((image) => {
        if (typeof image == "string") {
          formData.append("propertyImages", image);
        }
      });

      state.propertyImages.forEach((image) => {
        if (typeof image == "object") {
          formData.append("newImages", image);
        }
      });

      state.propertyAmenities.forEach((amenity) => {
        formData.append("propertyAmenities", amenity);
      });

      updateProperty.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            const formData = new FormData();
            formData.append("propertyID", state.id);
            publicListing.mutate(formData, {
              onSuccess: (response) => {
                if (response.status == 200) {
                  queryClient.invalidateQueries({ queryKey: ["host_listing"] });
                  dispatch({ type: ACTIONS.CHANGE_STATUS, next: "PENDING" });
                }
              },
            });
          }
        },
      });
    }
  };

  if (publicListing.isPending || updateProperty.isPending) {
    return <WaitingPopUp />;
  }
  return (
    <>
      <div>
        <h3>Property Denied - Action Required</h3>
        <p>
          We regret to inform you that your property listing has been denied, to resolve this issue
          and proceed with your listing, we recommend the following steps:
        </p>
        <ul>
          <StyledLi>
            Fix the Issue: Please review the reason(s) for the denial and make the necessary changes
            to your listing. This may include updating photos, correcting descriptions, or providing
            any missing information.
          </StyledLi>
          <StyledLi>
            Resubmit for Review: Once you’ve made the required updates, you can request to publish
            your property again. Simply update your listing and click "Submit for Review" to have it
            re-evaluated
          </StyledLi>
          <StyledLi>
            <Link>Need Help?</Link>: If you’re unsure about how to proceed or need further
            assistance, don’t hesitate to contact our support team. You can message our admin
            directly, and we’ll be happy to guide you through the process
          </StyledLi>
        </ul>

        <ButtonContainerStyled>
          <RedButton
            active={
              state.refundPolicyId != null &&
              user.data.data.badgeList.find((badge) => badge.name == "Verified User") &&
              state.checkInAfter &&
              state.checkOutBefore &&
              state.basePrice &&
              state.propertyImages.length >= 0 &&
              state.propertyAmenities.length != 0 &&
              state.propertyTitle.length != 0 &&
              state.aboutProperty.length != 0 &&
              state.addressCode != null &&
              state.addressDetail != null &&
              state.coordinatesX != null &&
              state.propertyType != null &&
              state.propertyCategoryID != null &&
              state.maximumGuest != 0 &&
              state.numberOfBathRoom != 0 &&
              state.numberOfBed != 0
            }
            onClick={onPublicRequest}
          >
            Request public
          </RedButton>
        </ButtonContainerStyled>
      </div>
    </>
  );
}
/* #endregion */

/* #region ProgressState  */

const RequirementHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    /* background-color: #0091ea; */
    /* color: #ffffff; */
    border-bottom: 3px solid black;
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

function ProgressState({ state, dispatch, ACTIONS }) {
  const queryClient = useQueryClient();
  const [showRequirement, setShowRequirement] = useState(true);
  const publicListing = PublicListingRequest();
  const updateProperty = UpdatePropertyRequest();
  const user = UserRequest();

  const onPublicRequest = () => {
    if (
      state.refundPolicyId != null &&
      user.data.data.badgeList.find((badge) => badge.name == "Verified User") &&
      state.checkInAfter &&
      state.checkOutBefore &&
      state.basePrice &&
      state.propertyImages.length >= 0 &&
      state.propertyAmenities.length != 0 &&
      state.propertyTitle.length != 0 &&
      state.aboutProperty.length != 0 &&
      state.addressCode != null &&
      state.addressDetail != null &&
      state.coordinatesX != null &&
      state.propertyType != null &&
      state.propertyCategoryID != null &&
      state.maximumGuest != 0 &&
      state.numberOfBathRoom != 0 &&
      state.numberOfBed != 0
    ) {
      const formData = new FormData();

      formData.append("id", state.id);
      formData.append("propertyType", state.propertyType);
      formData.append("propertyTitle", state.propertyTitle);
      formData.append("maximumMonthPreBook", state.maximumMonthPreBook);
      formData.append("bookingType", state.bookingType);
      formData.append("basePrice", state.basePrice);
      formData.append("weeklyDiscount", state.weeklyDiscount);
      formData.append("monthlyDiscount", state.monthlyDiscount);

      if (state.addressCode) {
        formData.append("addressCode", state.addressCode);
      }

      if (state.addressDetail) {
        formData.append("addressDetail", state.addressDetail);
      }

      if (state.checkInAfter) {
        formData.append("checkInAfter", state.checkInAfter);
      }

      if (state.checkOutBefore) {
        formData.append("checkOutBefore", state.checkOutBefore);
      }

      formData.append("maximumGuest", state.maximumGuest);
      formData.append("numberOfBathRoom", state.numberOfBathRoom);
      formData.append("numberOfBedRoom", state.numberOfBedRoom);
      formData.append("numberOfBed", state.numberOfBed);
      formData.append("petAllowed", state.petAllowed);
      formData.append("smokingAllowed", state.smokingAllowed);
      formData.append("additionalRules", state.additionalRules);

      if (state.maximumStay) {
        formData.append("maximumStay", state.maximumStay);
      }

      if (state.minimumStay) {
        formData.append("minimumStay", state.minimumStay);
      }

      formData.append("aboutProperty", state.aboutProperty);
      if (state.guestAccess) {
        formData.append("guestAccess", state.guestAccess);
      }

      if (state.detailToNote) {
        formData.append("detailToNote", state.detailToNote);
      }

      formData.append("selfCheckIn", state.selfCheckIn);

      if (state.selfCheckInType) {
        formData.append("selfCheckInType", state.selfCheckInType);
      }

      if (state.coordinatesX) {
        formData.append("coordinatesX", state.coordinatesX);
        formData.append("coordinatesY", state.coordinatesY);
      }

      formData.append("status", state.status);

      if (state.managedCityId) {
        formData.append("managedCityId", state.managedCityId);
      }

      if (state.refundPolicyId) {
        formData.append("refundPolicyId", state.refundPolicyId);
      }

      formData.append("userId", user.data.data.id);
      formData.append("propertyCategoryID", state.propertyCategoryID);

      if (state.instantBookRequirementID) {
        formData.append("instantBookRequirementID", state.instantBookRequirementID);
      }

      if (state.selfCheckIn && state.selfCheckInInstruction) {
        formData.append("selfCheckInInstruction", state.selfCheckInInstruction);
      }

      state.propertyImages.forEach((image) => {
        if (typeof image == "string") {
          formData.append("propertyImages", image);
        }
      });

      state.propertyImages.forEach((image) => {
        if (typeof image == "object") {
          formData.append("newImages", image);
        }
      });

      state.propertyAmenities.forEach((amenity) => {
        formData.append("propertyAmenities", amenity);
      });

      updateProperty.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            const formData = new FormData();
            formData.append("propertyID", state.id);
            publicListing.mutate(formData, {
              onSuccess: (response) => {
                if (response.status == 200) {
                  queryClient.invalidateQueries({ queryKey: ["host_listing"] });
                  dispatch({ type: ACTIONS.CHANGE_STATUS, next: "PENDING" });
                }
              },
            });
          }
        },
      });
    }
  };

  if (publicListing.isPending || updateProperty.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <div>
        <RequirementHeader onClick={() => setShowRequirement((prev) => !prev)}>
          Property public requirement{" "}
          {showRequirement ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
        </RequirementHeader>
        {showRequirement && (
          <TableContent>
            <thead>
              <tr>
                <th>Requirment</th>
              </tr>
            </thead>
            <tbody>
              {!user.data.data.badgeList.find((badge) => badge.name == "Verified User") && (
                <tr>
                  <td>
                    <p>Verify your identity before become a host</p>
                  </td>
                  <td>
                    <Link>show</Link>
                  </td>
                </tr>
              )}
              {(state.propertyType == null || state.propertyCategoryID == null) && (
                <tr>
                  <td>
                    <p>Set up property type and category</p>
                  </td>
                  <td>
                    <Link to={"category"}>show</Link>
                  </td>
                </tr>
              )}
              {(state.maximumGuest == 0 ||
                state.numberOfBathRoom == 0 ||
                state.numberOfBed == 0) && (
                <tr>
                  <td>
                    <p>Set up property basics</p>
                  </td>
                  <td>
                    <Link to={"basic"}>show</Link>
                  </td>
                </tr>
              )}

              {(!state.addressCode || !state.addressDetail || !state.coordinatesX) && (
                <tr>
                  <td>
                    <p>Set up property location</p>
                  </td>
                  <td>
                    <Link to={"location"}>show</Link>
                  </td>
                </tr>
              )}

              {(state.propertyTitle.length == 0 || state.aboutProperty.length == 0) && (
                <tr>
                  <td>
                    <p>Set up property title and about property description</p>
                  </td>
                  <td>
                    <Link to={"detail"}>show</Link>
                  </td>
                </tr>
              )}

              {state.propertyAmenities.length == 0 && (
                <tr>
                  <td>
                    <p>Set up property amenity</p>
                  </td>
                  <td>
                    <Link to={"amenity"}>show</Link>
                  </td>
                </tr>
              )}

              {state.propertyImages.length < 5 && (
                <tr>
                  <td>
                    <p>Set up at least 5 images for this property</p>
                  </td>
                  <td>
                    <Link to={"photo"}>show</Link>
                  </td>
                </tr>
              )}

              {!state.basePrice && (
                <tr>
                  <td>
                    <p>Set up pricing and availability for this property</p>
                  </td>
                  <td>
                    <Link to={"pricing"}>show</Link>
                  </td>
                </tr>
              )}

              {(!state.refundPolicyId || !state.checkInAfter || !state.checkOutBefore) && (
                <tr>
                  <td>
                    <p>Set up policies and rules for this property</p>
                  </td>
                  <td>
                    <Link to={"policy"}>show</Link>
                  </td>
                </tr>
              )}

              {state.selfCheckIn && !state.selfCheckInInstruction && (
                <tr>
                  <td>
                    <p>Set up your self check-in instruction</p>
                  </td>
                  <td>
                    <Link to={"policy"}>show</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </TableContent>
        )}
        <ButtonContainerStyled>
          <RedButton
            onClick={onPublicRequest}
            active={
              state.refundPolicyId != null &&
              user.data.data.badgeList.find((badge) => badge.name == "Verified User") &&
              state.checkInAfter &&
              state.checkOutBefore &&
              state.basePrice &&
              state.propertyImages.length >= 0 &&
              state.propertyAmenities.length != 0 &&
              state.propertyTitle.length != 0 &&
              state.aboutProperty.length != 0 &&
              state.addressCode != null &&
              state.addressDetail != null &&
              state.coordinatesX != null &&
              state.propertyType != null &&
              state.propertyCategoryID != null &&
              state.maximumGuest != 0 &&
              state.numberOfBathRoom != 0 &&
              state.numberOfBed != 0 &&
              (!state.selfCheckIn || state.selfCheckInInstruction)
            }
          >
            Public
          </RedButton>
        </ButtonContainerStyled>
      </div>
    </>
  );
}

/* #endregion */
