import styled, { css } from "styled-components";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";

const Container = styled.div`
  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;

  p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const Right = styled.div`
  position: sticky;
  top: 0;

  height: fit-content;

  > div {
    padding: 2rem;

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
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

const ImageItem = styled.div`
  position: relative;
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

export default function PhotoListing() {
  const [state, dispatch, ACTIONS] = useOutletContext();
  const [imageError, setImageError] = useState();
  const inputRef = useRef();

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

      dispatch({
        type: ACTIONS.CHANGE_PROPERTY_IMAGES,
        next: [...state.propertyImages, ...ev.target.files],
      });

      setImageError(null);
      ev.target.value = null;
    }
  };

  return (
    <>
      <Container>
        <Header>
          <h2>Add some photos of your </h2>
          <p>You'll need 5 photos to get started. You can add more or make changes later.</p>
        </Header>
        <Body>
          <Left>
            <ImageContainer>
              {state.propertyImages.length > 0 && (
                <Images>
                  {state.propertyImages.map((item, index) => {
                    return (
                      <ImageItem key={index}>
                        <ImageLayout>
                          <AiOutlineClose
                            onClick={() => {
                              dispatch({
                                type: ACTIONS.CHANGE_PROPERTY_IMAGES,
                                next: state.propertyImages.filter(
                                  (_, position) => position != index
                                ),
                              });
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
              {state.propertyImages.length == 0 && (
                <AddImageButton onClick={() => inputRef.current.click()}>
                  <BiImageAdd />
                  <span>Add Image</span>
                </AddImageButton>
              )}
              <input ref={inputRef} onChange={handleImageChange} type="file" multiple />
            </ImageContainer>
          </Left>
          <Right></Right>
        </Body>
      </Container>
      {imageError && <AlertPopUp message={imageError} action={() => setImageError("")} />}
    </>
  );
}
