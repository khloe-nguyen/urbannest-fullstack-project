import styled, { css } from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import RedButton from "@/shared/components/Button/RedButton1";

const PopUpStyled = styled(PopUp)`
  padding: 0;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  min-width: 30rem;
  border-radius: 25px;
`;

const HeaderStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`;

const BodyStyled = styled.div`
  padding: 1rem;

  max-height: 30rem;

  overflow: auto;
`;

const FooterStyle = styled.div`
  padding: 1rem;

  display: flex;
  justify-content: flex-end;
`;

const ImageContainerStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 9rem;
  gap: 10px;

  > div:nth-of-type(1) {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  > div {
    border: 1px dotted rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${(props) => {
    if (props.$length % 2 == 0) {
      return css`
        > div:nth-of-type(${props.$length}) {
          grid-column: 1 / 3;
          grid-row: ${2 + props.$length / 2} / ${2 + props.$length / 2 + 2};
        }
      `;
    }
  }}
`;

export default function AddImagePopUp({ action, images, sendImageMessage }) {
  return (
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h3>Send Message</h3>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <ImageContainerStyled $length={images.length}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} />
            </div>
          ))}
        </ImageContainerStyled>
      </BodyStyled>
      <hr />
      <FooterStyle>
        <RedButton
          onClick={() => {
            sendImageMessage(`#image(${images.join(",")})`);
            action();
          }}
        >
          Send Message
        </RedButton>
      </FooterStyle>
    </PopUpStyled>
  );
}
