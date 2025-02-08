import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useRef } from "react";
import WebFont from "webfontloader";
import { UserRequest } from "../api/userApi";
import { ref, set, onValue, off, remove } from "firebase/database";
import database from "@/shared/api/firebaseApi";
import toast, { Toaster } from "react-hot-toast";

const Container = styled.div`
  background-color: white;
`;

const OutletContainer = styled.div``;

export default function UserLayout() {
  const user = UserRequest();

  const notify = (message) =>
    toast(message, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

  const fireBaseNotiRef = useRef();

  useEffect(() => {
    if (user.isSuccess && user.data.status == 200) {
      fireBaseNotiRef.current = ref(database, "notification_" + user.data.data.id + "_web");
      onValue(fireBaseNotiRef.current, (snapshot) => {
        const data = snapshot.val();

        if (data.message && data.web == "false") {
          notify(data.message);
          const writeData = () => {
            set(ref(database, "notification_" + user.data.data.id + "_web"), {
              ...data,
              web: "true",
            });
          };
          writeData();
        }
      });
    }

    return () => {
      if (fireBaseNotiRef.current) {
        off(fireBaseNotiRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Nunito"],
      },
    });
  }, []);

  return (
    <Container>
      <OutletContainer>
        <Outlet />
      </OutletContainer>
      <Toaster position="bottom-left" reverseOrder={false} />
    </Container>
  );
}
