import PopUpContainer from "@/shared/components/PopUp/giu/PopUpContainer";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import getWords from "@/shared/utils/getWords";
import { useState } from "react";
import styled from "styled-components";
import Avatar from "react-avatar";
import dchc from "@/shared/data/dchc";
import CalendarBook from "./CalendarBook";
import { LuDot } from "react-icons/lu";
import { CategoriesRequest } from "@/shared/api/categoryClientApi";
import moment from "moment";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 2.5rem;
`;
const StyledContainerTypeAndAddress = styled.div``;
const StyledTypeAndAdress = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const StyledPopup = styled(PopUpContainer)`
  top: 0;
  left: 0;
  width: 800px;
  height: 38rem;
  transform: translate(50%, 4rem);
  overflow-y: scroll;
`;
const StyledPopupContainer = styled.div`
  padding: 1rem;
`;
const StyledOffer = styled.div`
  font-size: 26px;
  font-weight: 600;
  padding-top: 3rem;
`;
const Styledbutton = styled.button`
  width: 40px;
  height: 40px;
  margin: 1rem;
  border: none;
  border-radius: 50%;
`;

const StyledImageIcon = styled.img`
  width: 2.3rem;
`;

const StyledContainerUser = styled.div`
  display: flex;
  column-gap: 1rem;
  justify-content: start;
  align-items: center;
  font-size: 14px;
  .usernanme {
    font-weight: 600;
    font-size: 18px;
  }
`;
const StyledAmenityMap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const StyledContainerAmenity = styled.div`
  > h3 {
    margin-bottom: 0.7rem;
    font-size: 22px;
    font-weight: 600;
  }
`;
const StyledButtonAmenity = styled.button`
  font-size: 17px;
  padding: 0.7rem 1.2rem;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  background-color: white;
  font-weight: 600;
  cursor: pointer;
  margin: 1rem 0;

  &:hover {
    background-color: rgba(226, 228, 230, 0.3);
  }
  &:active {
    transform: scale(0.9);
  }
`;

const StyledGroupNameAndImage = styled.div`
  display: flex;
  margin: 0.5rem 0;
  column-gap: 1.5rem;
  align-items: center;
