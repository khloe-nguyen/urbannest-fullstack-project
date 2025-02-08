import React from "react";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import TextInput from "@/shared/components/Input/TextInput";
import Avatar from "react-avatar";
import defaultImage from "@/shared/assets/images/4595376-200.png";
import Button1 from "@/shared/components/Button/Button1";
import { useRef } from "react";
import CropImagePopUp from "@/shared/components/PopUp/CropImagePopUp";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import { AdminRequest } from "@/shared/api/adminApi";
import { useNavigate } from "react-router-dom";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import { RoleRequest } from "@/shared/api/roleAdminApi";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";
import { useParams } from "react-router-dom";
import { GetEmployeeByIdRequest } from "./api/updateEmployeeApi";
import moment from "moment";
import image404 from "@/shared/assets/images/404.png";
import { UpdateEmployeeRequest } from "./api/updateEmployeeApi";

const Container = styled.div`
  padding: 2rem;
  margin: 2rem;
  background-color: white;

  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  h5 {
    color: #ea5e66;
    font-size: 14px;
  }

  .fragment {
    background-color: blue;
  }
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
  align-self: center;

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

const HeaderStyled = styled.div`
  flex-direction: row !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  row-gap: none !important;
`;

const HeaderButtonStyled = styled.button`
  background-color: white;
  border: none;
  padding: 10px 20px;

  cursor: pointer;
  font-weight: 600;
  transition: all 1s;

  ${(props) => {
    if (props.$active) {
      return css`
        border-bottom: 2px solid red;
      `;
    }
  }}
`;

const ErrorStyled = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoleStyled = styled.div`
  flex-direction: row !important;
  justify-content: space-between;
