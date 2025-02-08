import { useState } from "react";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React, { useCallback } from "react";
import TextStyle from "@tiptap/extension-text-style";
import styled from "styled-components";
import TextAlign from "@tiptap/extension-text-align";
import History from "@tiptap/extension-history";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import ToolBar from "./ToolBar";
import { useEffect } from "react";

const EditorContainer = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

const StyledEditorContent = styled(EditorContent)`
  > div {
    border: none;
    outline: none;
    padding: 10px;
    height: ${(props) => (props.$isMail ? "20rem" : "15rem")};
    overflow-y: scroll;

    &::-webkit-scrollbar-track {
      background-color: none;
    }

    &::-webkit-scrollbar {
      width: 4px;
      background-color: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgb(205, 205, 207);
    }
  }
`;

export default function TextEditor({ state, setState, isMail }) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Image,
      Dropcursor,
      TextStyle,
      Highlight,
      History,
      ListItem,
      BulletList,
      OrderedList,
      Underline,
      Italic,
      Bold,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: state,
    onUpdate: ({ editor }) => {
      setState(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  useEffect(() => {
    if (editor && state !== editor.getHTML()) {
      editor.commands.setContent(state || ""); // update editor with new content
    }
  }, [state, editor]);

  return (
    <EditorContainer>
      <ToolBar editor={editor} />
      <StyledEditorContent $isMail={isMail} className="editor-content" editor={editor} />
    </EditorContainer>
  );
}
