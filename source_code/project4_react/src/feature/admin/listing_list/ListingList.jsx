import styled from "styled-components";
import { useState } from "react";
import { GetListingListRequest } from "./api/listingListApi";
import SelectInput from "@/shared/components/Input/SelectInput";
import TextInput from "@/shared/components/Input/TextInput";
import Pagination from "@/shared/components/Pagination/Pagination";
import Avatar from "react-avatar";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa6";
import { FaStarHalfStroke } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";
import dchc from "@/shared/data/dchc";
import { PiLightningFill } from "react-icons/pi";
import { PiLightningSlashBold } from "react-icons/pi";
import { MdKey } from "react-icons/md";
import { MdKeyOff } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa"; // FontAwesome Shield icon
import { FaHourglassHalf } from "react-icons/fa";
import { useRef } from "react";
import { Link } from "react-router-dom";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { VscSettings } from "react-icons/vsc";
import TextThrottleInput from "@/shared/components/Input/TextThrottleInput";
import { FaSort } from "react-icons/fa";
import { useEffect } from "react";
import { IoMailOpen } from "react-icons/io5";
import getWords from "@/shared/utils/getWords";
import { AmenityAdminRequest } from "@/shared/api/amenityAdminApi";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import { useSearchParams } from "react-router-dom";
import PropertyStatusPopUp from "./components/PropertyStatusPopUp";
import { MdCancelPresentation } from "react-icons/md";
import { AdminCategoryRequest } from "@/shared/api/categoryAdminApi";
import { AdminRequest } from "@/shared/api/adminApi";
import PropertyDetailReviewPopUp from "../admin_property_detail/components/PropertyDetailReviewPopUp";