`;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UpdateEmployee() {
  const { id } = useParams();
  const getEmployeeById = GetEmployeeByIdRequest(id);
  const roles = RoleRequest();
  const managedCityAdmin = ManagedCityAdminRequest();
  const [option, setOption] = useState("info");
  const admin = AdminRequest();
  const navigate = useNavigate();
  const updateEmployee = UpdateEmployeeRequest();
  const [alert, setAlert] = useState();
  const [success, setSuccess] = useState(false);
  const inputRef = useRef();
  const [image, setImage] = useState();
  const [imageCrop, setImageCrop] = useState();
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState();
  const [imageError, setImageError] = useState();
  const [roleList, setRoleList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    if (
      !admin.data.data.roles.find(
        (role) => role.roleName == "EMPLOYEE_MANAGEMENT" || role.roleName == "ADMIN"
      )
    ) {
      navigate("admin_login");
    }
  }, []);

  useEffect(() => {
    if (getEmployeeById.isSuccess && getEmployeeById.data.status == 200) {
      const data = getEmployeeById.data.data;

      setEmail(data.email);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setPhone(data.phoneNumber);
      setDob(moment(data.dob).format("YYYY-MM-DD"));
      setAddress(data.address);
      setRoleList(data.roles.map((role) => role.id));
      setCityList(data.cities.map((city) => city.id));
      setImage(data.avatar);
    }
  }, [getEmployeeById.isSuccess]);

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

  const onCreateNewEmployee = (ev) => {
    ev.preventDefault();

    let isOk = true;

    if (!email) {
      setErrors((prev) => {
        return { ...prev, email: "Email cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, email: null };
      });
    }

    if (email && !EmailRegex.test(email)) {
      setErrors((prev) => {
        return { ...prev, email_pattern: "Wrong pattern of email" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, email_pattern: null };
      });
    }

    if (!firstName) {
      setErrors((prev) => {
        return { ...prev, firstName: "First name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, firstName: null };
      });
    }

    if (!lastName) {
      setErrors((prev) => {
        return { ...prev, lastName: "Last Name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, lastName: null };
      });
    }

    if (!phone) {
      setErrors((prev) => {
        return { ...prev, phone: "Phone cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, phone: null };
      });
    }

    if (!address) {
      setErrors((prev) => {
        return { ...prev, address: "Address cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, address: null };
      });
    }

    if (!dob) {
      setErrors((prev) => {
        return { ...prev, dob: "Dob cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, dob: null };
      });
    }

    if (dob && !is18OrOlder(dob)) {
      setErrors((prev) => {
        return { ...prev, violation: "Employee need to be 18 or more " };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, violation: null };
      });
    }

    if (!image) {
      setErrors((prev) => {
        return { ...prev, image: "Avatar cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, image: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("address", address);
      formData.append("dob", dob);
      formData.append("phoneNumber", phone);

      if (typeof image == "object") {
        formData.append("avatar", image);
      }
      roleList.forEach((role) => formData.append("roleIds", role));
      cityList.forEach((city) => formData.append("cityIds", city));

      updateEmployee.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            setSuccess(true);
          }

          if (response.status == 403) {
            setAlert(response.message);
            return;
          }
        },
      });
    }
  };

  if (updateEmployee.isPending) {
    return <WaitingPopUp />;
  }

  if (
    getEmployeeById.isError ||
    (getEmployeeById.isSuccess && getEmployeeById.data.status == 404)
  ) {
    return (
      <ErrorStyled>
        <img src={image404} />
      </ErrorStyled>
    );
  }

  return (
    <>
      <Container>
        <Left>
          <HeaderStyled>
            <HeaderButtonStyled $active={option == "info"} onClick={() => setOption("info")}>
              Info
            </HeaderButtonStyled>
            <HeaderButtonStyled $active={option == "role"} onClick={() => setOption("role")}>
              Role
            </HeaderButtonStyled>
            <HeaderButtonStyled
              $active={option == "managed_city"}
              onClick={() => setOption("managed_city")}
            >
              Managed city
            </HeaderButtonStyled>
          </HeaderStyled>
          {option == "info" && (
            <>
              <div>
                <label>Email</label>
                <TextInput
                  readOnly={true}
                  state={email}
                  setState={setEmail}
                  placeholder={"abcd@gmail.com"}
                />
              </div>
              {errors.email && <h5>{errors.email}</h5>}
              {errors.email_pattern && <h5>{errors.email_pattern}</h5>}
              <div>
                <label>First name</label>
                <TextInput state={firstName} setState={setFirstName} />
              </div>
              {errors.firstName && <h5>{errors.firstName}</h5>}
              <div>
                <label>Last name</label>
                <TextInput state={lastName} setState={setLastName} />
              </div>
              {errors.lastName && <h5>{errors.lastName}</h5>}
              <div>
                <label>Phone number</label>
                <TextInput state={phone} setState={setPhone} />
              </div>
              {errors.phone && <h5>{errors.phone}</h5>}
              <div>
                <label>Date of birth</label>
                <TextInput state={dob} setState={setDob} type={"date"} />
              </div>
              {errors.dob && <h5>{errors.dob}</h5>}
              {errors.violation && <h5>{errors.violation}</h5>}
              <div>
                <label>Address</label>
                <TextInput state={address} setState={setAddress} />
              </div>
              {errors.address && <h5>{errors.address}</h5>}
            </>
          )}

          {option == "role" && (
            <>
              {roles.isSuccess &&
                roles.data.data
                  .filter((role) => role.roleName != "ADMIN" && role.roleName != "EMPLOYEE")
                  .map((role, index) => {
                    return (
                      <RoleStyled key={index}>
                        <p>{role.roleName}</p>
                        <div>
                          <InputCheckBox
                            onChange={() => {
                              if (roleList.includes(role.id)) {
                                setRoleList(roleList.filter((empRole) => empRole != role.id));
                              } else {
                                roleList.push(role.id);
                                setRoleList([...roleList]);
                              }
                            }}
                            checked={roleList.includes(role.id)}
                          />
                        </div>
                      </RoleStyled>
                    );
                  })}
            </>
          )}

          {option == "managed_city" &&
            managedCityAdmin.data.data
              .filter((city) => city.managed == true || cityList.includes(city.id))
              .map((city, index) => {
                return (
                  <RoleStyled key={index}>
                    <p>{city.cityName}</p>
                    <div>
                      <InputCheckBox
                        onChange={() => {
                          if (cityList.includes(city.id)) {
                            setCityList(cityList.filter((empCity) => empCity != city.id));
                          } else {
                            cityList.push(city.id);
                            setCityList([...cityList]);
                          }
                        }}
                        checked={cityList.includes(city.id)}
                      />
                    </div>
                  </RoleStyled>
                );
              })}
          <ButtonContainer>
            <Button1 onClick={onCreateNewEmployee}>Update</Button1>
          </ButtonContainer>
        </Left>
        <Right>
          <div>
            <label>Avatar *</label>
            {image ? (
              <Avatar
                size="200"
                round
                src={typeof image == "object" ? URL.createObjectURL(image) : image}
              />
            ) : (
              <Avatar size="200" src={defaultImage} round />
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

      {alert && <AlertPopUp message={alert} action={() => setAlert()} />}
      {imageError && <ErrorPopUp action={() => setImageError()} message={imageError} />}
      {success && (
        <SuccessPopUp
          message={"Success update employee"}
          action={() => {
            setSuccess(false);
          }}
        />
      )}
    </>
  );
}

function is18OrOlder(dob) {
  const dobDate = new Date(dob);
  const today = new Date();

  // Calculate the age based on the difference in years
  let age = today.getFullYear() - dobDate.getFullYear();

  // Adjust if the current date is before the birthday this year
  const monthDifference = today.getMonth() - dobDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  return age >= 18;
}
