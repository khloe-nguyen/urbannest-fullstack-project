import PopUp from "./PopUp";
import { useState } from "react";
import XButton from "../Button/XButton";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import Button1 from "../Button/Button1";
import { useMemo } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import throttle from "lodash/throttle";

const CustomPopUp = styled(PopUp)`
  margin: 0;
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  > span:nth-of-type(2) {
    font-weight: 600;
  }
`;

const Content = styled.div`
  .controls {
    margin: 1rem 1rem;
    > input {
      width: 100%;
    }
  }
`;

const CropperContainer = styled.div`
  position: relative;
  width: 30rem;
  height: 30rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
  padding-bottom: 10px;
`;

function blobToFile(blob, fileName) {
  return new File([blob], fileName, {
    type: "image/jpeg", // You can also use "image/png" depending on your format
  });
}

export default function CropImagePopUp({ action, image, onSuccess, aspect }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(URL.createObjectURL(image), croppedAreaPixels);
      const croppedImageFile = blobToFile(croppedImageBlob, "croppedImage.jpg"); // Assign a name with extension
      onSuccess(croppedImageFile);
      action();
    } catch (e) {
      console.error(e);
    }
  };

  const imageUrl = useMemo(() => URL.createObjectURL(image), [image]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleZoomChange = useCallback(
    throttle((newZoom) => {
      setZoom(newZoom);
    }, 100),
    []
  );

  return (
    <CustomPopUp action={() => {}}>
      <Header>
        <span></span>
        <span>Crop Image</span>
        <XButton action={action} />
      </Header>
      <Content>
        <CropperContainer>
          <Cropper
            image={URL.createObjectURL(image)}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={handleZoomChange}
          />
        </CropperContainer>

        <div className="controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
            className="zoom-range"
          />
        </div>
      </Content>
      <Footer>
        <Button1 onClick={showCroppedImage}>Accept</Button1>
      </Footer>
    </CustomPopUp>
  );
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  console.log("aaa");
  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation);

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    return null;
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  // return croppedCanvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      resolve(file);
    }, "image/png");
  });
}
