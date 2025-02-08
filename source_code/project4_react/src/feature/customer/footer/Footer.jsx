import styled, { css } from "styled-components";
import bct from "@/shared/assets/images/bctpng.png";

const ContainerStyled = styled.div`
  background-color: #f7f7f7;
  font-family: "Arial", sans-serif; /* Make sure you use a modern font */
`;

const TopStyled = styled.div`
  width: 85%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem; /* Adds spacing between the columns */

  padding: 3rem 0;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  > div h4 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
  }

  > div p {
    font-size: 0.875rem;
    color: #555;
    transition: color 0.3s ease;

    &:hover {
      color: #0077cc; /* Change color on hover */
    }
  }

  ${(props) => {
    if (props.$percent) {
      return css`
        width: ${props.$percent};
      `;
    }
  }}
`;

const BottomStyled = styled.div`
  width: 85%;
  margin: auto;
  padding: 3rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #ddd; /* Divider between top and bottom section */
  background-color: #fff; /* Light background to contrast */

  & p {
    font-weight: bold;
    font-size: 0.875rem;
    color: #777;
  }

  > div {
    width: 15rem;
    margin-right: 10rem;
  }

  > div img {
    width: 100%;
    height: auto;
    max-width: 200px;
  }

  ${(props) => {
    if (props.$percent) {
      return css`
        width: ${props.$percent};
      `;
    }
  }}
`;

const FooterLink = styled.p`
  cursor: pointer;
  font-size: 0.875rem;
  color: #555;
  transition: color 0.3s ease;
  &:hover {
    color: #0077cc;
  }
`;

export default function Footer({ percent }) {
  return (
    <ContainerStyled>
      <TopStyled $percent={percent}>
        <div>
          <h4>Support</h4>
          <FooterLink>Help Center</FooterLink>
          <FooterLink>Get help with a safety issue</FooterLink>
          <FooterLink>AirCover</FooterLink>
          <FooterLink>Anti-discrimination</FooterLink>
          <FooterLink>Disability support</FooterLink>
        </div>
        <div>
          <h4>Hosting</h4>
          <FooterLink>UrbanNest your home</FooterLink>
          <FooterLink>AirCover for Hosts</FooterLink>
          <FooterLink>Hosting resources</FooterLink>
          <FooterLink>Community forum</FooterLink>
          <FooterLink>Hosting responsibly</FooterLink>
          <FooterLink>UrbanNest-friendly apartments</FooterLink>
        </div>
        <div>
          <h4>UrbanNest</h4>
          <FooterLink>Newsroom</FooterLink>
          <FooterLink>New features</FooterLink>
          <FooterLink>Careers</FooterLink>
          <FooterLink>Investors</FooterLink>
          <FooterLink>Gift cards</FooterLink>
          <FooterLink>UrbanNest.org emergency stays</FooterLink>
        </div>
      </TopStyled>
      <BottomStyled $percent={percent}>
        <p>© 2024 UrbanNest, Inc.·Terms · Sitemap · Privacy · Your Privacy Choices</p>
        <div>
          <img src={bct} alt="BCT Logo" />
        </div>
      </BottomStyled>
    </ContainerStyled>
  );
}