`;
const StyledPopupContent = styled.div`
  > div:first-child {
    font-size: 2.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;
const StyledContainerAbout = styled.div`
  > h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;
const StyledContainerShowDatesBook = styled.div`
  > p {
    font-weight: 600;
    font-size: 22px;
  }
`;
const StyledDatesChange = styled.div`
  margin: 0 0 1rem 0;
  display: flex;
  font-size: 15px;
  justify-content: flex-start;
  column-gap: 0.5rem;
  align-items: center;
  color: rgba(0, 0, 0, 0.5);
`;
const StyledShow = styled.div`
  font-size: 15px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
`;
const StyledCollectionContainer = styled.div`
  margin: 1rem 0;
`;

const StyledCollectionHeader = styled.h4`
  font-size: 22px;
  font-weight: 600;
  margin: 2rem 0 0 0;
`;

const StyledCollectionItems = styled.div``;
const StyledGroupAmenityAndIcon = styled.div`
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.7rem 0 0.3rem 0;
`;
const StyledContainerInfo = styled.div`
  display: flex;
  justify-content: stretch;
  align-items: center;
`;

const StyledBookingType = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 8px;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.8);
  background-color: #f7f7f7;
  padding: 10px 20px;
  line-height: 2;
`;

export default function PropertyInfo({ data, selectedDates, setSelectedDates }) {
  const categories = CategoriesRequest();
  const [clickShowAbout, setClickShowAbout] = useState(false);
  const [showAmenity, setShowAmenity] = useState(false);
  const convertAddressCode = () => {
    var addrressArr = data.addressCode.split("_");
    const tempProvince = dchc.data.find((city) => city.level1_id == addrressArr[0]);
    const tempDistrict = tempProvince.level2s.find(
      (district) => district.level2_id == addrressArr[1]
    );
    const tempWard = tempDistrict.level3s.find((ward) => ward.level3_id == addrressArr[2]);
    return [tempWard.name, tempDistrict.name, tempProvince.name];
  };

  const calculateHostTime = () => {
    const createdAt = new Date(data.createdAt);
    const nowTime = new Date();
    let timeDifference = nowTime - createdAt;
    const years = nowTime.getFullYear() - createdAt.getFullYear();
    const months = nowTime.getMonth() + 1 - (createdAt.getMonth() + 1) + years * 12;

    timeDifference -= years * 365.25 * 24 * 60 * 60 * 1000;
    timeDifference -= months * 30.44 * 24 * 60 * 60 * 1000;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    return { years, months, days, hours, minutes };
  };

  const timeSinceCreated = calculateHostTime();
  const calculateDaysBetween = (start_day, end_day) => {
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return Math.floor(daysDifference) + 1;
  };

  const address = convertAddressCode();
  const getTypeAmenity = () => {
    const listType = new Set();
    data.amenity.forEach((amenity) => {
      listType.add(amenity.type);
    });
    return [...listType];
  };
  const listTypeAmenity = getTypeAmenity();

  return (
    <StyledContainer>
      <StyledContainerTypeAndAddress>
        <StyledTypeAndAdress>
          {
            categories.data.data.find((category) => category.id == data.propertyCategoryID)
              .categoryName
          }
          {" in " + address[0] + ", " + address[1] + ", " + address[2]}
        </StyledTypeAndAdress>
        <StyledContainerInfo>
          {data.maximumGuest + " guest "}
          <LuDot />
          {data.numberOfBedRoom + " bedroom "}
          <LuDot />

          {data.numberOfBed + " bed "}
          <LuDot />

          {data.numberOfBathRoom + " bath "}
        </StyledContainerInfo>
      </StyledContainerTypeAndAddress>
      <StyledContainerUser>
        <div>
          <Avatar
            src={data.user.avatar}
            size="50px"
            textSizeRatio={2}
            round={true}
            name={data.user.firstName}
          />
        </div>
        <div>
          <div className="usernanme">
            {data.user.firstName} {data.user.lastName}
          </div>
          <p>
            {timeSinceCreated.years < 1
              ? timeSinceCreated.months < 1
                ? "New host"
                : `${timeSinceCreated.months} months hosting`
              : `${timeSinceCreated.years} years hosting`}
          </p>
        </div>
      </StyledContainerUser>
      <StyledBookingType>
        <h4>
          You can {data.bookingType == "reserved" ? "reserve" : "instantly reserve"} the property
          <h4>Maximum guest: {data.maximumGuest}</h4>
        </h4>
        <div>
          {data.minimumStay && <h4>Minimum stay: {data.minimumStay}</h4>}
          {data.maximumStay && <h4>Maximum stay: {data.maximumStay}</h4>}
        </div>
      </StyledBookingType>
      {
        <StyledContainerAmenity>
          <h3>What this place offers</h3>
          <StyledAmenityMap>
            {data.amenity.map((amenity, index) => {
              if (index < 10) {
                return (
                  <StyledGroupNameAndImage key={index}>
                    <div>
                      <StyledImageIcon src={amenity.image} alt="" />
                    </div>
                    <div>{amenity.name}</div>
                  </StyledGroupNameAndImage>
                );
              }
            })}
          </StyledAmenityMap>
          <StyledButtonAmenity
            onClick={() => {
              setShowAmenity(true);
            }}
          >
            Show all {data.propertyAmenities.length} amenities
          </StyledButtonAmenity>
        </StyledContainerAmenity>
      }
      {showAmenity && (
        <StyledPopup setShowPopUp={setShowAmenity}>
          <StyledPopupContainer>
            <div>
              <Styledbutton onClick={() => setShowAmenity(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </Styledbutton>
            </div>
            <div>
              <StyledOffer>What this place offers</StyledOffer>
              {listTypeAmenity.map((type, index) => (
                <StyledCollectionContainer key={index}>
                  <StyledCollectionHeader>{type}</StyledCollectionHeader>
                  <StyledCollectionItems>
                    {data.amenity
                      .filter((amenity) => amenity.type === type)
                      .map((amenity, index) => (
                        <StyledGroupAmenityAndIcon key={index}>
                          <StyledImageIcon src={amenity.image} alt={amenity.name} />
                          <div>{amenity.name}</div>
                        </StyledGroupAmenityAndIcon>
                      ))}
                  </StyledCollectionItems>
                </StyledCollectionContainer>
              ))}
            </div>
          </StyledPopupContainer>
        </StyledPopup>
      )}
      {clickShowAbout && (
        <StyledPopup setShowPopUp={setClickShowAbout}>
          <StyledPopupContainer>
            <div>
              <Styledbutton onClick={() => setClickShowAbout(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </Styledbutton>
            </div>

            <StyledPopupContent className="containerText">
              <div>About of place</div>
              <div dangerouslySetInnerHTML={{ __html: data.aboutProperty }} />
            </StyledPopupContent>
            {data.guestAccess && (
              <StyledPopupContent className="containerText">
                <div>Guess access</div>
                <div dangerouslySetInnerHTML={{ __html: data.guestAccess }} />
              </StyledPopupContent>
            )}
            {data.detailToNote && (
              <StyledPopupContent className="containerText">
                <div>Other things to note</div>
                <div dangerouslySetInnerHTML={{ __html: data.detailToNote }} />
              </StyledPopupContent>
            )}
          </StyledPopupContainer>
        </StyledPopup>
      )}
      <StyledContainerAbout>
        <h3>About this space</h3>
        <p>
          <div
            dangerouslySetInnerHTML={{
              __html: getWords(data.aboutProperty, 70),
            }}
          />
        </p>

        <StyledShow
          onClick={() => {
            setClickShowAbout(true);
          }}
        >
          Show more...
        </StyledShow>
      </StyledContainerAbout>
      <div>
        {selectedDates[0] != null && selectedDates[1] != null && (
          <StyledContainerShowDatesBook>
            <p>
              {calculateDaysBetween(selectedDates[0], selectedDates[1])} nights in {address[1]},{" "}
              {address[2]}
            </p>

            <StyledDatesChange>
              <div>
                <div>{formatDate(selectedDates[0])}</div>
              </div>
              <p>-</p>
              <div>
                <div>{formatDate(moment(selectedDates[1]).add(1, "days"))}</div>
              </div>
            </StyledDatesChange>
          </StyledContainerShowDatesBook>
        )}

        <CalendarBook
          data={data}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </div>
    </StyledContainer>
  );
}
