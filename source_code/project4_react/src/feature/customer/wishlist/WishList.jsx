import React, { useEffect } from "react";
import styled from "styled-components";

import { UserRequest } from "@/shared/api/userApi";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FavouriteRequest } from "../homepage/api/collectionFavApi";

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

const StyleBody = styled.div`
  padding: 0 2rem;
  flex-grow: 1; //Allow body to take up remaining space
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;
const StyleCard = styled.div`
  cursor: pointer;
  width: 90%;
  margin: 0 auto;
  aspect-ratio: 1/1.25;
  font-size: 1rem;
  > img {
    aspect-ratio: 1/1;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 3px gray;
  }
  & p:nth-child(3) {
    color: gray;
  }
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

const WishList = () => {
  const location = useLocation();
  const { properties } = location.state || {};
  console.log(properties);
  const user = UserRequest();
  const favouriteRequest = FavouriteRequest(user?.data?.data?.id);
  const navigate = useNavigate();

  const HandleOnClick = (collectionName) => {
    navigate(`/wishlist/wishlist-detail/${collectionName}`);
  };

  return (
    <>
      {/* <CustomerHeader /> */}
      <StyleContainer>
        <StyleTitle>Your wishlists</StyleTitle>
        <StyleBody>
          {favouriteRequest.isSuccess && favouriteRequest.data.data.length > 0 ? (
            favouriteRequest.data.data
              .reduce((arr, item) => {
                const existingColl = arr.find(
                  (coll) => coll.collectionName === item.collectionName
                );
                if (existingColl) {
                  existingColl.count += 1; // Increment the count
                } else {
                  arr.push({
                    collectionName: item.collectionName,
                    count: 1,
                    firstImage: item.propertyImage, // Store the first image
                  });
                }
                return arr; //return collection arr
              }, [])
              .map((collection, index) => (
                <StyleCard key={index} onClick={() => HandleOnClick(collection.collectionName)}>
                  <img src={collection.firstImage} alt="" />
                  <p>
                    <b>{collection.collectionName}</b>
                  </p>
                  <p>{collection.count} saved</p>
                </StyleCard>
              ))
          ) : (
            <StyleNotFound>No Wishlist To Show</StyleNotFound>
          )}
        </StyleBody>
      </StyleContainer>
    </>
  );
};
export default WishList;
