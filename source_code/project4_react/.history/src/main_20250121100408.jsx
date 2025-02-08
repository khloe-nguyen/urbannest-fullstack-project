import { StrictMode } from "react";
import "./global";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./shared/router";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@/shared/assets/css/index.css";
import "react-tooltip/dist/react-tooltip.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GoogleOAuthProvider
        clientId={
          "29010444016-of3dekeohvt8jaebkvp91opc9o1ujg1u.apps.googleusercontent.com"
        }
      >
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <RouterProvider router={router} />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </LocalizationProvider>
  </StrictMode>
);
