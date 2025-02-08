import styled from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import CreatableSelect from "react-select/creatable";
import Button1 from "@/shared/components/Button/Button1";
import Avatar from "react-avatar";
import defaultImage from "@/shared/assets/images/4595376-200.png";
import { useState } from "react";
import { useRef } from "react";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { GetAmenityTypeRequest } from "../create_amenity/api/createAmenityApi";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import { GetCategoryByIdRequest } from "./api/updateCategoryApi";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { UpdateCategoryRequest } from "./api/updateCategoryApi";
import notfound from "@/shared/assets/images/404.png";

const Container = styled.div`
  padding: 2rem;
  margin: 2rem;
  background-color: white;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: center;

  h5 {
    color: #ea5e66;
    font-size: 14px;
  }
`;

const CustomTextInput = styled.textarea`
  padding: 8px;
  border-radius: 3px;
  width: 100%;
  height: 10rem;
  resize: none;

  border: 1px solid rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;

  &:focus {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }

  &:active {
    border: 1px solid rgba(0, 0, 255, 0.4);
  }
`;

const CustomCreatableSelect = styled(CreatableSelect)`
  width: 20rem;
`;

const ButtonContainer = styled.div`
  justify-content: flex-end;
  flex-direction: row !important;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & label {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;

  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;

    & label {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function UpdateCategory() {
  const inputRef = useRef();
  const [searchParams] = useSearchParams();
  const getCategoryById = GetCategoryByIdRequest(searchParams.get("id"));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState();
  const [imageError, setImageError] = useState("");
  const [imageCrop, setImageCrop] = useState();
  const [errors, setErrors] = useState({});
  const updateCategory = UpdateCategoryRequest();

  useEffect(() => {
    if (getCategoryById.isSuccess && getCategoryById.data.status == 200) {
      const data = getCategoryById.data.data;

      setName(data.categoryName);
      setImage(data.categoryImage);

      setDescription(data.description);
    }
  }, [getCategoryById.isSuccess]);

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

      setImageCrop(ev.target.files[0]);
      setImageError(null);
      ev.target.value = null;
    }
  };

  const onCreate = () => {
    let isOk = true;

    if (!name) {
      setErrors((prev) => {
        return { ...prev, name: "Name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, name: null };
      });
    }

    if (!image) {
      setErrors((prev) => {
        return { ...prev, image: "Image cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, image: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("id", getCategoryById.data.data.id);
      formData.append("categoryName", name);
      formData.append("description", description);
      if (typeof image == "object") {
        formData.append("categoryImage", image);
      }

      updateCategory.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            alert("ss");
          }
        },
      });
    }
  };

  if (getCategoryById.isLoading) {
    return <WaitingPopUp />;
  }

  if (updateCategory.isPending) {
    return <WaitingPopUp />;
  }

  if (getCategoryById.isSuccess && getCategoryById.data.data == null) {
    return (
      <Container>
        <NotFound>
          <img src={notfound} />
        </NotFound>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Left>
          <div>
            <label>Amenity Name *</label>
            <TextInput state={name} setState={setName} />
          </div>
          {errors.name && <h5>{errors.name}</h5>}

          <div>
            <label>Description</label>
            <CustomTextInput
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>
          {errors.description && <h5>{errors.description}</h5>}

          <ButtonContainer>
            <Button1 onClick={onCreate}>Update</Button1>
          </ButtonContainer>
        </Left>
        <Right>
          <div>
            <label>Icon Image *</label>
            {image ? (
              <Avatar round src={typeof image == "object" ? URL.createObjectURL(image) : image} />
            ) : (
              <Avatar src={defaultImage} round />
            )}
            <Button1 onClick={() => inputRef.current.click()}>Upload</Button1>
            {errors.image && <h5>{errors.image}</h5>}
            <input
              onChange={handleImageChange}
              type="file"
              ref={inputRef}
              style={{ display: "none" }}
            />
          </div>
        </Right>
      </Container>
      {imageCrop && (
        <CropImagePopUp
          action={() => setImageCrop()}
          onSuccess={(image) => {
            setImage(image);
          }}
          image={imageCrop}
          aspect={1 / 1}
        />
      )}
      {imageError && <AlertPopUp message={imageError} action={() => setImageError("")} />}
    </>
  );
}
