import styled from "styled-components";

const ContainerStyled = styled.div`
  background-color: #f7f7f7;
`;

const TopStyled = styled.div`
  max-width: 1120px;
  margin: 2rem auto;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  padding: 2rem 0;
`;

const BottomStyled = styled.div`
  max-width: 1120px;
  margin: 2rem auto;
`;

export default function FooterPropertyDetail() {
  return (
    <ContainerStyled>
      <TopStyled>
        <div>
          <h4>Support</h4>
          <p>Help Center</p>
          <p>Get help with a safety issue</p>
          <p>AirCover</p>
          <p>Anti-discrimination</p>
          <p>Disability support</p>
          <p>Cancellation options</p>
          <p>Report neighborhood concern</p>
        </div>
        <div>
          <h4>Hosting</h4>
          <p>UrbanNest your home</p>
          <p>AirCover for Hosts</p>
          <p>Hosting resources</p>
          <p>Community forum</p>
          <p>Hosting responsibly</p>
          <p>UrbanNest-friendly apartments</p>
          <p>Join a free Hosting class</p>
          <p>Find a co‑host</p>
        </div>
        <div>
          <h4>UrbanNest</h4>
          <p>Newsroom</p>
          <p>New features</p>
          <p>Careers</p>
          <p>Investors</p>
          <p>Gift cards</p>
          <p>UrbanNest.org emergency stays</p>
        </div>
      </TopStyled>
      <BottomStyled>
        <p>© 2024 Airbnb, Inc.·TermsSitemapPrivacyYour Privacy Choices</p>
      </BottomStyled>
    </ContainerStyled>
  );
}
