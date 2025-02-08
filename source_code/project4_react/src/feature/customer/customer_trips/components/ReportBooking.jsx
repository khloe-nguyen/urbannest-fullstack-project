import styled from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import TextEditor from "@/shared/components/editor/TextEditor";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import { useRef, useState } from "react";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { ReportBookingRequest } from "../api/customerTripApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  max-width: 40rem;

  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  & h3 {
    font-size: 17px;
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FooterStyled = styled.div`
  padding: 1rem;

  display: flex;
  align-items: center;
  justify-content: flex-end;

  & button {
    background-color: white;
    border-radius: 5px;

    padding: 10px 20px;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

const BodyStyled = styled.div`
  padding: 1rem 2rem;

  & h4 {
    color: red;
  }

  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 30rem;
  overflow: auto;
`;

const EditorStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImageContainer = styled.div`
  > input {
    display: none;
  }

  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
`;

const Images = styled.div`
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
`;

const ImageItem = styled.div`
  position: relative;
`;

const ImageLayout = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  padding: 5px;

  > svg {
    display: none;
    font-size: 1.2rem;
    background-color: white;
    padding: none;
    border-radius: 5px;
  }

  > svg:nth-of-type(1) {
    width: 2rem;
    height: 2rem;
    margin-left: 30px;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    border: 2px dotted rgba(255, 255, 255, 1);
  }

  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }

  &:hover svg {
    display: block;
  }
`;

const AddImageButton = styled.button`
  background-color: white;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 10px;
  padding: 3rem 2rem;
  border: 1px dotted rgba(0, 0, 0, 0.2);

  > span {
    color: rgba(0, 0, 255, 0.5);
    font-size: 16px;
  }

  > svg {
    font-size: 45px;
    opacity: 0.3;
  }
`;

export default function ReportBooking({ action, booking }) {
  const reportBooking = ReportBookingRequest();
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const inputRef = useRef();
  const [imageError, setImageError] = useState();
  const [reasonError, setReasonError] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = (ev) => {
    const allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    const maxFileSize = 1 * 1024 * 1024;

    if (ev.target.files.length > 0) {
      const isValidFileType = Array.from(ev.target.files).every((file) =>
        allowedFileTypes.includes(file.type)
      );

      const isValidFileSize = Array.from(ev.target.files).every((file) => file.size <= maxFileSize);

      if (!isValidFileType) {
        setImageError("Invalid file type. Please upload an image of type JPEG, PNG, GIF or JPG.");
        return;
      }

      if (!isValidFileSize) {
        setImageError("File size too large. Please upload an image smaller than 1 MB.");
        return;
      }

      setImages((prev) => [...prev, ...ev.target.files]);

      setImageError(null);
    }
  };

  const onReport = () => {
    let isOk = true;

    if (!reason || reason == "<p></p>") {
      setReasonError("Reason cannot be empty");
      isOk = false;
    } else {
      setReasonError();
    }

    if (images.length < 5) {
      setErrorImage("Please give us at least 5 images");
      isOk = false;
    } else {
      setErrorImage();
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("bookingId", booking.id);
      formData.append("reason", reason);
      images.forEach((image) => formData.append("images", image));

      reportBooking.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            setSuccess("Please wait for admin to review your report");
          } else {
            alert(response.message);
          }
        },
      });
    }
  };

  return (
    <>
      <PopUpStyled>
        <HeaderStyled>
          <h4>Booking report</h4>
          <XButton action={action} />
        </HeaderStyled>
        <hr />
        <BodyStyled>
          <EditorStyled>
            <h3>Please state your report reason</h3>
            <TextEditor state={reason} setState={setReason} />
          </EditorStyled>
          {reasonError && <h4>{reasonError}</h4>}
          <div>
            <h3>Please give us at least 5 images</h3>
            <ImageContainer>
              {images.length > 0 && (
                <Images>
                  {images.map((item, index) => {
                    return (
                      <ImageItem key={index}>
                        <ImageLayout>
                          <AiOutlineClose
                            onClick={() => {
                              setImages((prev) => prev.filter((image) => image != item));
                            }}
                          />
                        </ImageLayout>
                        <img src={typeof item == "object" ? URL.createObjectURL(item) : item} />
                      </ImageItem>
                    );
                  })}
                  <AddImageButton onClick={() => inputRef.current.click()}>
                    <BiImageAdd />
                  </AddImageButton>
                </Images>
              )}
              {images.length == 0 && (
                <AddImageButton onClick={() => inputRef.current.click()}>
                  <BiImageAdd />
                  <span>Add Image</span>
                </AddImageButton>
              )}
              <input ref={inputRef} onChange={handleImageChange} type="file" multiple />
            </ImageContainer>
          </div>
          {errorImage && <h4>{errorImage}</h4>}
        </BodyStyled>
        <hr />
        <FooterStyled>
          <button onClick={onReport}>Report</button>
        </FooterStyled>
      </PopUpStyled>
      {imageError && <AlertPopUp message={imageError} action={() => setImageError("")} />}
      {success && (
        <SuccessPopUp
          message={success}
          action={() => {
            setSuccess();
            action();
          }}
        />
      )}
    </>
  );
}
