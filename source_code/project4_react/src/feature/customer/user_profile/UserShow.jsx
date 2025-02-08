import React, { useEffect, useState } from "react";
import CustomerHeader from "../custome_header/CustomerHeader";
import Footer from "../footer/Footer";
import styled from "styled-components";
import { FaCheck, FaUserCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserRequest } from "@/shared/api/userApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosClient from "@/shared/api/axiosClient";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { UserRefillRequest } from "./UserProfile";
import ChatHeader from "../custome_header/ChatHeader";

const Container = styled.div`
  max-width: 1080px;
  min-height: 712px;
  margin: 2rem auto;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .avatar {
    max-width: 342px;
    height: 230px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    padding: 1rem;

    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;

      img {
        border: 2px solid #ddd;
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }

  .confirmed-information {
    width: 100%;
    border-radius: 8px;
    border: solid thin #ddd;
    background-color: #fff;
    padding: 1rem;

    .badge-list {
      border-bottom: solid thin #ddd;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
  }
`;

const Right = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .reviews-container,
  .properties-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  button {
    cursor: pointer;
    padding: 0.75rem 1.5rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s;

    &:hover {
      background-color: #333;
    }
  }
`;

const VerifyStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & svg {
    font-size: 25px;
  }
`;

export const UserShowRequest = (userId) => {
  const fetchUserShow = async (userId) => {
    const response = await axiosClient.get(`userCM/get_user_personal_info/${userId}`, {});
    return response.data;
  };

  return useQuery({
    queryKey: ["userShow"],
    queryFn: () => fetchUserShow(userId),
    enabled: !!userId,
  });
};

