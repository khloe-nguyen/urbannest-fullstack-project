import PopUp from "@/shared/components/PopUp/PopUp";
import styled from "styled-components";
import { FavouriteRequest, CreateFavouriteMutation } from "./api/collectionFavApi";
import { useState } from "react";
import { NewCollectionPopup } from "./NewCollectionPopup";
import { UserRequest } from "@/shared/api/userApi";
import { useSearchParams } from "react-router-dom";

const StylePopUp = styled(PopUp)`
  width: 35rem;
  height: 90vh;
  overflow-y: auto;
  padding: 0;
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
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
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
const StyleCard = styled.div`
  cursor: pointer;
  width: 100%;
  font-size: 0.85rem;
  > img {
    aspect-ratio: 1/1;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 3px gray;
  }
  & p:nth-child(3) {
    color: gray;
  }
`;

const StyleSubmit = styled.div`
  position: sticky; /* Sticky */
  bottom: 0; /* Stick to the bottom of the PopUp */
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  padding: 1.5rem;
  border-top: 1px solid lightgray;
  background-color: white; /* Đảm bảo nền cho phần dính */
  z-index: 2; /* Đảm bảo phần này nằm trên các phần khác */
`;

const StyleCreateButton = styled.div`
  padding: 1rem 1rem;
  border-radius: 10px;
  background-color: black;
  color: white;
  cursor: pointer;
`;

export const CollectionPopUp = ({ properties, propertyId, action }) => {
  const user = UserRequest();
  const favouriteRequest = FavouriteRequest(user?.data?.data?.id);
  const createFavouriteMutation = CreateFavouriteMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPopUp, setIsPopUp] = useState(false);

  const HandleOnClick = (collectionName) => {
    const userId = searchParams.get("userId") || "";
    const propertyId = searchParams.get("propertyId") || "";

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("propertyId", propertyId);
    formData.append("collectionName", collectionName);

    createFavouriteMutation.mutate(formData, {
      onSuccess: () => {
        favouriteRequest.refetch();
        properties.refetch();
        user.refetch();
        action();
      },
      onError: (error) => {},
    });
  };

  const HandleCreate = () => {
    setIsPopUp(true);
    if (user.isSuccess) {
      setSearchParams({ userId: user.data.data.id, propertyId: propertyId });
    }
  };

  return (
    <>
      <StylePopUp action={action}>
        <StyleTitle>Save to wishlist</StyleTitle>
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
                return arr; // return collection arr
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
            <StyleNotFound>You have no wishlist</StyleNotFound>
          )}
        </StyleBody>
        <StyleSubmit>
          {createFavouriteMutation.isSuccess && <p style={{ color: "green" }}>Added success</p>}
          <StyleCreateButton onClick={() => HandleCreate()}>Create new wishlist</StyleCreateButton>
        </StyleSubmit>
      </StylePopUp>
      {isPopUp && (
        <NewCollectionPopup
          properties={properties}
          favouriteRequest={favouriteRequest}
          action={() => setIsPopUp(false)}
        />
      )}
    </>
  );
};