/* #region styled */
const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: max-content;
  font-size: 0.9em;
  overflow: visible;

  thead tr {
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

const Filter = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  justify-content: space-between;

  > div:nth-of-type(2) {
    display: flex;
    gap: 1rem;
  }

  > div:nth-of-type(1) {
    display: flex;
    gap: 1rem;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 8rem;
  width: 100%;
`;

const PropertyColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;

const ActionStyled = styled.div`
  display: flex;
  gap: 10px;

  & a {
    color: #551a8b;
  }

  & a:hover {
    color: red;
  }
`;

const ButtonStyled = styled.button`
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: black;
  color: white;
  font-weight: 700;

  border: 1px solid rgba(0, 0, 0, 0.5);

  &:active {
    transform: scale(0.9);
  }
`;

const ExportStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 1rem;

  > button:nth-of-type(1) {
    background-color: black;
    color: white;
  }

  > button {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: white;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    cursor: pointer;
    gap: 5px;
    font-weight: 600;
  }

  > button:active {
    transform: scale(0.9);
  }
`;

const CustomTextInput = styled(TextThrottleInput)`
  width: 20rem;
`;

const FilterButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const FilterContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 40rem;

  /* display: flex;
  flex-direction: column;
  gap: 1rem; */

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  transform: translateY(1rem);

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const MailContainerStyled = styled.div`
  position: absolute;
  background-color: white;
  z-index: 1;
  padding: 1rem 2rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 25px;
  width: 20rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  transform: translateY(1rem);

  > div {
    display: flex;
    flex-direction: column;
  }

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    gap: 10px;

    background-color: black;
    color: white;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const FilterStyled = styled.div`
  position: relative;
`;

const StyledCheckBox = styled.div`
  width: fit-content;
`;

const MessageStyled = styled.div`
  position: relative;
`;

const MessageButtonStyled = styled.button`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  gap: 10px;

  & svg {
    font-size: 20px;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const TypeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & h4 {
    font-size: 16px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const BookingTypeStyled = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  svg {
    color: yellow !important;
    font-size: 25px;
  }
`;
const UserColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const TableContainerStyled = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & span {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }

  svg {
    color: #ea5e66 !important;
    font-size: 25px;
  }
`;

const ButtonContainerStyled = styled.div`
  position: relative;
`;

const SortButtonStyled = styled.button`
  background-color: white;
  display: flex;
  align-items: center;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  background-color: black;
  color: white;
  cursor: pointer;
  gap: 10px;

  &:active {
    transform: scale(0.9);
  }
`;

const SortContainerStyled = styled.div`
  position: relative;
`;

const SortDropDownStyled = styled.div`
  z-index: 1;
  position: absolute;
  width: 19rem;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  transform: translate(-4.5rem, 10px);
  background-color: white;
  padding: 1rem;
  transform: translate(-15rem, 10px);

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AmenityListStyled = styled.p`
  width: 20rem;
`;
/* #endregion */

/* #region option */
const optionStatus = [
  { label: "All", value: "all" },
  { label: "Public", value: "PUBLIC" },
  { label: "Pending", value: "PENDING" },
  { label: "Disabled", value: "DISABLED" },
  { label: "Admin Disabled", value: "ADMIN_DISABLED" },
  { label: "Denied", value: "DENIED" },
];

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionColumn = [
  { label: "Show Type", value: "type" },
  { label: "Show Location", value: "location" },
  { label: "Show Book", value: "book" },
  { label: "Show Check-In Type", value: "check" },
  { label: "Show Amenity", value: "amenity" },
  { label: "Show Refund", value: "refund" },
];

const bookOption = [
  { label: "All", value: "All" },
  { label: "Instant book", value: "instant" },
  { label: "Reserved book", value: "reserved" },
];

const checkInType = [
  { label: "Self check-in", value: true },
  { label: "Host chech-in", value: false },
];

/* #endregion */

export default function ListingList() {
  const adminRequest = AdminRequest();
  const adminCategory = AdminCategoryRequest();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [actionDropDown, setActionDropDown] = useState();
  const [search, setSearch] = useState(
    searchParams.get("property") ? searchParams.get("property") : ""
  );
  const [isSort, setIsSort] = useState(false);
  const [showColumn, setShowColumn] = useState([]);
  const sortButtonRef = useRef();
  const sortDropDownRef = useRef();
  const [checkBox, setCheckBox] = useState([]);
  const [isMail, setIsMail] = useState(false);
  const mailContainerRef = useRef();
  const mailButtonRef = useRef();
  const filterContainerRef = useRef();
  const filterButtonRef = useRef();
  const [isFilter, setIsFilter] = useState(false);
  const [hostSearch, setHostSearch] = useState(
    searchParams.get("host") ? searchParams.get("host") : ""
  );
  const [isReviewPopUp, setIsReviewPopUp] = useState();
  const [filterBookOption, setFilterBookOption] = useState(bookOption[0]);
  const amenityAdmin = AmenityAdminRequest();
  const managedCityAdmin = ManagedCityAdminRequest();
  const [amenitySearch, setAmenitySearch] = useState(
    searchParams.get("amenity")
      ? searchParams
          .get("amenity")
          .split(",")
          .map((item) => Number(item))
      : []
  );
  const [categorySearch, setCategorySearch] = useState(
    searchParams.get("category")
      ? searchParams
          .get("category")
          .split(",")
          .map((item) => Number(item))
      : []
  );
  const [citySearch, setCitySearch] = useState(
    searchParams.get("city")
      ? searchParams
          .get("city")
          .split(",")
          .map((item) => Number(item))
      : []
  );
  const [status, setStatus] = useState(optionStatus[0]);
  const [statusPopUp, setStatusPopUp] = useState();

  const getListingList = GetListingListRequest(
    currentPage - 1,
    totalPage.value,
    status.value,
    search,
    hostSearch,
    filterBookOption.value,
    citySearch,
    amenitySearch,
    categorySearch
  );

  useEffect(() => {
    const event = (ev) => {
      if (
        filterContainerRef.current &&
        !filterButtonRef.current.contains(ev.target) &&
        !filterContainerRef.current.contains(ev.target)
      ) {
        setIsFilter(false);
      }

      if (
        sortDropDownRef.current &&
        !sortDropDownRef.current.contains(ev.target) &&
        !sortButtonRef.current.contains(ev.target)
      ) {
        setIsSort(false);
      }

      if (
        mailContainerRef.current &&
        !mailButtonRef.current.contains(ev.target) &&
        !mailContainerRef.current.contains(ev.target)
      ) {
        setIsMail(false);
      }
    };

    document.addEventListener("mousedown", event);

    return () => {
      document.removeEventListener("mousedown", event);
    };
  }, []);

  useEffect(() => {
    setCheckBox([]);
  }, [currentPage]);

  return (
    <>
      <Container>
        <Filter>
          <div>
            <FilterStyled>
              <FilterButtonStyled
                ref={filterButtonRef}
                onClick={() => setIsFilter((prev) => !prev)}
              >
                Filter <VscSettings />
              </FilterButtonStyled>
              {isFilter && (
                <FilterContainerStyled ref={filterContainerRef}>
                  <div>
                    <h4>Filter host</h4>
                    <TextThrottleInput
                      state={hostSearch}
                      setState={(value) => {
                        setSearchParams({ host: value });
                        setHostSearch(value);
                      }}
                      placeholder={"Search for host by name, email"}
                    />
                  </div>
                  <div>
                    <h4>Instant book</h4>
                    <SelectInput
                      state={filterBookOption}
                      setState={setFilterBookOption}
                      options={bookOption}
                    />
                  </div>
                  <div>
                    <h4>Location</h4>
                    <SelectInput
                      state={
                        managedCityAdmin.isSuccess &&
                        managedCityAdmin.data.data
                          .filter((city) => citySearch?.includes(city.id))
                          .map((city) => {
                            return { label: city.cityName, value: city.id };
                          })
                      }
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set("city", value.map((item) => item.value).join(","));
                          return newSearchParams; // Return the new object
                        });
                        setCitySearch(value.map((item) => item.value));
                      }}
                      isMulti={true}
                      options={
                        managedCityAdmin.isSuccess &&
                        managedCityAdmin.data.data.map((city) => {
                          return { label: city.cityName, value: city.id };
                        })
                      }
                    />
                  </div>
                  <div>
                    <h4>Amenity</h4>
                    <SelectInput
                      state={
                        amenityAdmin.isSuccess &&
                        amenityAdmin.data.data
                          .filter((amenity) => amenitySearch?.includes(amenity.id))
                          .map((amenity) => {
                            return { label: amenity.name, value: amenity.id };
                          })
                      }
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set("amenity", value.map((item) => item.value).join(","));
                          return newSearchParams; // Return the new object
                        });
                        setAmenitySearch(value.map((item) => item.value));
                      }}
                      isMulti={true}
                      options={
                        amenityAdmin.isSuccess &&
                        amenityAdmin.data.data.map((amenity) => {
                          return { label: amenity.name, value: amenity.id };
                        })
                      }
                    />
                  </div>
                  <div>
                    <h4>Category</h4>
                    <SelectInput
                      state={
                        adminCategory.isSuccess &&
                        adminCategory.data.data
                          .filter((category) => categorySearch?.includes(category.id))
                          .map((category) => {
                            return { label: category.categoryName, value: category.id };
                          })
                      }
                      setState={(value) => {
                        setSearchParams((prev) => {
                          const newSearchParams = new URLSearchParams(prev); // Create a new instance
                          newSearchParams.set(
                            "category",
                            value.map((item) => item.value).join(",")
                          );
                          return newSearchParams; // Return the new object
                        });
                        setCategorySearch(value.map((item) => item.value));
                      }}
                      isMulti={true}
                      options={
                        adminCategory.isSuccess &&
                        adminCategory.data.data.map((category) => {
                          return { label: category.categoryName, value: category.id };
                        })
                      }
                    />
                  </div>
                </FilterContainerStyled>
              )}
            </FilterStyled>

            <MessageStyled>
              <MessageButtonStyled ref={mailButtonRef} onClick={() => setIsMail((prev) => !prev)}>
                Send mail <IoMailOpen />
              </MessageButtonStyled>
              {isMail && (
                <MailContainerStyled ref={mailContainerRef}>
                  <div>
                    <button>Send all</button>
                  </div>
                  {checkBox.length != 0 && (
                    <div>
                      <button>Send Selected</button>
                    </div>
                  )}
                </MailContainerStyled>
              )}
            </MessageStyled>
          </div>
          <div>
            <CustomTextInput
              placeholder={"Search for email and name"}
              state={search}
              setState={(value) => {
                setSearchParams({ property: value });
                setSearch(value);
              }}
            />
            <SortContainerStyled>
              <SortButtonStyled ref={sortButtonRef} onClick={() => setIsSort((prev) => !prev)}>
                Sort <FaSort />
              </SortButtonStyled>
              {isSort && (
                <SortDropDownStyled ref={sortDropDownRef}>
                  <div>
                    <h4>Page size</h4>
                    <CustomSelectInput
                      state={totalPage}
                      setState={setTotalPage}
                      options={optionsPage}
                    />
                  </div>
                  <div>
                    <h4>View column</h4>
                    <CustomSelectInput
                      setState={setShowColumn}
                      options={optionColumn}
                      isMulti={true}
                      state={showColumn}
                    />
                  </div>
                  <div>
                    <h4>Status</h4>
                    <CustomSelectInput setState={setStatus} options={optionStatus} state={status} />
                  </div>
                </SortDropDownStyled>
              )}
            </SortContainerStyled>
          </div>
        </Filter>
        <TableContainerStyled>
          <TableContent>
            <thead>
              <tr>
                <th>
                  <InputCheckBox
                    onChange={() => {
                      if (getListingList.isSuccess) {
                        if (checkBox.length == getListingList.data.data.length) {
                          setCheckBox([]);
                        } else {
                          const newCheckList = [];
                          getListingList.data.data.forEach((item) => newCheckList.push(item.id));
                          setCheckBox([...newCheckList]);
                        }
                      }
                    }}
                    checked={
                      getListingList.isSuccess && checkBox.length == getListingList.data.data.length
                    }
                  />
                </th>
                <th>PROPERTY</th>
                <th>HOST</th>
                {showColumn.find((column) => column.value == "type") && <th>TYPE</th>}
                {showColumn.find((column) => column.value == "location") && <th>LOCATION</th>}
                {showColumn.find((column) => column.value == "book") && <th>INSTANT BOOK</th>}
                {showColumn.find((column) => column.value == "check") && <th>SELF CHECK-IN</th>}
                {showColumn.find((column) => column.value == "refund") && <td>REFUND POLICY</td>}
                {showColumn.find((column) => column.value == "amenity") && <th>AMENITY</th>}
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {getListingList.isSuccess &&
                getListingList.data.data.map((listing, index) => {
                  let province;
                  let district;

                  if (listing.addressCode) {
                    province = dchc.data.find(
                      (dchcProvince) => dchcProvince.level1_id == listing.addressCode.split("_")[0]
                    );
                    district = province.level2s.find(
                      (dchcDistrict) => dchcDistrict.level2_id == listing.addressCode.split("_")[1]
                    );
                  }
                  return (
                    <tr key={index}>
                      <td>
                        <InputCheckBox
                          checked={checkBox.find((check) => check == listing.id)}
                          onChange={() => {
                            if (checkBox.find((check) => check == listing.id)) {
                              setCheckBox(checkBox.filter((item) => item != listing.id));
                            } else {
                              const newList = [...checkBox, listing.id];
                              setCheckBox(newList);
                            }
                          }}
                        />
                      </td>
                      <td>
                        <PropertyColumn>
                          <div>
                            <Avatar round={12} size="80" src={listing.propertyImages[0]} />
                          </div>
                          <div>
                            <h4>{getWords(listing.propertyTitle, 3)}</h4>
                            <ReactStars
                              edit={false}
                              onChange={() => {}}
                              size={20}
                              count={5}
                              color="black"
                              activeColor="#FFD700"
                              value={listing.totalScore}
                              isHalf={true}
                              emptyIcon={<FaRegStar />}
                              halfIcon={<FaStarHalfStroke />}
                              filledIcon={<FaStar />}
                            />
                            <p onClick={() => setIsReviewPopUp(listing.id)}>
                              ({listing.totalReview})reviews
                            </p>
                          </div>
                        </PropertyColumn>
                      </td>
                      <td>
                        <UserColumn>
                          <div>
                            <Avatar
                              name={listing.user.firstName}
                              round
                              size="80"
                              src={listing.user.avatar}
                            />
                          </div>
                          <div>
                            <h4>{listing.user.email}</h4>
                            <p>
                              {listing.user.firstName} {listing.user.lastName}
                            </p>
                          </div>
                        </UserColumn>
                      </td>
                      {showColumn.find((column) => column.value == "type") && (
                        <td>
                          <TypeColumn>
                            <h4>{listing.propertyType == "fullhouse" && "Full house"}</h4>
                            <p>Category: {listing.propertyCategory.categoryName}</p>
                          </TypeColumn>
                        </td>
                      )}
                      {showColumn.find((column) => column.value == "location") && (
                        <td>
                          <p>
                            {district.name}, {province.name}
                          </p>
                        </td>
                      )}
                      {showColumn.find((column) => column.value == "book") && (
                        <td>
                          <BookingTypeStyled>
                            {listing.bookingType == "instant" ? (
                              <>
                                <PiLightningFill />
                                <p>On</p>
                              </>
                            ) : (
                              <>
                                <PiLightningSlashBold />
                                <p>Off</p>
                              </>
                            )}
                          </BookingTypeStyled>
                        </td>
                      )}
                      {showColumn.find((column) => column.value == "check") && (
                        <td>
                          <BookingTypeStyled>
                            {listing.selfCheckIn == true ? (
                              <>
                                <MdKey />
                                <p>On</p>
                              </>
                            ) : (
                              <>
                                <MdKeyOff />
                                <p>Off</p>
                              </>
                            )}
                          </BookingTypeStyled>
                        </td>
                      )}
                      {showColumn.find((column) => column.value == "refund") && (
                        <td>{listing.refund.policyName}</td>
                      )}
                      {showColumn.find((column) => column.value == "amenity") && (
                        <td>
                          <AmenityListStyled>
                            {listing.propertyAmenities.map((amenity) => amenity.name).join(", ")}
                          </AmenityListStyled>
                        </td>
                      )}
                      <td>
                        {listing.status == "PUBLIC" && (
                          <StatusStyled>
                            <FaGlobe /> <span>Public</span>
                          </StatusStyled>
                        )}

                        {listing.status == "DISABLED" && (
                          <StatusStyled>
                            <FaBan /> <span>Disabled</span>
                          </StatusStyled>
                        )}

                        {listing.status == "ADMIN_DISABLED" && (
                          <StatusStyled>
                            <FaShieldAlt /> <span>Admin Disabled</span>
                          </StatusStyled>
                        )}

                        {listing.status == "DENIED" && (
                          <StatusStyled>
                            <MdCancelPresentation /> <span>Denied</span>
                          </StatusStyled>
                        )}

                        {listing.status == "PENDING" && (
                          <StatusStyled>
                            <FaHourglassHalf /> <span>Pending</span>
                          </StatusStyled>
                        )}
                      </td>
                      <td>
                        {" "}
                        <ActionStyled>
                          <Link to={"/admin/admin_property_detail/" + listing.id}>Detail</Link>
                          {adminRequest.data.data.roles.find(
                            (role) => role.roleName == "ADMIN" || role.roleName == "USER_MANAGEMENT"
                          ) && (
                            <Link to={"/admin/user_list?search=" + listing.user.email}>Host</Link>
                          )}
                          {adminRequest.data.data.roles.find(
                            (role) =>
                              role.roleName == "ADMIN" || role.roleName == "BOOKING_MANAGEMENT"
                          ) && (
                            <Link to={"/admin/booking_list?property=" + listing.id}>
                              View booking
                            </Link>
                          )}
                          <Link onClick={() => setStatusPopUp(listing)}>Status</Link>
                        </ActionStyled>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </TableContent>
        </TableContainerStyled>
        <Footer>
          {getListingList.isSuccess && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={getListingList.data.totalPages}
            />
          )}
        </Footer>
      </Container>
      {statusPopUp && (
        <PropertyStatusPopUp
          request={getListingList}
          listing={statusPopUp}
          action={() => setStatusPopUp()}
        />
      )}

      {isReviewPopUp && (
        <PropertyDetailReviewPopUp propertyId={isReviewPopUp} action={() => setIsReviewPopUp()} />
      )}
    </>
  );
}
