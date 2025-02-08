import { useState } from "react";
import styled from "styled-components";
import bedimage from "@/feature/customer/create_listing/assets/da2e1a40-a92b-449e-8575-d8208cc5d409.webp";
import desk from "@/feature/customer/create_listing/assets/bfc0bc89-58cb-4525-a26e-7b23b750ee00.webp";
import door from "@/feature/customer/create_listing/assets/c0634c73-9109-4710-8968-3e927df1191c.webp";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  height: 100%;
  gap: 1rem;
  flex: 1;
  padding: 0 3rem;
`;

const Left = styled.div`
  h1 {
    font-size: 70px;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;

  > div:nth-of-type(2) {
    width: 120px;

    & img {
      width: 100%;
      height: 100%;
    }
  }

  & p {
    font-size: 20px;
  }
`;

export default function CreateListingInitial() {
  return (
    <Container>
      <Left>
        <h1>It’s easy to get started on Urban Nest</h1>
      </Left>
      <Right>
        <Item>
          <div>
            <h2>Tell us about your place</h2>
            <p>Share some basic info, such as where it is and how many guests can stay.</p>
          </div>
          <div>
            <img src={bedimage} />
          </div>
        </Item>

        <Item>
          <div>
            <h2>Make it stand out</h2>
            <p>Add 5 or more photos plus a title and description – we’ll help you out.</p>
          </div>
          <div>
            <img src={desk} />
          </div>
        </Item>

        <Item>
          <div>
            <h2>Finish up and publish</h2>
            <p>Choose a starting price, verify a few details, then publish your listing.</p>
          </div>
          <div>
            <img src={door} />
          </div>
        </Item>
      </Right>
    </Container>
  );
}
