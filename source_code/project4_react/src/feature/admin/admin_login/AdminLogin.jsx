import styled from "styled-components";
import logo from "@/shared/assets/images/URBANNESTBLACK.png";
import TextInput from "@/shared/components/Input/TextInput";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import Button1 from "@/shared/components/Button/Button1";
import { useEffect, useRef } from "react";
import WebFont from "webfontloader";
import background from "@/feature/admin/admin_login/assets/stacked-steps-haikei.svg";
import { AdminLoginRequest } from "./api/adminLoginApi";
import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import AlertPopUp from "@/shared/components/PopUp/AlertPopUp";
import { AdminRequest } from "@/shared/api/adminApi";
import ForgotPasswordPopUp from "./components/ForgotPasswordPopUp";

const Container = styled.div`
  background-color: rgb(248, 249, 251);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${background});
`;

const CustomTextInput = styled(TextInput)`
  background-color: #e5efef;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  > div {
    width: 280px;
  }
`;

const LoginForm = styled.form`
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 5px;

  width: 25rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const ButtonContaner = styled.div`
  display: flex;
  flex-direction: column;
`;

const RememberForgot = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  > span {
    cursor: pointer;
  }
`;

const Intro = styled.div`
  > p:nth-of-type(1) {
    font-size: 20px;
    font-weight: 600;
  }
  gap: 5px !important;

  > p:nth-of-type(2) {
    font-size: 15px;
    color: rgba(0, 0, 0, 0.3);
  }
  margin-bottom: 10px;
`;

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AdminLogin = () => {
  const admin = AdminRequest();
  const [isForgotPassword, setIsForgotPassword] = useState();
  const [email, setEmail] = useState(
    localStorage.getItem("email") ? localStorage.getItem("email") : ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") ? localStorage.getItem("password") : ""
  );
  const adminLogin = AdminLoginRequest();
  const navigate = useNavigate();
  const [isAlert, setIsAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [isRemember, setIsRemember] = useState(localStorage.getItem("remember") ? true : false);

  const onLogin = (ev) => {
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

    if (!password) {
      setErrors((prev) => {
        return { ...prev, password: "Password cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, password: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      adminLogin.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            if (isRemember) {
              localStorage.setItem("email", email);
              localStorage.setItem("password", password);
              localStorage.setItem("remember", true);
            } else {
              localStorage.removeItem("email");
              localStorage.removeItem("password");
              localStorage.removeItem("remember");
            }

            Cookies.set("ADMIN_ACCESS_TOKEN", response.data);
            navigate("/admin");
            return;
          }

          if (response.status == 403) {
            setErrorMessage(response.message);
            setIsAlert(true);
          }

          if (response.status == 404) {
            setErrorMessage("Wrong username or password");
            setIsAlert(true);
          }
        },
      });
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Nunito"],
      },
    });
  }, []);

  return (
    <>
      <Container>
        <LoginContainer>
          <div>
            <img src={logo} />
          </div>
          <LoginForm>
            <Intro>
              <p>Sign in to account</p> <p>Enter your email & password to login</p>
            </Intro>
            <div>
              <label>Email address</label>
              <CustomTextInput state={email} setState={setEmail} placeholder={"text@gmail.com"} />
            </div>
            {errors.email && <h5>{errors.email}</h5>}
            {errors.email_pattern && <h5>{errors.email_pattern}</h5>}
            <div>
              <label>Password</label>
              <CustomTextInput state={password} setState={setPassword} type={"password"} />
            </div>
            {errors.password && <h5>{errors.password}</h5>}
            <RememberForgot>
              <div>
                <InputCheckBox
                  checked={isRemember}
                  onChange={() => {
                    setIsRemember((prev) => !prev);
                  }}
                />
                Remember me
              </div>
              <span onClick={() => setIsForgotPassword(true)}>Forgot password</span>
            </RememberForgot>
            <ButtonContaner>
              <Button1 onClick={onLogin}>Login</Button1>
            </ButtonContaner>
          </LoginForm>
        </LoginContainer>
      </Container>
      {isAlert && <AlertPopUp action={() => setIsAlert(false)} message={errorMessage} />}
      {isForgotPassword && <ForgotPasswordPopUp action={() => setIsForgotPassword()} />}
    </>
  );
};

export default AdminLogin;
