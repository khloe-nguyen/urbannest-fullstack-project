import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import CustomerHeader from "../custome_header/CustomerHeader";
import { IoMdStar, IoMdHeart } from "react-icons/io";
import getWords from "@/shared/utils/getWords";
import { UserRequest } from "@/shared/api/userApi";
import {
  DeleteFavouriteMutation,
  PropertyFavouriteRequest,
} from "../homepage/api/collectionFavApi";
import styled from "styled-components";
import Carousel from "react-multi-carousel";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import dchc from "@/shared/data/dchc";

const StyleContainer = styled.div`
  overflow-y: auto;
  padding: 0;
  height: 100vh;
`;

const StyleTitle = styled.div`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid lightgray;
  position: sticky; /* Đổi thành sticky */
  top: 0; /* Dính vào đầu */
  background-color: white; /* Đảm bảo nền cho phần dính */
  z-index: 2; /* Đảm bảo phần này nằm trên các phần khác */
`;

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

const StyleBody = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 5rem;
  gap: 1rem;
`;

const StyleNotFound = styled.div`
  position: absolute;
  font-size: 2rem;
  transform: translate(-50%, -50%);
  top: 50%; /* Đặt vị trí từ trên xuống 50% */
  left: 50%; /* Đặt vị trí từ trái sang 50% */
  color: lightgray;
  z-index: 1; /* Đảm bảo nó nằm trên các phần tử khác nếu cần */
`;

const StyleBodyItem = styled.div`
  aspect-ratio: 1/1.25;
  display: grid; //important

  border-radius: 10px;

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
  border-radius: 10px;
  aspect-ratio: 1 / 1;
`;
const StyleContent = styled.div`
  display: grid;
  grid-template-columns: 6fr 1fr;
  font-size: 1rem;
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

export default function WishListDetail() {
  const { collectionName } = useParams();
  const navigate = useNavigate();

  const properties = PropertyFavouriteRequest(collectionName);
  const user = UserRequest();
  const deleteFavouriteMutation = DeleteFavouriteMutation();

  const HandleLove = (propertyID) => {
    if (user.data.data != null) {
      const formData = new FormData();
      formData.append("userId", user.data.data.id);
      formData.append("propertyId", propertyID);

      deleteFavouriteMutation.mutateAsync(formData).then((response) => {
        // Kiểm tra statusCode từ phản hồi
        //delete oke
        if (response.status === 204) {
          properties.refetch();
        } else if (response.status === 201) {
          //Not Found To Delete
          properties.refetch();
        }
      });
    }
  };

  return (
    <StyleContainer>
      {/* <CustomerHeader /> */}
      <StyleTitle>{collectionName}</StyleTitle>
      <StyleBody>
        {properties?.data?.data?.length > 0 ? (
          properties.data.data.map((item) => (
            <StyleBodyItem key={item.id}>
              <CarouselStyled
                showDots
                deviceType={"mobile"}
                itemClass="image-item"
                responsive={responsive}
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
              >
                {item.propertyImages.slice(0, 5).map((image) => (
                  <div className="box" key={image.id} style={{ position: "relative" }}>
                    <img onClick={() => navigate("/property_detail/" + item.id)} src={image} />
                    <IoMdHeart
                      style={{
                        position: "absolute",
                        zIndex: "2",
                        right: "10px",
                        top: "10px",
                        color: "red",
                        cursor: "pointer",
                        filter:
                          "drop-shadow(0.1rem 0 white) drop-shadow(-1px 0 white) drop-shadow(0 1px white) drop-shadow(0 -1px white)",
                      }}
                      onClick={() => HandleLove(item.id)}
                    />
                  </div>
                ))}
              </CarouselStyled>
              <StyleContent onClick={() => navigate("/property_detail/" + item.id)}>
                <div>
                  <b>{getWords(item.propertyTitle, 7)}</b>
                  <div>{convertAddressCode(item.addressCode)}</div>
                  <div>
                    $ <b>{item.basePrice}</b>/night
                  </div>
                </div>
                <div>
                  <IoMdStar />
                  <p>4.6</p>
                </div>
              </StyleContent>
            </StyleBodyItem>
          ))
        ) : (
          <StyleNotFound>No Property You Wish</StyleNotFound>
        )}
      </StyleBody>
    </StyleContainer>
  );
}
