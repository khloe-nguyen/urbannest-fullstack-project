import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  border-radius: 25px;

  text-align: center;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BodyStyled = styled.div`
  padding: 1rem 2rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterStyled = styled.div`
  padding: 1rem;

  display: flex;

  justify-content: flex-end;

  & button {
    width: 100%;
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 15px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const QrCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export default function TripQrCode({ action, qr }) {
  const qrCodeRef = useRef();

  const handleDownload = async () => {
    if (qrCodeRef.current) {
      try {
        // Capture the QR code as an image
        const canvas = await html2canvas(qrCodeRef.current);
        const imageURL = canvas.toDataURL("image/png");

        // Create an anchor element to trigger download
        const link = document.createElement("a");
        link.href = imageURL;
        link.download = "qrcode.png";
        link.click();
      } catch (error) {
        console.error("Error generating QR code image:", error);
      }
    }
  };

  return (
    <>
      <PopUpStyled>
        <HeaderStyled>
          <h4>Your Trip QR Code</h4>
          <XButton action={action} />
        </HeaderStyled>
        <hr />
        <BodyStyled>
          <QrCodeContainer ref={qrCodeRef}>
            <QRCode value={qr} />
          </QrCodeContainer>
          <h3> Let your host scan this code when check-in </h3>
        </BodyStyled>
        <hr />
        <FooterStyled>
          <button onClick={handleDownload}>Download</button>
        </FooterStyled>
      </PopUpStyled>
    </>
  );
}
