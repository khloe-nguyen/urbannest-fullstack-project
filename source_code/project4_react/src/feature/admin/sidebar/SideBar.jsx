import styled, { css } from "styled-components";
import sidebar_content from "./data/sidebar_content";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Tooltip } from "react-tooltip";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import logo from "@/feature/admin/sidebar/assets/images/URBAN NEST (7).svg";
import { useEffect } from "react";
import { AdminRequest } from "@/shared/api/adminApi";
import { IoLockClosedOutline } from "react-icons/io5";

const TooltipContainer = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const Container = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background-color: #ea5e66;
  gap: 15px;
  padding: 1rem;
  padding-top: 2rem;
  padding-right: 0;
  height: 100vh;
  overflow-y: hidden;
`;

const SideBarContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ea5e66;
  gap: 15px;
  padding-right: 0;
  height: calc(100vh - 50px);
  overflow-y: scroll;

  &::-webkit-scrollbar-track {
    background-color: none;
  }

  &::-webkit-scrollbar {
    width: 0px;
    background-color: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(205, 205, 207);
  }

  & .active-link {
    color: red;
    background-color: blue;
  }
`;

const LogoContainer = styled.div`
  height: 50px;
  padding: 0 10px;
  align-self: flex-start;
  padding: 0;

  > img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SingleButton = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5dc;
  gap: 1rem;
  font-size: 17px;
  font-weight: 600;

  &:hover {
    color: white;
  }
  padding: 0.6rem 5px;
  padding-left: 10px;

  > span {
    font-size: 24px;
  }

  ${(props) => {
    if (props.$active && props.$lock == false) {
      return css`
        background-color: white;
        color: #dd367c;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        text-decoration: underline;

        &:hover {
          color: #dd367c;
        }
      `;
    }

    if (props.$lock == true) {
      return css`
        opacity: 0.5;
        cursor: not-allowed;
      `;
    }
  }}
`;

const SingleButtonSmall = styled(NavLink)`
  color: #f0bad4;
  text-decoration: none;
  font-size: 20px;
  padding: 0.4rem 5px;
  width: fit-content;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  ${(props) => {
    if (props.$active) {
      return css`
        background-color: white;
        color: red;
        border-radius: 5px;

        &:hover {
          background-color: white;
          color: red;
          border-radius: 5px;
        }
      `;
    }
  }}
`;

const Group = styled.div``;

const GroupSmall = styled.div``;

const GroupButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: inherit;
  border: none;
  color: #f5f5dc;
  cursor: pointer;
  width: 100%;
  padding: 0.6rem 5px;
  padding-left: 10px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  font-size: 17px;
  font-weight: 600;

  > div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &:hover {
    color: white;
  }
  transition: all 0.1s ease;

  ${(props) => {
    if (props.$active == true && props.$lock == false) {
      return css`
        background-color: white;
        color: #dd367c;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;

        &:hover {
          color: #dd367c;
        }
      `;
    }

    if (props.$focus == true && props.$lock == false) {
      return css`
        background-color: white;
        color: #dd367c;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;

        &:hover {
          color: #dd367c;
        }
      `;
    }

    if (props.$lock == true) {
      return css`
        opacity: 0.5;
        cursor: not-allowed;
      `;
    }
  }}

  & span {
    font-size: 24px;
  }

  > svg {
    font-size: 20px;
  }
`;

const GroupButtonSmall = styled.button`
  color: #f0bad4;
  text-decoration: none;
  font-size: 20px;
  padding: 0.4rem 5px;
  width: fit-content;
  background-color: inherit;
  border: none;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:hover + div {
    display: block;
  }
`;

const GroupChildrens = styled.div`
  padding-left: 1rem;
  height: 0;
  overflow: hidden;
  transition: all 0.1s ease-in-out;

  ${(props) => {
    if (props.$active == true) {
      return css`
        height: 100%;
      `;
    }
  }}
