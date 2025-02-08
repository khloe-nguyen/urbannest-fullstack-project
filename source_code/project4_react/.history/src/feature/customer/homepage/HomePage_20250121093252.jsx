import styled from "styled-components";
import CustomerHeader from "../custome_header/CustomerHeader";
import { FilterBar } from "./FilterBar";
import { PropertiesRequest } from "./api/propertyClientApi";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { IoMdStar } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategoriesRequest } from "../../../shared/api/categoryClientApi";
import dchc from "@/shared/data/dchc";
import { CollectionPopUp } from "./CollectionPopUp";
import getWords from "@/shared/utils/getWords";
import { UserRequest } from "@/shared/api/userApi";
import RegisterPopUp from "../custome_header/components/RegisterPopUp";
import { DeleteFavouriteMutation } from "./api/collectionFavApi";
import { useInView } from "react-intersection-observer";
import formatDollar from "@/shared/utils/FormatDollar";
import moment from "moment";
import { MdFavoriteBorder, MdOutlineFavorite } from "react-icons/md";
import { ItemSkeleton } from "./ItemSkeleton";

//npm install react-multi-carousel --save

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const StyleContainer = styled.div`
  background-color: white;
`;

const StyleHeaderContainer = styled.div`
  /* padding: 0 5rem; */
  position: relative;

  /* border-bottom: 1px solid rgba(0, 0, 0, 0.1); */
`;

const StyleBody = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 5rem;
  gap: 1.5rem;
  /* margin-top: 2rem; */
`;

const StyleBodyItem = styled.div`
  aspect-ratio: 1/1.25;
  display: grid; //important

  border-radius: 15px;

  & .box {
    width: 100%;
    height: 100%;
    background-color: pink;
  }

  & img {
    display: block;
    aspect-ratio: 1; //quan trong !!!
  }
  :hover {
    & .custom-left-arrow,
    .custom-right-arrow {
      opacity: 1;
    }
  }
  & .custom-left-arrow,
  .custom-right-arrow {
    opacity: 0;
  }
`;

const CarouselStyled = styled(Carousel)`
  border-radius: 15px;
  aspect-ratio: 1 / 1;
`;
const StyleContent = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr;
  font-size: 0.9rem;
  overflow: hidden; /* Ẩn phần thừa */
  white-space: nowrap; /* Không cho dòng xuống */
  text-overflow: ellipsis; /* Thêm dấu "..." */

  & > div:nth-child(1) {
    display: block; /* Đảm bảo tiêu đề là một block */
    width: 100%; /* Giới hạn chiều rộng của tiêu đề */
    overflow: hidden; /* Ẩn phần thừa */
    white-space: nowrap; /* Không cho dòng xuống */
    text-overflow: ellipsis; /* Thêm dấu "..." */
    & div:nth-child(2) {
      color: gray;
    }
    font-size: 17px;
  }
  //CSS rating
  & > div:nth-child(2) {
    display: flex;
    justify-content: end;
    align-items: start;
    > div {
      display: flex;
      align-items: center;
    }
  }
`;

const convertAddressCode = (addressCode) => {
  var addrressArr = addressCode.split("_");
  const tempProvince = dchc.data.find((city) => city.level1_id == addrressArr[0]);
  const tempDistrict = tempProvince.level2s.find(
    (district) => district.level2_id == addrressArr[1]
  );
  const tempWard = tempDistrict.level3s.find((ward) => ward.level3_id == addrressArr[2]);
  return [tempDistrict.name + ", " + tempProvince.name];
};

const CustomLeftArrow = ({ onClick }) => (
  <div
    className="custom-left-arrow"
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      left: "10px",
      backgroundColor: "#fff",
      padding: "5px",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    }}
  >
    <GrFormPrevious />
  </div>
);

// Custom Right Arrow Component
const CustomRightArrow = ({ onClick }) => (
  <div
    className="custom-right-arrow"
    onClick={onClick}
    style={{
      position: "absolute",
      top: "50%",
      right: "10px",
      backgroundColor: "#fff",
      padding: "5px",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    }}
  >
    <GrFormNext />
  </div>
);

