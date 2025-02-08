import { useReducer } from "react";

export default function useListing() {
  const ACTIONS = {
    CHANGE_ID: "CHANGE_ID",
    CHANGE_PROPERTY_TYPE: "CHANGE_PROPERTY_TYPE",
    CHANGE_PROPERTY_TITLE: "CHANGE_PROPERTY_TITLE",
    CHANGE_MAXIMUM_MONTH_PREBOOK: "CHANGE_MAXIMUM_MONTH_PREBOOK",
    CHANGE_BOOKING_TYPE: "CHANGE_BOOKING_TYPE",
    CHANGE_BASE_PRICE: "CHANGE_BASE_PRICE",
    CHANGE_WEEKLY_DISCOUNT: "CHANGE_WEEKLY_DISCOUNT",
    CHANGE_MONTHLY_DISCOUNT: "CHANGE_MONTHLY_DISCOUNT",
    CHANGE_ADDRESS_CODE: "CHANGE_ADDRESS_CODE",
    CHANGE_ADDRESS_DETAIL: "CHANGE_ADDRESS_DETAIL",
    CHANGE_CHECK_IN_AFTER: "CHANGE_CHECK_IN_AFTER",
    CHANGE_CHECK_OUT_BEFORE: "CHANGE_CHECK_OUT_BEFORE",
    CHANGE_MAXIMUM_GUEST: "CHANGE_MAXIMUM_GUEST",
    CHANGE_NUMBER_OF_BATHROOM: "CHANGE_NUMBER_OF_BATHROOM",
    CHANGE_NUMBER_OF_BEDROOM: "CHANGE_NUMBER_OF_BEDROOM",
    CHANGE_NUMBER_OF_BED: "CHANGE_NUMBER_OF_BED",
    CHANGE_ADDITIONAL_RULES: "CHANGE_ADDITIONAL_RULES",
    CHANGE_MAXIMUM_STAY: "CHANGE_MAXIMUM_STAY",
    CHANGE_MINIMUM_STAY: "CHANGE_MINIMUM_STAY",
    CHANGE_ABOUT_PROPERTY: "CHANGE_ABOUT_PROPERTY",
    CHANGE_GUEST_ACCESS: "CHANGE_GUEST_ACCESS",
    CHANGE_DETAIL_TO_NOTE: "CHANGE_DETAIL_TO_NOTE",
    CHANGE_COORDINATES_X: "CHANGE_COORDINATES_X",
    CHANGE_COORDINATES_Y: "CHANGE_COORDINATES_Y",
    CHANGE_STATUS: "CHANGE_STATUS",
    CHANGE_MANAGED_CITY_ID: "CHANGE_MANAGED_CITY_ID",
    CHANGE_REFUND_POLICY_ID: "CHANGE_REFUND_POLICY_ID",
    CHANGE_USER_ID: "CHANGE_USER_ID",
    CHANGE_PROPERTY_CATEGORY_ID: "CHANGE_PROPERTY_CATEGORY_ID",
    CHANGE_INSTANT_BOOK_REQUIREMENT_ID: "CHANGE_INSTANT_BOOK_REQUIREMENT_ID",
    CHANGE_PROPERTY_IMAGES: "CHANGE_PROPERTY_IMAGES",
    CHANGE_PROPERTY_AMENITIES: "CHANGE_PROPERTY_AMENITIES",
    CHANGE_PET_ALLOWED: "CHANGE_PET_ALLOWED",
    CHANGE_SMOKING_ALLOWED: "CHANGE_SMOKING_ALLOWED",
    CHANGE_SELF_CHECK_IN: "CHANGE_SELF_CHECK_IN",
    CHANGE_SELF_CHECK_IN_TYPE: "CHANGE_SELF_CHECK_IN_TYPE",
    CHANGE_SELF_CHECK_IN_INSTRUCTION: "CHANGE_SELF_CHECK_IN_INSTRUCTION",
  };

  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.CHANGE_ID:
        return { ...state, id: action.next };
      case ACTIONS.CHANGE_PROPERTY_TYPE:
        return { ...state, propertyType: action.next };
      case ACTIONS.CHANGE_PROPERTY_TITLE:
        return { ...state, propertyTitle: action.next };
      case ACTIONS.CHANGE_MAXIMUM_MONTH_PREBOOK:
        return { ...state, maximumMonthPreBook: action.next };
      case ACTIONS.CHANGE_BOOKING_TYPE:
        return { ...state, bookingType: action.next };
      case ACTIONS.CHANGE_BASE_PRICE:
        return { ...state, basePrice: action.next };
      case ACTIONS.CHANGE_WEEKLY_DISCOUNT:
        return { ...state, weeklyDiscount: action.next };
      case ACTIONS.CHANGE_MONTHLY_DISCOUNT:
        return { ...state, monthlyDiscount: action.next };
      case ACTIONS.CHANGE_ADDRESS_CODE:
        return { ...state, addressCode: action.next };
      case ACTIONS.CHANGE_ADDRESS_DETAIL:
        return { ...state, addressDetail: action.next };
      case ACTIONS.CHANGE_CHECK_IN_AFTER:
        return { ...state, checkInAfter: action.next };
      case ACTIONS.CHANGE_CHECK_OUT_BEFORE:
        return { ...state, checkOutBefore: action.next };
      case ACTIONS.CHANGE_MAXIMUM_GUEST:
        return { ...state, maximumGuest: action.next };
      case ACTIONS.CHANGE_NUMBER_OF_BATHROOM:
        return { ...state, numberOfBathRoom: action.next };
      case ACTIONS.CHANGE_NUMBER_OF_BEDROOM:
        return { ...state, numberOfBedRoom: action.next };
      case ACTIONS.CHANGE_NUMBER_OF_BED:
        return { ...state, numberOfBed: action.next };
      case ACTIONS.CHANGE_ADDITIONAL_RULES:
        return { ...state, additionalRules: action.next };
      case ACTIONS.CHANGE_MAXIMUM_STAY:
        return { ...state, maximumStay: action.next };
      case ACTIONS.CHANGE_MINIMUM_STAY:
        return { ...state, minimumStay: action.next };
      case ACTIONS.CHANGE_ABOUT_PROPERTY:
        return { ...state, aboutProperty: action.next };
      case ACTIONS.CHANGE_GUEST_ACCESS:
        return { ...state, guestAccess: action.next };
      case ACTIONS.CHANGE_DETAIL_TO_NOTE:
        return { ...state, detailToNote: action.next };
      case ACTIONS.CHANGE_COORDINATES_X:
        return { ...state, coordinatesX: action.next };
      case ACTIONS.CHANGE_COORDINATES_Y:
        return { ...state, coordinatesY: action.next };
      case ACTIONS.CHANGE_STATUS:
        return { ...state, status: action.next };
      case ACTIONS.CHANGE_MANAGED_CITY_ID:
        return { ...state, managedCityId: action.next };
      case ACTIONS.CHANGE_REFUND_POLICY_ID:
        return { ...state, refundPolicyId: action.next };
      case ACTIONS.CHANGE_USER_ID:
        return { ...state, userId: action.next };
      case ACTIONS.CHANGE_PROPERTY_CATEGORY_ID:
        return { ...state, propertyCategoryID: action.next };
      case ACTIONS.CHANGE_INSTANT_BOOK_REQUIREMENT_ID:
        return { ...state, instantBookRequirementID: action.next };
      case ACTIONS.CHANGE_PROPERTY_IMAGES:
        return { ...state, propertyImages: action.next };
      case ACTIONS.CHANGE_PROPERTY_AMENITIES:
        return { ...state, propertyAmenities: action.next };
      case ACTIONS.CHANGE_PET_ALLOWED:
        return { ...state, petAllowed: action.next };
      case ACTIONS.CHANGE_SMOKING_ALLOWED:
        return { ...state, smokingAllowed: action.next };
      case ACTIONS.CHANGE_SELF_CHECK_IN:
        return { ...state, selfCheckIn: action.next };
      case ACTIONS.CHANGE_SELF_CHECK_IN_TYPE:
        return { ...state, selfCheckInType: action.next };
      case ACTIONS.CHANGE_SELF_CHECK_IN_INSTRUCTION:
        return { ...state, selfCheckInInstruction: action.next };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    id: null,
    propertyType: null,
    propertyTitle: "",
    maximumMonthPreBook: 0,
    bookingType: null,
    basePrice: 0,
    weeklyDiscount: 0,
    monthlyDiscount: 0,
    addressCode: "",
    addressDetail: "",
    checkInAfter: null,
    checkOutBefore: null,
    maximumGuest: 1,
    numberOfBathRoom: 1,
    numberOfBedRoom: 1,
    numberOfBed: 1,
    additionalRules: null,
    maximumStay: null,
    minimumStay: null,
    aboutProperty: "",
    guestAccess: "",
    detailToNote: "",
    coordinatesX: null,
    coordinatesY: null,
    status: null,
    managedCityId: null,
    refundPolicyId: null,
    userId: null,
    propertyCategoryID: null,
    instantBookRequirementID: null,
    propertyImages: [],
    propertyAmenities: [],
    petAllowed: null,
    smokingAllowed: null,
    selfCheckIn: null,
    selfCheckInType: null,
    selfCheckInInstruction: null,
  });

  return [state, dispatch, ACTIONS];
}
