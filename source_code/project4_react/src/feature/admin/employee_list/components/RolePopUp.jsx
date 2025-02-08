import { useEffect, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import styled from "styled-components";
import XButton from "@/shared/components/Button/XButton";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { RoleRequest } from "@/shared/api/roleAdminApi";
import { ChangeEmployeeRoleRequest } from "../api/employeeListApi";

const PopUpStyled = styled(PopUp)`
  padding: 0;
  min-width: 35rem;
  border-radius: 25px;

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const HeaderStyled = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;

  h4 {
    font-size: 18px;
  }
`;

const BodyStyled = styled.div`
  padding: 1rem 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  & h4 {
    font-size: 17px;
    font-weight: 600;
    padding: 0.5rem 0;
  }

  height: 30rem;
  overflow: auto;

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

const FooterStyled = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;

  > button {
    padding: 10px;
    cursor: pointer;
    background-color: white;
    border-radius: 5px;
  }

  > button:active {
    transform: scale(0.9);
  }

  > button:nth-of-type(2) {
    background-color: black;
    color: white;
  }
`;

const RoleStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.2rem 0;

  & p {
    font-weight: 600;
  }
`;

export default function RolePopUp({ action, employee, employeeList }) {
  const roles = RoleRequest();
  const [empRoles, setEmpRoles] = useState(employee.roles.map((role) => role.id));
  const changeEmployeeRole = ChangeEmployeeRoleRequest();

  const onAccept = () => {
    const formData = new FormData();
    formData.append("userId", employee.id);
    empRoles.forEach((role) => formData.append("roleIds", role));

    changeEmployeeRole.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          employeeList.refetch();
          action();
        }
      },
    });
  };

  return (
    <PopUpStyled action={() => {}}>
      <HeaderStyled>
        <h4>Employee role</h4>
        <XButton action={action} />
      </HeaderStyled>
      <hr />
      <BodyStyled>
        {roles.isSuccess &&
          roles.data.data
            .filter((role) => role.roleName != "ADMIN" && role.roleName != "EMPLOYEE")
            .map((role, index) => {
              return (
                <RoleStyled key={index}>
                  <p>{role.roleName}</p>
                  <div>
                    <InputCheckBox
                      checked={empRoles.includes(role.id)}
                      onChange={() => {
                        if (empRoles.includes(role.id)) {
                          setEmpRoles(empRoles.filter((empRole) => empRole != role.id));
                        } else {
                          empRoles.push(role.id);
                          setEmpRoles([...empRoles]);
                        }
                      }}
                    />
                  </div>
                </RoleStyled>
              );
            })}
      </BodyStyled>
      <hr />
      <FooterStyled>
        <button onClick={action}>Cancel</button>
        <button onClick={onAccept}>Accept</button>
      </FooterStyled>
    </PopUpStyled>
  );
}
