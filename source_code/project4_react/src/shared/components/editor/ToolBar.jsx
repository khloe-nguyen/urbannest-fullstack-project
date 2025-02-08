import { FaImages } from "react-icons/fa";
import { FaAlignLeft } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa";
import { FaAlignCenter } from "react-icons/fa";
import { FaUndoAlt } from "react-icons/fa";
import { FaRedoAlt } from "react-icons/fa";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { MdFormatUnderlined } from "react-icons/md";
import { GoBold } from "react-icons/go";
import { MdOutlineFormatItalic } from "react-icons/md";
import styled from "styled-components";
import { CiImageOn } from "react-icons/ci";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosAdmin from "@/shared/api/axiosAdmin";
import getFirebaseImageUrl from "@/shared/utils/getFireBaseImage";

const MenuBar = styled.div`
  background-color: #edeff2;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px;
  display: flex;
  gap: 10px;

  > svg {
    cursor: pointer;
    font-size: 20px;
    padding: 3px;
  }

  > svg:hover {
    background-color: #e5e5e5;
    border: 1px solid black;
  }
`;

const ToolBar = ({ editor }) => {
  const uploadImageRequest = () => {
    const request = async (payload) => {
      const response = await axiosAdmin.post("Test/testUploadFile", payload);
      return response.data;
    };

    return useMutation({
      mutationFn: request,
    });
  };

  const mutation = uploadImageRequest();

  function handleFileSelection() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";

    fileInput.onchange = function (event) {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        mutation.mutate(formData, {
          onSuccess: (response) => {
            console.log(response);
            addImage(response);
          },
        });
      }

      fileInput.remove();
      console.log("Input element destroyed");
    };

    document.body.appendChild(fileInput);

    fileInput.click();
  }

  const addImage = useCallback(
    (url) => {
      const fullUrl = getFirebaseImageUrl(url);
      if (fullUrl) {
        editor.chain().focus().setImage({ src: fullUrl }).run();
      }
    },
    [editor]
  );

  return (
    <MenuBar>
      <FaAlignLeft
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      />
      <FaAlignCenter
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      />
      <FaAlignRight
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      />
      <FaAlignJustify
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      />
      <FaUndoAlt
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      />
      <FaRedoAlt
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      />
      <MdOutlineFormatListBulleted
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      />

      <GoListOrdered
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      />
      <MdFormatUnderlined
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is-active" : ""}
      />
      <GoBold
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      />

      <MdOutlineFormatItalic
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      />
    </MenuBar>
  );
};

export default ToolBar;