export default function HomePage() {
  //Call CATE API
  const categoriesRequest = CategoriesRequest();
  //Call User API
  const user = UserRequest();
  const deleteFavouriteMutation = DeleteFavouriteMutation();
  const [categoryId, setCategoryId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [propertyId, setPropertyId] = useState(null);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isLoginPopUp, setIsLoginPopUp] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [isInstant, setIsInstant] = useState(null);
  const [isPetAllow, setIsPetAllow] = useState(null);
  const [isSelfCheckin, setIsSelfCheckin] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState([0, 100000]);
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [selectedBed, setSelectedBed] = useState(1);
  const [selectedBathRoom, setSelectedBathRoom] = useState(1);
  const [guest, setGuest] = useState(4);
  const [selectedDates, setSelectedDates] = useState([]);
  const [chosenProvince, setChosenProvince] = useState(null);
  const [chosenDistrict, setChosenDistrict] = useState(null);
  const [chosenWard, setChosenWard] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState();

  //Call main API
  const properties = PropertiesRequest(
    categoryId,
    selectedPropertyType,
    selectedAmenity,
    isInstant,
    isSelfCheckin,
    isPetAllow,
    selectedPrice,
    selectedRoom,
    selectedBed,
    selectedBathRoom,
    guest,
    chosenProvince?.value,
    chosenDistrict?.value,
    chosenWard?.value,
    selectedDates[0] ? moment(selectedDates[0]).format("YYYY-MM-DD") : null,
    selectedDates[0] ? moment(selectedDates[1]).add(1, "days").format("YYYY-MM-DD") : null,
    name
  );

  const HandleLove = (propertyID) => {
    //check login or not
    if (user.data.data != null) {
      const formData = new FormData();
      formData.append("userId", user.data.data.id);
      formData.append("propertyId", propertyID);

      deleteFavouriteMutation.mutateAsync(formData).then((response) => {
        // Kiểm tra statusCode từ phản hồi
        if (response.status === 204) {
          properties.refetch();
          user.refetch();
        } else if (response.status === 201) {
          setIsPopUp(true);
          setPropertyId(propertyID);
          setSearchParams({
            propertyId: propertyID,
            userId: user.data.data.id,
          });
          user.refetch();
        }
      });
    } else {
      setIsLoginPopUp(true);
    }
  };

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      if (properties.hasNextPage) {
        properties.fetchNextPage();
      }
    }
  }, [entry]);

  return (
    <StyleContainer>
      <StyleHeaderContainer>
        <CustomerHeader
          {...{
            properties,
            setGuest,
            selectedDates,
            setSelectedDates,
            chosenProvince,
            setChosenProvince,
            chosenDistrict,
            setChosenDistrict,
            chosenWard,
            setChosenWard,
            categoryId,
            setCategoryId,
            selectedAmenity,
            setSelectedAmenity,
            selectedPropertyType,
            setSelectedPropertyType,
            isInstant,
            isPetAllow,
            isSelfCheckin,
            setIsInstant,
            setIsPetAllow,
            setIsSelfCheckin,
            selectedPrice,
            setSelectedPrice,
            selectedRoom,
            setSelectedRoom,
            selectedBed,
            setSelectedBed,
            selectedBathRoom,
            setSelectedBathRoom,
            name,
            setName,
          }}
        />
      </StyleHeaderContainer>
      {/* 
      {properties.isLoading && (
        <StyleBody>
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
          <ItemSkeleton />
        </StyleBody>
      )} */}

      <StyleBody>
        {properties.isSuccess &&
          properties.data.pages.map((page) => {
            return page.data.map((item) => {
              return (
                <StyleBodyItem key={item.id}>
                  <CarouselStyled
                    showDots
                    deviceType={"mobile"}
                    itemClass="image-item"
                    responsive={responsive}
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                  >
                    {item.propertyImages.slice(0, 5).map((image) => {
                      return (
                        <div className="box" key={image.id} style={{ position: "relative" }}>
                          <img
                            onClick={() => navigate(`/property_detail/${item.id}`)}
                            src={image}
                          />
                          {user?.data?.data?.id &&
                          user.data.data.propertyFavouriteIds.find((fav) => fav == item.id) ? (
                            <MdOutlineFavorite
                              onClick={() => HandleLove(item.id)}
                              style={{
                                position: "absolute",
                                zIndex: "2",
                                right: "10px",
                                top: "10px",
                                fontSize: "25px",
                                color: "red",
                                cursor: "pointer",
                                filter:
                                  "drop-shadow(0.1rem 0 white) drop-shadow(-1px 0 white) drop-shadow(0 1px white) drop-shadow(0 -1px white)",
                              }}
                            />
                          ) : (
                            <MdFavoriteBorder
                              onClick={() => HandleLove(item.id)}
                              style={{
                                position: "absolute",
                                zIndex: "2",
                                right: "10px",
                                top: "10px",
                                fontSize: "25px",
                                color: "white",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </CarouselStyled>
                  <StyleContent>
                    <div>
                      <div>
                        <b>{getWords(item.propertyTitle, 7)}</b>
                      </div>
                      <div>{convertAddressCode(item.addressCode)}</div>
                      <div>
                        $ <b>{item.basePrice}</b> /night
                      </div>
                    </div>
                    <div>
                      <div>
                        <IoMdStar />
                        <p>{item.averageRating != "NaN" ? formatDollar(item.averageRating) : 0}</p>
                      </div>
                    </div>
                  </StyleContent>
                </StyleBodyItem>
              );
            });
          })}

        {properties.isFetchingNextPage && (
          <>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </>
        )}
        <div ref={ref} style={{ color: "white" }}>
          _____
        </div>
      </StyleBody>
      {isPopUp && (
        <CollectionPopUp {...{ properties, propertyId, action: () => setIsPopUp(false) }} />
      )}
      {isLoginPopUp && <RegisterPopUp {...{ action: () => setIsLoginPopUp(false) }} />}
    </StyleContainer>
  );
}
