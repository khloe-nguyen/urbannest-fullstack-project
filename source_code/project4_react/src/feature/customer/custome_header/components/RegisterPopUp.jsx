import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import PopUp from "@/shared/components/PopUp/PopUp";
import XButton from "@/shared/components/Button/XButton";
import TextInput from "@/shared/components/Input/TextInput";
import RedButton from "@/shared/components/Button/RedButton1";
import WhiteButton from "@/shared/components/Button/WhiteButton";
import { MdKeyboardArrowLeft } from "react-icons/md";
import {
  GoogleLoginRequest,
  LoginOrSignUpRequest,
} from "../api/loginSignUpApi";
import { CreateAuthenticationCodeRequest } from "../api/loginSignUpApi";
import ConfirmEmailPopUp from "./ConfirmEmailPopUp";
import ErrorPopUp from "@/shared/components/PopUp/ErrorPopUp";
import { LoginRequest } from "../api/loginSignUpApi";
import Cookies from "js-cookie";
import { UserRequest } from "@/shared/api/userApi";
import SuccessPopUp from "@/shared/components/PopUp/SuccessPopUp";
import google_logo from "@/feature/customer/custome_header/assets/icons8-google-48.png";
import { IoQrCodeOutline } from "react-icons/io5";
import { useGoogleLogin } from "@react-oauth/google";
import { RegisterGoogleRequest } from "../api/loginSignUpApi";
import { ref, set, onValue, off, remove } from "firebase/database";
import database from "@/shared/api/firebaseApi";
import { v4 as uuidv4 } from "uuid";
import QRCode from "react-qr-code";
import moment from "moment";
/* #region   */
const PopUpContainer = styled(PopUp)`
  width: 33rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

  & .error {
    color: red;
  }
`;

const QrCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 2rem;

  h4 {
    font-size: 17px;
  }

  & svg {
    width: 20px;
  }
`;

const Body = styled.form`
  padding: 10px 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  max-height: 80vh;
  overflow: auto;

  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  p {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const InputForm = styled.div`
  position: relative;

  > label {
    margin-left: 2px;
    position: absolute;
    color: rgba(0, 0, 0, 0.5);
    transform: translate(10px, -10px);
    background-color: white;
    padding: 0 10px;
  }

  p {
    color: red;
  }
`;

const Hr = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;

  position: relative;

  span:nth-of-type(1) {
    background-color: white;
    z-index: 1;
    padding: 0 1rem;
  }

  span:nth-of-type(2) {
    border-bottom: 1px solid black;

    width: 87%;
    position: absolute;
    transform: translateY(12px);
  }
`;

const Footer = styled.div`
  padding: 10px 2rem 15px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  position: relative;
`;

const MdKeyboardArrowLeftStyled = styled(MdKeyboardArrowLeft)`
  cursor: pointer;
  height: 1.7rem;
  width: 1.7rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }

  border-radius: 50%;
`;

const ForgotPassword = styled.h4`
  font-size: 15px;
  cursor: pointer;
  text-decoration: underline;
`;

const LogonStyled = styled.div`
  height: 30px;

  > img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;

const WhiteButtonStyled = styled(WhiteButton)`
  display: grid;
  grid-template-columns: 1fr 20fr;
  align-items: center;

  svg {
    font-size: 18px;
  }
`;
/* #endregion */

const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPopUp({ action }) {
  const [step, setStep] = useState("INIT");
  const [email, setEmail] = useState("");

  return (
    <PopUpContainer action={() => {}}>
      {step == "QR" && <QrCode action={action} />}
      {step == "INIT" && (
        <Init
          email={email}
          setEmail={setEmail}
          action={action}
          setStep={setStep}
        />
      )}
      {(step == "SIGNUP" || step == "GOOGLE_SIGNUP") && (
        <SignUp
          step={step}
          email={email}
          action={() => setStep("INIT")}
          offPopUp={action}
        />
      )}
      {step == "LOGIN" && (
        <Login email={email} action={() => setStep("INIT")} offPopUp={action} />
      )}
    </PopUpContainer>
  );
}

function QrCode({ action }) {
  const user = UserRequest();
  const uniqueCodeRef = useRef(uuidv4());

  const qrCodeRef = ref(database, uniqueCodeRef.current);

  const writeData = () => {
    set(ref(database, uniqueCodeRef.current), {
      time: new Date().toISOString(),
      token: "",
    });
  };

  useEffect(() => {
    writeData();

    onValue(qrCodeRef, (snapshot) => {
      const data = snapshot.val();

      if (data.token) {
        Cookies.set("CLIENT_ACCESS_TOKEN", data.token);
        user.refetch();
        action();
      }
    });

    return () => {
      remove(qrCodeRef);
      off(qrCodeRef);
    };
  }, []);

  return (
    <>
      <Header>
        <XButton action={action} />
        <h4>Sign up by QR code</h4>
        <span></span>
      </Header>
      <Body>
        <QrCodeContainer>
          <QRCode value={uniqueCodeRef.current} />
        </QrCodeContainer>
      </Body>
      <Footer></Footer>
    </>
  );
}