`;

const ChildrenButton = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f4f3dc;
  gap: 1rem;
  font-size: 17px;
  font-weight: 600;

  &:hover {
    color: white;
  }

  padding: 0.6rem 20px;

  ${(props) => {
    if (props.$focus == true && props.$lock == false) {
      return css`
        text-decoration: underline;
      `;
    }

    if (props.$lock == true) {
      return css`
        opacity: 0.5;
        cursor: not-allowed;
      `;
    }
  }}
`;

export default function SideBar({ isSideBarSmall }) {
  const admin = AdminRequest();
  const initialState = {};
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState([]);

  for (let item of sidebar_content) {
    if (item.type == "group") {
      initialState[name] = false;
    }
  }

  const edited_sidebar = [];

  for (let item of sidebar_content) {
    if (item.children == null) {
      edited_sidebar.push(item);
    }

    if (item.children != null) {
      for (let children of item.children) {
        edited_sidebar.push(children);
      }
    }
  }

  useEffect(() => {
    for (let item of sidebar_content) {
      if (item.link == location.pathname) {
        setCurrentPage([item.name]);
      }

      if (item.children != null) {
        for (let child of item.children) {
          if (child.link == location.pathname) {
            setCurrentPage([item.name, child.name]);
          }
        }
      }
    }
  }, [location.pathname]);

  const [buttonGroupState, setButtonGroupState] = useState(initialState);

  const isLock = (roleList) => {
    return !admin.data.data.roles.find((role) => roleList.includes(role.roleName));
  };

  return (
    <Container>
      {!isSideBarSmall && (
        <>
          <LogoContainer>
            <img src={logo} />
          </LogoContainer>
          <hr />
        </>
      )}

      <SideBarContent>
        {sidebar_content.map((item, index) => {
          if (item.type == "button" && !isSideBarSmall) {
            return (
              <SingleButton
                key={index}
                to={!isLock(item.role) && item.link}
                $active={currentPage.includes(item.name)}
                $lock={isLock(item.role)}
              >
                <span>{item.icon}</span> {item.name} {isLock(item.role) && <IoLockClosedOutline />}
              </SingleButton>
            );
          }
          if (item.type == "button" && isSideBarSmall) {
            return (
              <SingleButtonSmall
                key={index}
                to={item.link}
                $active={currentPage.includes(item.name)}
              >
                {item.icon}
              </SingleButtonSmall>
            );
          }
          if (item.type == "group" && !isSideBarSmall) {
            return (
              <Group key={index}>
                <GroupButton
                  $focus={currentPage.includes(item.name)}
                  $active={buttonGroupState[item.name]}
                  onClick={() => {
                    if (!isLock(item.role))
                      setButtonGroupState((prev) => {
                        return { ...prev, [item.name]: !prev[item.name] };
                      });
                  }}
                  $lock={isLock(item.role)}
                >
                  <div>
                    <span>{item.icon}</span> {item.name}{" "}
                    {isLock(item.role) && <IoLockClosedOutline />}
                  </div>
                  {!buttonGroupState[item.name] ? <IoIosArrowForward /> : <IoIosArrowDown />}
                </GroupButton>
                <GroupChildrens $active={buttonGroupState[item.name]}>
                  {item.children.map((child, index) => {
                    return (
                      <ChildrenButton
                        key={index}
                        to={!isLock(child.role) && child.link}
                        $focus={currentPage.includes(child.name)}
                        $lock={isLock(child.role)}
                      >
                        {child.icon} {child.name} {isLock(child.role) && <IoLockClosedOutline />}
                      </ChildrenButton>
                    );
                  })}
                </GroupChildrens>
              </Group>
            );
          }
          if (item.type == "group" && isSideBarSmall) {
            return (
              <GroupSmall key={index}>
                <GroupButtonSmall data-tooltip-id={item.name}>{item.icon}</GroupButtonSmall>
                <TooltipContainer>
                  <Tooltip style={{ backgroundColor: "#2c3e50" }} id={item.name} clickable>
                    {item.children.map((child, index) => {
                      return (
                        <ChildrenButton key={index} to={child.link}>
                          <span>{child.icon}</span> {child.name}
                        </ChildrenButton>
                      );
                    })}
                  </Tooltip>
                </TooltipContainer>
              </GroupSmall>
            );
          }
        })}
      </SideBarContent>
    </Container>
  );
}