export const UserRefillRequest2 = (userId) => {
  const request = async () => {
    const response = await axiosClient.get(`userCM/userRefill/${userId}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["userRefill2"],
    queryFn: request,
    retry: 0,
  });
};

export default function UserShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const user = UserRequest();
  const userRefill = UserRefillRequest2(id);
  const API_URL = "http://localhost:8080/userCM/userRefill";
  const userShow = UserShowRequest(id);
  const [maxReviewsIndex, setMaxReviewsIndex] = useState(2);
  const [maxPropertiesIndex, setMaxPropertiesIndex] = useState(2);

  const handleAddMoreMaxPropertiesIndex = () => {
    setMaxPropertiesIndex((pre) => pre + 2);
  };
  const handleAddMoreMaxReviewsIndex = () => {
    setMaxReviewsIndex((pre) => pre + 2);
  };
  const calculateHostTime = (userCreatedAt) => {
    const createdAt = new Date(userCreatedAt); // Parse createdAt to Date
    const nowTime = new Date();

    // Calculate the difference in milliseconds
    let timeDifference = nowTime - createdAt;

    // Calculate years
    const years = nowTime.getFullYear() - createdAt.getFullYear();

    // Calculate months
    const months = nowTime.getMonth() + 1 - (createdAt.getMonth() + 1) + years * 12;

    // Remove whole years and months from the time difference
    timeDifference -= years * 365.25 * 24 * 60 * 60 * 1000;
    timeDifference -= months * 30.44 * 24 * 60 * 60 * 1000;

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);

    return { years, months, days, hours, minutes };
  };

  useEffect(() => {
    if (userShow?.data?.status == 404) {
      console.log(true);
      navigate("/");
    }
  }, [userShow.isSuccess]);

  if (userRefill.isLoading || userShow.isLoading) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <ChatHeader padding={"13rem"} />
      <Container>
        <Left>
          <div className="avatar">
            <div className="left">
              <img
                style={{ width: "104px", height: "104px", borderRadius: "50%" }}
                src={userShow?.data?.data?.avatar}
              />
              <div style={{ fontWeight: "bolder", fontSize: "24px" }}>
                {userShow?.data?.data?.preferredName != null &&
                userShow?.data?.data?.preferredName != ""
                  ? userShow?.data?.data?.preferredName
                  : userShow?.data?.data?.firstName}
              </div>
              <div>{userShow.data?.data?.host ? "Host" : "Guest"}</div>
            </div>
            <div className="right">
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    borderBottom: "solid thin black",
                    display: "flex",
                    flexDirection: "column",
                    width: "80px",
                    padding: "8% 0px 8% 0px",
                  }}
                >
                  <h3 style={{ fontWeight: "bolder" }}>
                    {userShow?.data?.data?.listReviews?.length}
                  </h3>
                  <p style={{ fontSize: "10px", fontWeight: "bold" }}>Reviews</p>
                </div>
                <div
                  style={{
                    borderBottom: "solid thin black",
                    display: "flex",
                    flexDirection: "column",
                    width: "80px",
                    padding: "8% 0px 8% 0px",
                  }}
                >
                  <h3 style={{ fontWeight: "bolder" }}>
                    {calculateHostTime(userShow?.data?.data?.createdAt).years}
                  </h3>
                  <p style={{ fontSize: "10px", fontWeight: "bold" }}>Years hosting</p>
                </div>
              </div>
            </div>
          </div>
          <div className="confirmed-information">
            {userShow?.data?.data?.badgeList?.length == 0 ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", margin: "6%" }}>
                  <div style={{ fontSize: "20px", fontWeight: "bolder" }}>
                    {userShow?.data?.data?.preferredName != null &&
                    userShow?.data?.data?.preferredName != ""
                      ? userShow?.data?.data?.preferredName
                      : userShow?.data?.data?.firstName}
                    's confirmed information {userRefill?.data?.data?.progress}/5
                  </div>
                  {userRefill?.data?.data?.message?.map((item, index) => (
                    <div className="badge-list" key={index}>
                      <div
                        style={{
                          margin: "3% 0px 3% 0px",
                          display: "flex",
                          flexDirection: "row",
                          gap: "5%",
                        }}
                      >
                        <FaCheck />
                        <div>{item}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <VerifyStyled>
                <FaUserCheck /> <h4>Verified user</h4>
              </VerifyStyled>
            )}
          </div>
        </Left>
        <Right>
          <h2>
            About{" "}
            {userShow?.data?.data?.preferredName != null &&
            userShow?.data?.data?.preferredName != ""
              ? userShow?.data?.data?.preferredName
              : userShow?.data?.data?.firstName}
          </h2>
          <hr />
          <div className="reviews-container">
            <div
              style={{
                margin: "3% 0px 3% 0px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontWeight: "bolder" }}>
                {userShow?.data?.data?.preferredName != null &&
                userShow?.data?.data?.preferredName != ""
                  ? userShow?.data?.data?.preferredName
                  : userShow?.data?.data?.firstName}
                ’s reviews
              </div>
              <div onClick={() => setMaxReviewsIndex(2)} style={{ cursor: "pointer" }}>
                Cancel
              </div>
            </div>
            <div className="reviews" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {userShow?.data?.data?.listReviews?.map(
                (item, index) =>
                  index < maxReviewsIndex && (
                    <div
                      key={index}
                      style={{
                        minWidth: "343px",
                        minHeight: "226px",
                        border: "solid thin #dddddd",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "20px",
                        margin: "2%",
                      }}
                    >
                      <p>{item?.review}</p>
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <img
                          style={{ width: "48px", height: "48px", borderRadius: "50%" }}
                          src={item?.user?.avatar}
                        />
                        <div
                          style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                        >
                          <div style={{ fontWeight: "bolder" }}>Camile</div>
                          <div style={{ color: "#6a6a6a" }}>October 2024</div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
            <button
              onClick={() => handleAddMoreMaxReviewsIndex()}
              style={{
                backgroundColor: "black",
                borderRadius: "8px",
                color: "white",
                border: "none",
                marginTop: "3%",
              }}
            >
              Show more
            </button>
          </div>
          <hr style={{ margin: "3% 0px 3% 0px" }} />
          <div className="properties-container">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "3% 0px 3% 0px",
              }}
            >
              <div style={{ fontWeight: "bolder" }}>
                {userShow?.data?.data?.preferredName != null &&
                userShow?.data?.data?.preferredName != ""
                  ? userShow?.data?.data?.preferredName
                  : userShow?.data?.data?.firstName}
                's listings
              </div>
              <div onClick={() => setMaxPropertiesIndex(2)} style={{ cursor: "pointer" }}>
                Cancel
              </div>
            </div>
            <div
              className="properties"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
            >
              {userShow?.data?.data?.listProperties?.map(
                (item, index) =>
                  index < maxPropertiesIndex && (
                    <div key={index} style={{ width: "220px" }}>
                      <img
                        style={{
                          width: "220px",
                          height: "220px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                        src={item?.propertyImages[0]}
                        alt=""
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          margin: "3% 0px 3% 0px",
                        }}
                      >
                        <p style={{ fontWeight: "bold" }}>{item?.propertyTitle}</p>
                        <div>{item?.averageRating > 3 ? item?.averageRating + "Star" : ""}</div>
                      </div>
                    </div>
                  )
              )}
            </div>
            <button
              style={{
                backgroundColor: "black",
                borderRadius: "8px",
                color: "white",
                border: "none",
              }}
              onClick={handleAddMoreMaxPropertiesIndex}
            >
              Show more
            </button>
          </div>
        </Right>
      </Container>
      <Footer percent={"74%"} />
    </>
  );
}