function Init({ action, email, setEmail, setStep }) {
  const [emailError, setEmailError] = useState("");
  const loginOrSignUp = LoginOrSignUpRequest();
  const googleLogin = GoogleLoginRequest();
  const user = UserRequest();

  const onLoginOrSignUp = (ev) => {
    ev.preventDefault();

    let isOk = true;

    if (!EmailRegex.test(email)) {
      setEmailError("Wrong email pattern");
      isOk = false;
    } else {
      setEmailError("");
    }

    if (isOk) {
      const formData = new FormData();

      formData.append("email", email);
      loginOrSignUp.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            if (response.data == true) {
              setStep("LOGIN");
            }

            if (response.data == false) {
              setStep("SIGNUP");
            }
          }
        },
      });
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const formData = new FormData();
          formData.append("email", data.email);
          googleLogin.mutate(formData, {
            onSuccess: (response) => {
              if (response.status == 202) {
                Cookies.set("CLIENT_ACCESS_TOKEN", response.data);
                user.refetch();
                action();
              }

              if (response.status == 201) {
                setEmail(data.email);
                setStep("GOOGLE_SIGNUP");
              }
            },
          });
        })
        .catch((err) => console.error("Error fetching user info:", err));
    },
  });

  return (
    <>
      <Header>
        <XButton action={action} />
        <h4>Log in or sign up</h4>
        <span></span>
      </Header>
      <hr />
      <Body>
        <h2>Welcome to Urban Nest</h2>
        <InputForm>
          <label>Email</label>
          <TextInput state={email} setState={setEmail} />
          {emailError && <p>{emailError}</p>}
        </InputForm>

        <RedButton onClick={onLoginOrSignUp}>Continue</RedButton>
      </Body>
      <Hr>
        <span>Or</span>
        <span></span>
      </Hr>
      <Footer>
        <WhiteButtonStyled onClick={() => login()}>
          <LogonStyled>
            <img src={google_logo} />
          </LogonStyled>{" "}
          Continue with Google
        </WhiteButtonStyled>
        <WhiteButtonStyled onClick={() => setStep("QR")}>
          <IoQrCodeOutline />
          Continue with QR
        </WhiteButtonStyled>
        {/* {admin.database.ServerValue} */}
      </Footer>
    </>
  );
}

function Login({ action, email, offPopUp }) {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const user = UserRequest();
  const login = LoginRequest();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState("");

  const onLogin = (ev) => {
    ev.preventDefault();
    let isOk = true;

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

    if (password && password.length < 6) {
      setErrors((prev) => {
        return {
          ...prev,
          passwordPattern: "Password length need to be more than 5 characters",
        };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, passwordPattern: null };
      });
    }

    if (isOk) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      login.mutate(formData, {
        onSuccess: (response) => {
          if (response.status == 200) {
            Cookies.set("CLIENT_ACCESS_TOKEN", response.data);
            user.refetch();
            setIsSuccess(true);
          }

          if (response.status == 403) {
            setIsError(response.message);
          }
        },
      });
    }
  };

  return (
    <>
      <Header>
        <MdKeyboardArrowLeftStyled onClick={action} />
        <h4>Log in </h4>
        <XButton action={offPopUp} />
      </Header>
      <hr />
      <Body>
        <span></span>
        <InputForm>
          <label>Password</label>
          <TextInput type="password" state={password} setState={setPassword} />
          {/* {emailError && <p>{emailError}</p>} */}
        </InputForm>

        <RedButton onClick={onLogin}>Login</RedButton>
        {/* <ForgotPassword>Forgot password?</ForgotPassword> */}
        <span></span>
        <span></span>
        <span></span>
      </Body>
      {isSuccess && (
        <SuccessPopUp message={"Successfully login"} action={offPopUp} />
      )}
      {isError && (
        <ErrorPopUp message={isError} action={() => setIsError("")} />
      )}
    </>
  );
}

