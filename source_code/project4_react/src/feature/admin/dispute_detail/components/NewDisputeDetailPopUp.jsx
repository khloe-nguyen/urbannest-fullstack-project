import XButton from "@/shared/components/Button/XButton";
import TextEditor from "@/shared/components/editor/TextEditor";
import PopUp from "@/shared/components/PopUp/PopUp";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import BlackButton from "@/shared/components/Button/BlackButton";
import { AiOutlineClose } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { AddDisputeDetailRequest } from "../api/disputeDetailApi";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  width: 50rem;

  border-radius: 25px;

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
  height: 35rem;
  overflow: auto;
  gap: 1rem;
`;

const FooterStyled = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  grid-template-columns: repeat(3, 1fr);
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

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export default function NewDisputeDetailPopUp({ action, disputeId, query }) {
  const [customerReason, setCustomerReason] = useState();
  const [hostReason, setHostReason] = useState();
  const [imageCustomer, setImageCustomer] = useState([]);
  const [imageError, setImageError] = useState();
  const [imageHost, setImageHost] = useState([]);
  const [adminNote, setAdminNote] = useState();
  const addDisputeDetail = AddDisputeDetailRequest();
  const [isShowCustomer, setIsShowCustomer] = useState(false);
  const [isShowHost, setIsShowHost] = useState(false);
  const [isShowAdmin, setIsShowAdmin] = useState(false);

  const customerInputRef = useRef();
  const hostInputRef = useRef();

  const handleHostImageChange = (ev) => {
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

      setImageHost((prev) => [...prev, ...ev.target.files]);

      setImageError(null);
    }
  };

  const handleCustomerImageChange = (ev) => {
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

      setImageCustomer((prev) => [...prev, ...ev.target.files]);

      setImageError(null);
    }
  };

  const onAddNew = () => {
    if (
      !customerReason ||
      imageCustomer.length == 0 ||
      !hostReason ||
      imageHost.length == 0 ||
      !adminNote
    ) {
      alert("Please fill up all the detail");
      return;
    }

    const formData = new FormData();
    formData.append("id", disputeId);
    formData.append("customerReason", customerReason);
    imageCustomer.forEach((image) => formData.append("customerImages", image));
    formData.append("hostReason", hostReason);
    imageCustomer.forEach((image) => formData.append("hostImages", image));
    formData.append("adminNote", adminNote);

    addDisputeDetail.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          query.refetch();
          action();
        }
      },
    });
  };

  if (addDisputeDetail.isPending) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <PopUpStyled>
        <HeaderStyled>
          <h4>New dispute detail</h4>
          <XButton action={action} />
        </HeaderStyled>
        <BodyStyled>
          <Header onClick={() => setIsShowCustomer((prev) => !prev)}>
            <h4>Customer</h4>
            {!isShowCustomer ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
          </Header>
          <hr />
          {isShowCustomer && (
            <>
              <div>
                <TextEditor state={customerReason} setState={setCustomerReason} />
              </div>
              <ImageContainer>
                {imageCustomer.length > 0 && (
                  <Images>
                    {imageCustomer.map((item, index) => {
                      return (
                        <ImageItem key={index}>
                          <ImageLayout>
                            <AiOutlineClose
                              onClick={() => {
                                setImageCustomer((prev) => prev.filter((image) => image != item));
                              }}
                            />
                          </ImageLayout>
                          <img src={typeof item == "object" ? URL.createObjectURL(item) : item} />
                        </ImageItem>
                      );
                    })}
                    <AddImageButton onClick={() => customerInputRef.current.click()}>
                      <BiImageAdd />
                    </AddImageButton>
                  </Images>
                )}
                {imageCustomer.length == 0 && (
                  <AddImageButton onClick={() => customerInputRef.current.click()}>
                    <BiImageAdd />
                    <span>Add Image</span>
                  </AddImageButton>
                )}
                <input
                  ref={customerInputRef}
                  onChange={handleCustomerImageChange}
                  type="file"
                  multiple
                />
              </ImageContainer>
            </>
          )}
          <Header onClick={() => setIsShowHost((prev) => !prev)}>
            <h4>Host</h4>
            {!isShowHost ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
          </Header>
          <hr />
          {isShowHost && (
            <>
              <div>
                <TextEditor state={hostReason} setState={setHostReason} />
              </div>
              <ImageContainer>
                {imageHost.length > 0 && (
                  <Images>
                    {imageHost.map((item, index) => {
                      return (
                        <ImageItem key={index}>
                          <ImageLayout>
                            <AiOutlineClose
                              onClick={() => {
                                setImageCustomer((prev) => prev.filter((image) => image != item));
                              }}
                            />
                          </ImageLayout>
                          <img src={typeof item == "object" ? URL.createObjectURL(item) : item} />
                        </ImageItem>
                      );
                    })}
                    <AddImageButton onClick={() => hostInputRef.current.click()}>
                      <BiImageAdd />
                    </AddImageButton>
                  </Images>
                )}
                {imageHost.length == 0 && (
                  <AddImageButton onClick={() => hostInputRef.current.click()}>
                    <BiImageAdd />
                    <span>Add Image</span>
                  </AddImageButton>
                )}
                <input ref={hostInputRef} onChange={handleHostImageChange} type="file" multiple />
              </ImageContainer>
            </>
          )}

          <Header onClick={() => setIsShowAdmin((prev) => !prev)}>
            <h4>Admin note</h4>
            {!isShowAdmin ? <RiArrowRightSLine /> : <RiArrowDownSLine />}
          </Header>
          <hr />
          {isShowAdmin && (
            <>
              <div>
                <TextEditor state={adminNote} setState={setAdminNote} />
              </div>
            </>
          )}
        </BodyStyled>
        <FooterStyled>
          <BlackButton onClick={onAddNew}>Add new</BlackButton>
        </FooterStyled>
      </PopUpStyled>
      {imageError && <AlertPopUp message={imageError} action={() => setImageError("")} />}
    </>
  );
}
