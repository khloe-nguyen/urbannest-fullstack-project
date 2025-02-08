import styled, { css } from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import RedButton from "@/shared/components/Button/RedButton1";
import TextInput from "@/shared/components/Input/TextInput";
import { useState } from "react";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { SearchAdminGroupChatFriendRequest } from "../api/adminMessagesApi";
import Avatar from "react-avatar";
import { AddAdminNewGroupRequest } from "../api/adminMessagesApi";
const PopUpStyled = styled(PopUp)`
  padding: 0;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  min-width: 40rem;
  border-radius: 25px;
`;

const HeaderStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`;

const BodyStyled = styled.div`
  padding: 1rem;
`;

const CustomTextInput = styled(TextInput)`
  border-top: none !important;
  border-right: none !important;
  border-left: none !important;
`;

const FooterStyle = styled.div`
  padding: 1rem;

  display: flex;
  justify-content: flex-end;
`;

const InputContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchBodyStyled = styled.div`
  padding: 1rem;

  overflow-y: auto;

  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const FriendStyled = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1rem;

  cursor: pointer;
  padding: 1rem;
  border-radius: 15px;

  &:hover {
    background-color: #f7f7f7;
  }

  ${(props) => {
    if (props.$active == true) {
      return css`
        background-color: #b2b2b2;

        &:hover {
          background-color: #b2b2b2;
        }
      `;
    }
  }}
`;

const SearchStyled = styled.div`
  height: 20rem;
  overflow-y: auto;

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
`;

const ChosenStyled = styled.div`
  height: 20rem;

  overflow-y: auto;
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
`;

export default function AdminAddGroupPopUp({
  action,
  getUserChatRoom,
  setChosenRoom,
  chosenRoomRef,
}) {
  const addNewGroup = AddAdminNewGroupRequest();

  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState();
  const [chosen, setChosen] = useState([]);
  const searchGroupChatFriend = SearchAdminGroupChatFriendRequest(0, search);

  const onAddOrRemoveFriend = (friend) => {
    const isExist = chosen.find((item) => item.id == friend.id);

    if (isExist) {
      setChosen((prev) => prev.filter((item) => item.id != friend.id));
    }

    if (!isExist) {
      setChosen((prev) => {
        return [...prev, friend];
      });
    }
  };

  const onAddNewGroup = () => {
    if (chosen.length != 0 && groupName.length != 0) {
      const formData = new FormData();
      formData.append("groupName", groupName);
      chosen.forEach((item) => formData.append("members", item.id));
      formData.append("members", 0);

      addNewGroup.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            setChosenRoom(response.data);
            chosenRoomRef.current = response.data;
            getUserChatRoom.refetch();
            action();
          }
        },
      });
    }
  };

  return (
    <PopUpStyled>
      <HeaderStyled>
        <h3>Create new group</h3>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <InputContainerStyled>
          <TextInput state={groupName} setState={setGroupName} placeholder={"Create group name"} />

          <CustomTextInput
            state={search}
            setState={setSearch}
            placeholder={"Search for email, name"}
          />
        </InputContainerStyled>
        <SearchBodyStyled>
          <SearchStyled>
            {searchGroupChatFriend.isSuccess &&
              searchGroupChatFriend.data.data.map((friend, index) => {
                return (
                  <FriendStyled key={index}>
                    <div>
                      <InputCheckBox
                        checked={chosen.find((item) => item.id == friend.id)}
                        onChange={() => onAddOrRemoveFriend(friend)}
                      />
                    </div>
                    <div>
                      <Avatar round size={50} src={friend.avatar} name={friend.firstName} />
                    </div>
                    <div>
                      <p>
                        {friend.firstName} {friend.lastName}
                      </p>
                      <p>{friend.email}</p>
                    </div>
                  </FriendStyled>
                );
              })}
          </SearchStyled>
          <ChosenStyled>
            {chosen.map((friend, index) => (
              <FriendStyled key={index}>
                <div>
                  <Avatar round size={50} src={friend.avatar} name={friend.firstName} />
                </div>
                <p>
                  {friend.firstName} {friend.lastName}
                </p>
              </FriendStyled>
            ))}
          </ChosenStyled>
        </SearchBodyStyled>
      </BodyStyled>
      <hr />
      <FooterStyle>
        <RedButton active={chosen.length != 0 && groupName.length != 0} onClick={onAddNewGroup}>
          Create
        </RedButton>
      </FooterStyle>
    </PopUpStyled>
  );
}