function SignUp({ action, email, offPopUp, step }) {
  const createAuthenticationCode = CreateAuthenticationCodeRequest();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [isVerification, setIsVerification] = useState();
  const registerGoogle = RegisterGoogleRequest();
  const [success, setSuccess] = useState(false);

  const [emailExist, setEmailExist] = useState(false);

  const onLogin = (ev) => {
    ev.preventDefault();

    let isOk = true;

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
        return { ...prev, lastName: "Last name cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, lastName: null };
      });
    }

    if (!dob) {
      setErrors((prev) => {
        return { ...prev, dob: "Day of birth cannot be empty" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, dob: null };
      });
    }

    if (dob && !is18OrOlder(dob)) {
      setErrors((prev) => {
        return {
          ...prev,
          violation: "You need to be 18 or more to sign up to this website",
        };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, violation: null };
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

    if (password && password.length < 6) {
      setErrors((prev) => {
        return {
          ...prev,
          passwordPattern: "Password length need to be more than 5 characters",
        };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, passwordPattern: null };
      });
    }

    if (password && passwordConfirm != password) {
      setErrors((prev) => {
        return { ...prev, confirm: "Wrong password confirm" };
      });
      isOk = false;
    } else {
      setErrors((prev) => {
        return { ...prev, confirm: null };
      });
    }

    if (isOk) {
      if (step == "SIGNUP") {
        const formData = new FormData();
        formData.append("email", email);

        createAuthenticationCode.mutate(formData, {
          onSuccess: (response) => {
            if (response.status == 200) {
              setIsVerification(true);
            }

            if (response.status == 403) {
              setEmailExist(true);
            }
          },
        });
      } else {
        const formData = new FormData();
        const dobDate = new Date(dob);

        formData.append("email", email);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("password", password);
        formData.append(
          "dob",
          `${dobDate.getFullYear()}-${
            dobDate.getMonth() + 1
          }-${dobDate.getDate()}`
        );
        registerGoogle.mutate(formData, {
          onSuccess: (response) => {
            if (response.status == 200) {
              setSuccess(true);
            }
          },
        });
      }
    }
  };

  return (
    <>
      <Header>
        <MdKeyboardArrowLeftStyled onClick={action} />
        <h4>Finish signing up</h4>
        <XButton action={offPopUp} />
      </Header>
      <hr />
      <Body>
        <div>
          <h5>Legal name</h5>
          <InputForm>
            <label>First name on ID</label>
            <TextInput state={firstName} setState={setFirstName} />
            {errors.firstName && <h5 className="error">{errors.firstName}</h5>}
          </InputForm>
          <InputForm>
            <label>Last name on ID</label>
            <TextInput state={lastName} setState={setLastName} />
            {errors.lastName && <h5 className="error">{errors.lastName}</h5>}
          </InputForm>
          <p>Make sure this matches the name on your government ID</p>
        </div>
        <div>
          <h5>Date of birth</h5>
          <InputForm>
            <label>Birthdate</label>
            <TextInput state={dob} setState={setDob} type={"date"} />
            {errors.dob && <h5 className="error">{errors.dob}</h5>}
            {errors.violation && <h5 className="error">{errors.violation}</h5>}
          </InputForm>
          <p>
            To sign up, you need to be at least 18. Your birthday won’t be
            shared with other people who use URBAN NEST.
          </p>
        </div>
        <div>
          <h5>Contact info</h5>
          <InputForm>
            <label>Email</label>
            <TextInput state={email} />
          </InputForm>
          <p>We'll email you trip confirmations and receipts.</p>
        </div>
        <div>
          <h5>Password</h5>
          <InputForm>
            <label>Password</label>
            <TextInput
              type={"password"}
              state={password}
              setState={setPassword}
            />
            {errors.password && <h5 className="error">{errors.password}</h5>}
            {errors.passwordPattern && (
              <h5 className="error">{errors.passwordPattern}</h5>
            )}
          </InputForm>
          <InputForm>
            <label>Password repeat</label>
            <TextInput
              type={"password"}
              state={passwordConfirm}
              setState={setPasswordConfirm}
            />
            {errors.confirm && <h5 className="error">{errors.confirm}</h5>}
          </InputForm>
        </div>
        <div>
          <RedButton onClick={onLogin}>Sign Up</RedButton>
        </div>
      </Body>
      {isVerification && (
        <ConfirmEmailPopUp
          action={() => setIsVerification(false)}
          email={email}
          firstName={firstName}
          lastName={lastName}
          dob={dob}
          password={password}
          offPopUp={action}
        />
      )}
      {emailExist && (
        <ErrorPopUp
          action={() => setEmailExist(false)}
          message={"This email already exist"}
        />
      )}
      {success && (
        <SuccessPopUp
          action={() => {
            setSuccess(false);
            action();
            offPopUp();
          }}
          message={"Successfully register, please login to your account"}
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
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}
