import { useEffect, useState } from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import logo from "@/shared/assets/images/logo.svg";
import WhiteButton from "@/shared/components/Button/WhiteButton";
import { InitializeListingRequest } from "./api/createListingApi";
import { useLocation } from "react-router-dom";
import ListingSidebar from "./components/ListingSidebar";
import { GetHostListingById } from "./api/createListingApi";
import { useParams } from "react-router-dom";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { Link } from "react-router-dom";
import useListing from "./hooks/useListing";
import { UpdatePropertyRequest } from "./api/createListingApi";
import { UserRequest } from "@/shared/api/userApi";
import { useNavigate } from "react-router-dom";
import CreateListingHeader from "./components/CreateListingHeader";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  background-color: white;
`;

const OutletContainerInitial = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OutletContainerDetail = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  padding: 3rem 3rem;
`;

const Image = styled.div`
  width: 45px;
  cursor: pointer;
`;

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
`;

const CustomLink = styled(Link)`
  color: red;
`;

const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
`;

const ButtonContainer = styled.div``;

export default function CreateListing() {
  const user = UserRequest();
  const [state, dispatch, ACTIONS] = useListing();
  let location = useLocation();
  const initializeListing = InitializeListingRequest();
  let { listing_id } = useParams();
  const getHostListingById = GetHostListingById(listing_id);
  const updateProperty = UpdatePropertyRequest();
  const [isLoadAllDataDone, setIsLoadAllDataDone] = useState(false);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (getHostListingById.isSuccess && getHostListingById.data.status == 200) {
      const data = getHostListingById.data.data;
      dispatch({ type: ACTIONS.CHANGE_ID, next: data.id });
      dispatch({ type: ACTIONS.CHANGE_PROPERTY_TYPE, next: data.propertyType });
      dispatch({
        type: ACTIONS.CHANGE_PROPERTY_TITLE,
        next: data.propertyTitle != null ? data.propertyTitle : "",
      });
      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK, next: data.maximumMonthPreBook });
      dispatch({ type: ACTIONS.CHANGE_BOOKING_TYPE, next: data.bookingType });
      dispatch({ type: ACTIONS.CHANGE_BASE_PRICE, next: data.basePrice });
      dispatch({ type: ACTIONS.CHANGE_WEEKLY_DISCOUNT, next: data.weeklyDiscount });
      dispatch({ type: ACTIONS.CHANGE_MONTHLY_DISCOUNT, next: data.monthlyDiscount });
      dispatch({
        type: ACTIONS.CHANGE_ADDRESS_CODE,
        next: data.addressCode,
      });
      dispatch({
        type: ACTIONS.CHANGE_ADDRESS_DETAIL,
        next: data.addressDetail,
      });

      dispatch({ type: ACTIONS.CHANGE_CHECK_IN_AFTER, next: data.checkInAfter });
      dispatch({ type: ACTIONS.CHANGE_CHECK_OUT_BEFORE, next: data.checkOutBefore });
      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_GUEST, next: data.maximumGuest });
      dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BATHROOM, next: data.numberOfBathRoom });
      dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BEDROOM, next: data.numberOfBedRoom });
      dispatch({ type: ACTIONS.CHANGE_NUMBER_OF_BED, next: data.numberOfBed });
      dispatch({ type: ACTIONS.CHANGE_ADDITIONAL_RULES, next: data.additionalRules });
      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_STAY, next: data.maximumStay });
      dispatch({
        type: ACTIONS.CHANGE_ABOUT_PROPERTY,
        next: data.aboutProperty != null ? data.aboutProperty : "",
      });
      dispatch({ type: ACTIONS.CHANGE_GUEST_ACCESS, next: data.guestAccess });
      dispatch({ type: ACTIONS.CHANGE_DETAIL_TO_NOTE, next: data.detailToNote });

      dispatch({ type: ACTIONS.CHANGE_COORDINATES_X, next: data.coordinatesX });
      dispatch({ type: ACTIONS.CHANGE_COORDINATES_Y, next: data.coordinatesY });
      dispatch({ type: ACTIONS.CHANGE_STATUS, next: data.status });
      dispatch({ type: ACTIONS.CHANGE_MANAGED_CITY_ID, next: data.managedCityId });
      dispatch({ type: ACTIONS.CHANGE_REFUND_POLICY_ID, next: data.refundPolicyId });
      dispatch({ type: ACTIONS.CHANGE_USER_ID, next: data.userId });
      dispatch({ type: ACTIONS.CHANGE_PROPERTY_CATEGORY_ID, next: data.propertyCategoryID });
      dispatch({
        type: ACTIONS.CHANGE_INSTANT_BOOK_REQUIREMENT_ID,
        next: data.instantBookRequirementID,
      });
      dispatch({ type: ACTIONS.CHANGE_PROPERTY_IMAGES, next: data.propertyImages });
      dispatch({ type: ACTIONS.CHANGE_PROPERTY_AMENITIES, next: data.propertyAmenities });
      dispatch({ type: ACTIONS.CHANGE_PET_ALLOWED, next: data.petAllowed });
      dispatch({ type: ACTIONS.CHANGE_SMOKING_ALLOWED, next: data.smokingAllowed });
      dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN, next: data.selfCheckIn });
      dispatch({ type: ACTIONS.CHANGE_SELF_CHECK_IN_TYPE, next: data.selfCheckInType });
      dispatch({ type: ACTIONS.CHANGE_MINIMUM_STAY, next: data.minimumStay });
      dispatch({ type: ACTIONS.CHANGE_MAXIMUM_STAY, next: data.maximumStay });
      dispatch({
        type: ACTIONS.CHANGE_SELF_CHECK_IN_INSTRUCTION,
        next: data.selfCheckInInstruction,
      });
      setIsLoadAllDataDone(true);
    }
  }, [getHostListingById.isSuccess]);

  const onInitializeListing = () => {
    initializeListing.mutate(
      {},
      {
        onSuccess: (response) => {
          if (response.status == 200) {
            navigate(`${response.data}/category`);
          }
        },
      }
    );
  };

  if (getHostListingById.isLoading) {
    return <WaitingPopUp />;
  }

  if (listing_id != null && getHostListingById.isSuccess && getHostListingById.data.status == 404) {
    return (
      <ErrorContainer>
        <h1>
          Oops, something went wrong.<CustomLink to={"/"}> Return to homepage</CustomLink>
        </h1>
      </ErrorContainer>
    );
  }

  const onUpdateProperty = () => {
    let isOk = true;

    if (state.status != "PROGRESS") {
      const errors = [];
      if (!state.propertyTitle) {
        isOk = false;
        errors.push(<h4>Title cannot be empty</h4>);
      }

      if (state.propertyAmenities.length == 0) {
        isOk = false;
        errors.push(<h4>Amenity cannot be empty</h4>);
      }

      if (state.propertyImages.length < 5) {
        isOk = false;
        errors.push(<h4>Image must be more or equal 5</h4>);
      }

      if (!state.basePrice) {
        isOk = false;
        errors.push(<h4>Base price cannot be empty</h4>);
      }
      if (!state.refundPolicyId) {
        isOk = false;
        errors.push(<h4>You need to set refund policy</h4>);
      }

      if (!state.checkInAfter) {
        isOk = false;
        errors.push(<h4>Check in hour cannot be empty</h4>);
      }

      if (!state.checkOutBefore) {
        isOk = false;
        errors.push(<h4>Check out hour cannot be empty</h4>);
      }

      if (!state.aboutProperty) {
        isOk = false;
        errors.push(<h4>About property cannot be empty</h4>);
      }

      setError(errors);
    }

    if (isOk || state.status == "PROGRESS") {
      const formData = new FormData();

      formData.append("id", state.id);

      formData.append("propertyType", state.propertyType);
      formData.append("propertyTitle", state.propertyTitle);
      formData.append("maximumMonthPreBook", state.maximumMonthPreBook);

      formData.append("bookingType", state.bookingType);

      if (state.bookingType == "instant" && state.instantBookRequirementID) {
        formData.append("instantBookRequirementID", state.instantBookRequirementID);
      }

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

      if (state.selfCheckIn && state.selfCheckInInstruction) {
        formData.append("selfCheckInInstruction", state.selfCheckInInstruction);
      }

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
            getHostListingById.refetch();
            navigate("/hosting/listing");
          }
        },
      });
    }
  };

  if (updateProperty.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <Header>
          <Image onClick={() => navigate("/hosting")}>
            <img src={logo} />
          </Image>
          {location.pathname == "/become_a_host" ? (
            <ButtonContainer>
              <WhiteButton onClick={onInitializeListing}>Create new listing</WhiteButton>
            </ButtonContainer>
          ) : (
            <ButtonContainer>
              <WhiteButton onClick={onUpdateProperty}>Save and Exit</WhiteButton>
            </ButtonContainer>
          )}
        </Header>

        {location.pathname == "/become_a_host" && (
          <OutletContainerInitial>
            <Outlet />
          </OutletContainerInitial>
        )}

        {isLoadAllDataDone && (
          <>
            <CreateListingHeader state={state} listing={getHostListingById} />
            <OutletContainerDetail>
              <SidebarContainer>
                <ListingSidebar state={state} listing={getHostListingById} />
              </SidebarContainer>
              <Outlet context={[state, dispatch, ACTIONS]} />
            </OutletContainerDetail>
          </>
        )}
      </Container>
      {error.length != 0 && <ErrorPopUp message={error} action={() => setError([])} />}
    </>
  );
}
