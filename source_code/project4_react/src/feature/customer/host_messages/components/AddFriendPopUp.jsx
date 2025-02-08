import styled, { css } from "styled-components";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import TextInput from "@/shared/components/Input/TextInput";
import RedButton from "@/shared/components/Button/RedButton1";
import { SearchFriendRequest } from "../api/hostMessageApi";
import { UserRequest } from "@/shared/api/userApi";
import { useState } from "react";
import Avatar from "react-avatar";
import { AddNewFriendRequest } from "../api/hostMessageApi";

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

const SearchBodyStyled = styled.div`
  height: 20rem;
  padding: 1rem;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FriendStyled = styled.div`
  display: flex;
  align-items: center;
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

export default function AddFriendPopUp({ action, getUserChatRoom, setChosenRoom, chosenRoomRef }) {
  const [search, setSearch] = useState("");
  const user = UserRequest();
  const searchFriend = SearchFriendRequest(user.data.data.id, search);
  const [chosen, setChosen] = useState();

  const addNewFriend = AddNewFriendRequest();

  const onAddNewFriend = () => {
    if (chosen) {
      const formData = new FormData();
      formData.append("userId", user.data.data.id);
      formData.append("friendId", chosen);

      addNewFriend.mutate(formData, {
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
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h3>Send Message</h3>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        <CustomTextInput
          state={search}
          setState={setSearch}
          placeholder={"Search for email, name"}
        />
        <SearchBodyStyled>
          {searchFriend.isSuccess &&
            searchFriend.data.data.map((friend, index) => {
              return (
                <FriendStyled
                  $active={chosen == friend.id}
                  onClick={() => setChosen(friend.id)}
                  key={index}
                >
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
        </SearchBodyStyled>
      </BodyStyled>
      <hr />
      <FooterStyle>
        <RedButton active={chosen ? true : false} onClick={() => onAddNewFriend()}>
          Send Message
        </RedButton>
      </FooterStyle>
    </PopUpStyled>
  );
}
