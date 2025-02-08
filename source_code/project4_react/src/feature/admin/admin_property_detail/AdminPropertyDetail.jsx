import { Fragment, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useParams } from "react-router";
import { GetListingByIdRequest } from "./api/adminPropertyDetailApi";
import { HiMiniArrowSmallRight } from "react-icons/hi2";
import { HiMiniArrowSmallDown } from "react-icons/hi2";
import WaitingPopUp from "@/shared/components/PopUp/WaitingPopUp";
import dchc from "@/shared/data/dchc";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { PiLightningFill, PiLightningSlashBold } from "react-icons/pi";
import { FaBan, FaGlobe, FaHourglassHalf } from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import { MdCancelPresentation } from "react-icons/md";
import Avatar from "react-avatar";
import { useRef } from "react";
import { AdminRequest } from "@/shared/api/adminApi";
import PropertyStatusPopUp from "../listing_list/components/PropertyStatusPopUp";
import PropertyDetailReviewPopUp from "./components/PropertyDetailReviewPopUp";

/* #region styled */
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

  & hr {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
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
  position: relative;
`;

const ViewMoreStyled = styled.h4`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 17px;

  &:hover {
    text-decoration: underline;
  }

  & svg {
    font-size: 25px;
  }
`;

const ItemStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 1rem;
`;

const CoordinateContainer = styled.div`
  height: 400px;
  overflow: hidden;
  margin-top: 2rem;

  & .leaflet-container {
    height: 100%;
  }
`;

const PropertyTitleStyled = styled.div`
  margin-bottom: 0.5rem;
  text-decoration: underline;
  flex-direction: row !important;
  justify-content: space-between;

  display: flex;
  align-items: center;

  & div {
    display: flex;
    align-items: center;
    flex-direction: row !important;
    gap: 0.5rem;
    margin-left: 10px;
  }
`;

const ImageContainerStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 9rem;
  gap: 10px;

  > div:nth-of-type(1) {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  > div {
    border: 1px dotted rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${(props) => {
    if (props.$length % 2 == 0) {
      return css`
        > div:nth-of-type(${props.$length}) {
          grid-column: 1 / 3;
          grid-row: ${2 + props.$length / 2} / ${2 + props.$length / 2 + 2};
        }
      `;
    }
  }}
`;

const AvailabilityStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 1rem;

  & li {
    > div {
      display: flex;
      flex-direction: row;
      gap: 10px;
      font-size: 17px;
    }
    margin: 0.7rem 0;
  }

  & p {
    text-decoration: underline;
  }
`;

const StatusStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & span {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.5);
  }

  svg {
    color: #ea5e66 !important;
    font-size: 25px;
  }
`;

const UserColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-direction: row !important;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 5px;

    & h4 {
      font-size: 16px;
    }

    & p {
      color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const RightContainerStyled = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 15px;
  width: 20rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  > div:nth-of-type(2) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  & button {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 15px;
    background-color: #ea5e66;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  & button:active {
    transform: scale(0.9);
  }
`;

/* #endregion */

/* #region option */

const propertyOptions = [
  {
    value: "sharedroom",
    label: "Shared Room",
    description:
      "A budget-friendly option where guests share a space with others, featuring multiple beds and a social atmosphere.",
  },
  {
    value: "hotel",
    label: "Hotel",
    description:
      "A commercial establishment offering private rooms with amenities like en-suite bathrooms and room service, ideal for travelers seeking comfort and convenience.",
  },
  {
    value: "fullhouse",
    label: "Full House",
    description:
      "A rental providing an entire property for guests, offering privacy and home-like amenities, perfect for families or groups.",
  },
];

const selfCheckInOptions = [
  {
    value: "Keypad/Keyless Entry",
    label: "Keypad/Keyless Entry",
    description:
      "This method involves a keypad or smart lock where guests can enter a code to access the property. The code can be set by the host and sent to the guest prior to check-in.",
  },
  {
    value: "Smart Lock",
    label: "Smart Lock",
    description:
      "Smart locks can be accessed via a smartphone app, giving guests access to the property without a physical key. The app typically generates a unique access code for each guest or reservation.",
  },
  {
    value: "Lockbox",
    label: "Lockbox",
    description:
      "A lockbox is a secure container, usually mounted on the property (often near the front door), that holds a key. Guests are provided with the combination to access the key when it's time to check in.",
  },
  {
    value: "Digital Door Lock",
    label: "Digital Door Lock",
    description:
      "These locks are similar to smart locks but might not require an app; instead, they work with a pin code that the host provides to the guest.",
  },
  {
    value: "Bluetooth Access",
    label: "Bluetooth Access",
    description:
      "Some properties use Bluetooth-enabled locks that allow guests to unlock the door through their mobile devices when they are within a certain range.",
  },
  {
    value: "Remote Host/Property Manager",
    label: "Remote Host/Property Manager",
    description:
      "In some cases, a property manager may be available remotely to assist with access, guiding guests through unlocking the door without physical interaction.",
  },
  {
    value: null,
    label: "Additional type",
    description: "Different type of check in.",
  },
];

const iconCurrentLocation = new L.Icon({
  iconUrl: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAcAAEBAAIDAQEAAAAAAAAAAAABAAIGBAUHCAP/xABKEAABAgIHBwEFBQUFBQkBAAABAAIDEQQFEiEiMUEGEyMyM0JRYQdScYGhFEORscEVNGPR8CRTcnPhFmKCg5I1RGR0hJOisrMX/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIBAwT/xAAeEQEBAQEAAgIDAAAAAAAAAAAAARECITESQQNRcf/aAAwDAQACEQMRAD8A9nkCJUn5SVl18u0KMgP7ReO2X+isuveNEFl17weVRkOtyZNVl+8Xjt/r8E3Dr5dv9fggv87p9qL843JoE5dbk7UGf397NJf6IIkjqjB2ql/eGcPRV/317NP0T6xOj2oD1jdPtVpj6OgT/m9PtVpxOl2oC6U39LQKy5ujoq6U3dHtT4n0dEBL/wBhN514QyVd/wAnQKxf8nQIAmQnLgKE8/ujmrT/AMP4TfKbejqgJSN3RVnOz0dU3SmOjqrzLpaoASlNk913BOk2dLuCNZs6Pcofw+l3ILO+F0+5QmOl0u5I/hdPuRfnCkIXdNA+sO6H3IvInBuh6hV/3N0PuUJWRuLmazQUv7kYO5OA9PJAkRwOXuTg+7yQWY/tF2g/oKJ/v7hojP8AeLh26J5ro4kByoIyPXuHajO6Pc3tJMlGTv3i4DlWBNs2Y1ze05IJxc4lsSQYOUyyWTWyEoxnDGU0Nvwx+TtPlZekW5gyQWfUuhjlSb7ol0LRV5ui3M7f0ROd0S6HockFOc950hyrjU+n0Sr6O6kVlSYNGoje+I8NH1WqbcbfUXZ4voFEa2l1hKe6HLBGhefPpmvGK4risK7pYpVZUp8aIOUE4WegGiy1fPG+3qtc+1qraO98KqaFGp4GT4jtxD/EguP4BaxSvattDGBFHhUGjsOTWwy8j5k3rQ1kFmunxjcf/wCl7VESNMgFvu/ZmS/Jcyie1avoAlHo9CpUPVrmOhk/MfyK0SV0zksXGfoFmnxj2eo/avU9Ne2DWkCNVs83E7yF/wBQAI+JAC3ui0mj0uC2NQ40ONRHC58NwcPxXy2u1qDaCs9n6SI1W0pzATjhG+G8eoW6m/j/AE+lPQdHyqc7m9E5latsXttQdpoW4kKPTGNnFoxM5jVzTqJ/MLachIdE5lbK52YbgJM6Xci4iTOl3FMpYWdLuKCQ0hrb4Rz/AFWsDnSluen3FYttTbuukRiVeXYOjqc7tVk27pXw9TJBlrwun3IvHQlu9QnK6Few5omRIQb2nNA5DgcvcgWPu8lcplAE29yQGDpmY+KA5yftF0jcqVsca4DJVzxx8MstFHGZRrgOX1QXU6psy5ViG2p77KeErKQf17gOXT+tFc/WuaOXSaCAtXRRJvaUiZwxuQZTRIOwxbmjlKr3ktjXNGWiCBLiWxBg7StL9pG2P+z1DFCoTg6saQ2cP+Ez3z9ZLaqzp0KrqvpNMpxswKOwvteZaL5trisqRXFa0msaW4mNSIhcZ9oyDR6ASCm1fE1xIkR8V74sRxfEe4uc8mZcTmZrFSVjspJBAzWdGo8emUhtGosF8aM8yYxjZly32pvZPWtKa2LWdJh0FjhOzK2756In5SPP3FC9dHsfoIH/AGxShPuEFsl0tb+yas6M1z6rpcKmMGTHjduPw0TCdx52pfvS6LSKFSXUamQYkCOzOHEbIr8EU/SjUiPRI7KRRYroMeG4OhxWXOaf6011Xv2we1cLaaq7T2th0uBhpUMefeHoV8+rt9lq9i7OV3R6xhlxhNMo8Md8M5iXkZj1CJ6mx9J5ODWdI8xWJaQbLDwib/RYwYrI0KG+A63R4rQ4PBnMETz+ElmMJssvhHmPhW4KVnDDvhnP4JIIIEPkPMfRXLhh3sPMUGbcMK+GczmgiZGzCGDVJw3QuQ5qM2mUK9p5jmgGzIQb2HM5oE4TKEJt7iqTByZKOG6Fe05lVljbmGY+KCA3vXwkZaIGOe9uAyPlXV6+GWSuoJRsIGUtUD1LouGWXqgARLogk0ZeqSBE62EDL1R1MMXC0ZEaoETebMS5oy9VDHhiXNGRVzizFwtHKQi95sxbmDI+UHnHtoriJR6polVNIBpUUvd5LGf6kLx74rd/bFS3R9sNxamyi0VjGjwSST9LK0gZBRXfj0lyauoNIrKn0ehUOHbjR3hjB6+vpquMvU/YrUjHfbK5pDcX7vAd4GbiPoPkUbbkbnshslQdmaHu4bREpMQTjUsjE8+B4b6LYpT4Z6QyKc8DroejvKs+GbofvHVVjhfIlM7vKFoVSJO7M9372qZT4Z6XvKmeT7v3lrHQ7WbLUDaWifZ6UwMiQ5mj0toxwj8dR5BXgFbVbSqprGPQKa2UeC6Rlk7wR6HNfTn8P7r3l5j7a6maaHRK4gsxQn7iK8atPL+BEvmpq+Ovp5IkGRmo5oWOz3H2QVq+m7KNoTzN1BimD6iGcTPwvHyW8chDGchzK8f9iNKcytqxoU8EaA1/zaf5FewDDgbfCOZKqOHXirkwQ72HmKTNhDIYBhnNXJgZew8x8IvYLEOZYcz4WpJmw2Yd7DmfCDOHhhC0DmU8gsw72HMqE4cmwsTTmfCAPDuhXtPN6JstbcwzCJbsyhYmu5idEhrG3MMwgJb1vFwkZK63PhDcvVJ4vUwSynqggRhxMFnJAkb26Jhll6qlvDZiYQ3I+US3t0TDZynqogRcMTCBlPVBdXA/CG5Hyme9wvFlg18q6gsvwgZHygkxMLxYa28E6oPn72nWht5WwdlOEGf4d0z/AFWsLdvbDRnQdsN7Zsw49GYWu8lpLT9A1aR5UPRz6S989lcJrNiKEwya1znvLvUuJXga9t9jdPZTNlnUBzgHUOO4O+DjaH5kfJInv033PhuuhjJypZQncg7kcw3ZuYMneUymN0eQdxVuK/gnk95U793LhjuVK7ddnvI03UsA7kF/Clw/eWr+09jX7C1owibGthvB9REYVtGm5lw/fWk+1+ntomx0ShBwDqZGhw2+SGuD3f8A1l81lbPbw1SPkpS9De/Y3aO1zmjI0Z4d9F7fKwN03kd3eF497EqMYlb1jSXNNiHRxDteCTP8gvYeQbtt7DmfCqOHftT3eBuJrsz4Cr4fDZiadfCgBDG7ZiY7M+FdPhsFppzcNFqVczAy9rsz4RPdmxDFppzKulgYLTXZnwocJoZDFtpzI0QXSFlmIOzPhVhrLmmYT0xZZiBzI0QGNYJMMwgjKOMWCSutz4bOXqnriRwWUfvFxw2dfKCIEa52Czl6q6uAzbZ18qI39xwWfqsXERsBNizkZIJz95gys/VIJiiw8FsrgVi0b2bXYbN0/OizHE4ZFmzdNB5v7aasdSaqolYsh4qHE3bnS7Hf6gLx7+rl9P1pQYNcVdSatpTTuYsMsLvyP6r5trmrKRUta0mrqWJRYD7JOjhoR6EXqa68XxjhLZdgNov9nK9bFiuP2GlShUoDQdr5eWn6ErWlLF19TQorI0Jm7c10JwtMiC8OHlZ5yhGYaMneV4Nsbt9TtnmNolJa6mVZanup8SF6sJu/4TcvXKl2vqGu4TWUOsIbXS5IrrDx8QVTj1xjvC4Dgae8ppJ4RnIZOGS/HfQonDdGhWBfathdVXG1lR1Mx0OnVjCBGTIbrbz8Ghama7p72w2FjyBCaCS8mQA8rwT2i7TDaKut3RYlqgUQFlHM+czvf8/0C5O2ntBpu0EJ1BoLHUSrMnNJ4kb/ABSyH+6PmVpX5KbXXnlKmpdtstUMbaOu6PV0OYhudONEHZDGZ/T5rF249b9kFWOoOyopMRhbErCIYpJzEMYWfK4n/iW78g3Qva7Nw0WMCFDosCHRIDQITWhrZZNAuA+iz5BudD3K3nqODhtvDri7wsLZY7dsxsdm4aKLrJ3Lb2uzd4WTeFwmi006oMr4XDbe12vhEzC4bBaB1T0uGMQdr4mie5wDFa1QPSwtxB30VYDLgZo6IsDEHa+Ehgh3Az1QUvtHNhDVXx7uWWvlUvtF4NmXzmiW+JaMNlBE74eLH1WIBjGRwhtwmM1kAaRdy2PqocfCMNnXygAN7gMwW6+UjjYDhlqkcXAMJbqie+O7GGWqCBEU7s3WdfK0D2rbLOreg/tSgw/7dQmycG5xoQzHxGY+flb+1wikwgLJbqi6NOERlcT5RsuPlj1GSFuHtM2ZFQV4I1GYRQKWXOhEC5j83MP5j0n4K09RjvLsSykD4+aEI1+rozw2wyLFs+LRl+a/INAExL4AKUglJQgiQASbhK8r3b2ZbMmoanEamQbNPpzQ6J5hM7WfHU+pWieyrZb9s1r+0aYz+xUNwLGuF0WKLx8hmfkvbjcdzeS7u8KpHLvr6QFgbnMO1WJm07kgm0eYeqyOAiDmXd3hXIdzzF2vha5sQN2Nzoe5ZdHhATDtU9LhG+1r4QTuuETMu7vCCnupMGIO18JPBwATnqdEF25O7ItWtfCp7kiGcU9UD0cAxWtfCrAh3AzUeDgOK1qqxu7iZ6oKX2i8YZI64ly2Vde+Hgl9UjjXNwFv1QRG/kBNtlHXw8tk/irr3Mm2zn6p62FmEtzPlBdXBlZ1V1sGUtUdXA3CW5nyme9mxuGWqAnvTYAkW6qB3vCylqnqYG4XN18onvBYbJrhm5B1u0VTQNoqopFV0kStCbH+48ZEL5yrOgR6qp8eg0xtiPAeWOHnwR6FfT4x8Js2ubm7yvOfa5sz9uoX7YoMO1S6E2VIAF8SF5+Lfymsq+evLxxSpggEGYKlLslKUglzqkqykV3W9FqyhtnGpD7M9GDMuPoAJ/guDOV/he3+y7ZUVPVrqdTWEVjTmDP7qHmB8Tmfl4WyJ66yNtqeq6PU9WQKpojJQoTLIdqfJPqSudlwTMk93hAw8Hu0cnl4R5j3KnASscI32tVdPhC8u18KlY4Jvc7J3hIwHdG8nJ3hAdLhZ2tUzELhG+1r4mrk4br3OuDvCp7sbt2Jxyd4QRO64cp2tUdDBnPVPTwOxF2vhE91Jj8U9UD0sGdrIosbu6c9VdHC7FayPhNgsuc6ZQEt9IswyUeOJMw2c/VR4wIhYZZ6KvjS3WGWfqgTxpBmGzmgzjGwzCW5lR410PDZzSZxRZhmRbmSguqLDTZLcz5RPe8NuFwzKTxRZhmyW5nJBIigth3OGZNyBPEG7aZObmVE7ycNtzm5ukjqixDuc3MnVXPw2XPbmfKCI3g3bbi3u8rEi20wZC1KRLhcfKzOMbtlzm5lErbd0DjGZ8oPAPaJssdmq6P2dh+wUkl8E6MOrPlp6LVV9JbVVDA2jqWPVcWTY5FqFGInYiDI+o8+i+c6ZRY9BpcaiUyEYVIgvLIjCcnD9PzEipsduLr8VKXLqiraTXFZUegUJtqPHfZbdcPJPoM1im0+zDZb9v1z9ppbJ0ChkOdPKJE7W/qfw1u91aZDc93mWS66oKootRVTAqmhCW6F75czjeXH4rsZgcO/eHuVRx6u1SkNzPEe5Qw8F3McnJyG6+8OTkZDdE4zkVqUMDd0b3OyKRgG6N5dk5AwDdG95yKeVu7eZudkfCC5BYdeXXA+FA7uUN17nXAyVycN97nZFE93gfMvdcD4QI4fDde52RQDucDsTjlJUxCwxL3OyI0UCIQDYmJxyIvQQG6FlxtF2R8KDHMuc6aRwhZiYi7I5yUGOZc4zKCPFHCwyz9UHijh4SM1EbwSg3SuOiTxJbq4jNAGcWW6w2eZRO8wwzIjM5JI3l0G6XNoh2MShGy5ovkgibYsw7nDM+VTEUFkO5wzK/NoETp3Obc4jVZjELMMWXDMoEneCxDwvbmfKefhsueM3eVE2xZhmTxmUGTxYh3PGZkgr4mBmF7cynmG7F0Qa+VHFgZc8ZlRlYsi5wzcf5oAi03dgyiDNy809rmzBpUAV3QoRdSaO2zS2tHMz3vl58fBegRa0q+Fw4tPosOKMy6M0fquLE2kqNgLDW9BbEbmd81Y2bK+a8sRMhn8AvZvZLswKuoDq1pbLNPpjBuWuEjCg6fAuz+Eh5XODPZ99q38P9jtpAdatAiU5znLL6Lv4e0tQkWG1vQrZ13zQki+utnh23bufvPeTMS3f3h1XCg1rV0Zu7hVlRHxPebGaf1XMa5rm2WG08jnF/1Woxfwj1PeSLpwieIdUTu3Z6nlJEhu3mbzkUYpWRu3dQ5Hwjl4br3nI+E5Cw6+IciiVkGG6+IciguTA697sj4RaDDun3vOTli91g7t2KI7I+EtAZJsTE85HwgybgwRL3uyKgd2LETE85FIwCzEvecioHd3Rb3nI5oLp4YmIuyKg1zLnmZQOGLMW9x5Smy5tzzMoLqXQMMs/VHPdBwkc0rkmbv3fD5GSuboXEZoAmfSNkjP1WF8Uyh4S3mIuWZxiUC73tJqEnXUfC5vNpNBiBbuhCyRmRdNZ3RLoVz9SrmuhXO19UGRwwRJwz0QXPhh4XjMrUtotsYlFrJ9T1DQDTq0hBpjuLrEKDMdztc5yC23MShXP7itMr7ZOn/tmkV1svTmQKdHa0Uqix2zhRy0ATn2mQA/lrlbM+3WOo219ZYqy2jbQgc4NXQQz/5c31X4nYqgUhxdWNOrSnOOZpFLcfyvWT67r6rSYddbMUoWeaNQnCK0/LT8Uw9tqjJlSI0eikZ/aIDmS+cpJG+WcLYvZ2FnVkOJ/mxHv/Mr927NVC3lqagD/wBO0/WSyg7T1FHHDrahOnlxQFymVpVzxgp1Gd8IoQ8uONm6jz/Y1Xz/APLt/ksX7L1A84qlq+fkUdoK5v7RoIH75R/nECxNaVe291OozR53g/mh5dbE2O2ciAg1VAb/AIHPZ+RXH/2HquCbVAj1jQ3+9ApjhL4TmufH2oqGB1a2og+EUFcN+21R/wDd48eknKzR6O95P0Q8shQNqqvIdVO1MaOBlBrCEIo/6ub6hdpUe2NNNZQqo2kq1tDpsc2aPSYLrUKM7OUzynPyuqh13XlYmxUuy9Ldayi014gs/r5rs6l2RrOLW1Hrbamnw4tIoxtUWhUUShQnESmSeYyn/PKQ/rduUWHXxDylYOdZbYdfF0JzWQmBZf1u0ouabMTq9rvyWpDRu8MTFFdkfCyADMMW+IcnKlK6LfEPKfCiALoonE7T+SBODDFxPORVc26Liecii5uGLe85Hwm5uGMLTjkc0FyYYuJ3aSqy9tzzMqubdGvdp6KAeOoZn4oDm/dzKXMQq998DDLP1Ub/AN3u8zVzDgZ6oGVqW4Nn3kTLujcRzJN/7vn3Kz6PP3IDmugkB/cmQMxBwv1VOd0Hm7lTz3POMygJgmUISf3KkL2w7oozKfSF1Nf1Rl0wd7qgua6HdE7ivyjUaBHFl8CFFinmL2A/mF+s53Q+r3KN9zTxdUNdXSNnKkpILYlU0OJElfaggfouFE2G2Vi4XVFQXRfO6Ww6Sb1tU6Ybo2s0brWDsBsmWhn7DoW9/wAEl+sLYbZaELLahoO98mEFsU9PvlXDScXyhrqYGzlSQJNg1TQ2RxkRBC7CFRoEHDCgw4cXyxgC/b/90GWRui6Iaf8AdnxvKMsLusciqeh62iv8V8bRGLK5/V7SnluffFORRfKTzxu1OVzzxdEBldFvidqZDli3xDylGkoh4naUzulEB3mkkASBIRb39qgJda9+ibsovP2lH+cMZyKCJAui3u7UyeOoZlE5XRubtVxPvM0H/9k=`,
  iconSize: [15, 15],
  iconAnchor: [0, 0],
  popupAnchor: [1, -34],
});

/* #endregion */

export default function AdminPropertyDetail() {
  let { id } = useParams();

  const admin = AdminRequest();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState(true);
  const [viewCategory, setViewCategory] = useState(true);
  const [viewLocation, setViewLocation] = useState(true);
  const [viewBasic, setViewBasic] = useState(true);
  const [about, setAbout] = useState(false);
  const [guessAccess, setGuessAccess] = useState(false);
  const [detail, setDetail] = useState(false);
  const [amenity, setAmenity] = useState(true);
  const [photo, setPhoto] = useState(false);
  const [availability, setAvailability] = useState(true);
  const [refund, setRefund] = useState(true);
  const [checkInType, setCheckInType] = useState(true);
  const [bookingType, setBookingType] = useState(true);
  const [additionalPolicy, setAdditionalPolicy] = useState(true);
  const [propertyStatus, setPropertyStatus] = useState(false);
  const [isShowReview, setIsShowReview] = useState();

  const [location, setLocation] = useState("");
  const getListingById = GetListingByIdRequest(id);
  const rightRef = useRef();

  useEffect(() => {
    if (getListingById.isSuccess) {
      const addressArr = getListingById.data.data.addressCode.split("_");

      const province = dchc.data.find((item) => item.level1_id == addressArr[0]);
      const district = province.level2s.find((item) => item.level2_id == addressArr[1]);
      const ward = district.level3s.find((item) => item.level3_id == addressArr[2]);

      setLocation(
        province.name +
          ", " +
          district.name +
          ", " +
          ward.name +
          ", " +
          getListingById.data.data.addressDetail
      );
    }
  }, [getListingById.isSuccess]);

  useEffect(() => {
    const event = () => {
      if (window.scrollY > 150) {
        rightRef.current.style.position = "fixed";
        rightRef.current.style.top = "0";
      } else {
        rightRef.current.style.position = "relative";
      }
    };

    document.addEventListener("scroll", event);

    return () => {
      document.removeEventListener("scroll", event);
    };
  }, []);

  if (getListingById.isLoading) {
    return <WaitingPopUp />;
  }

  return (
    <>
      <Container>
        <Left>
          <PropertyTitleStyled>
            <h2>{getListingById.data.data.propertyTitle}</h2>
            <div>
              <div>
                {getListingById.data.data.bookingType == "instant" ? (
                  <PiLightningFill />
                ) : (
                  <PiLightningSlashBold />
                )}
                <p>
                  Instant book {getListingById.data.data.bookingType == "instant" ? "on" : "off"}
                </p>
              </div>
              {getListingById.data.data.status == "PUBLIC" && (
                <StatusStyled>
                  <FaGlobe /> <span>Public</span>
                </StatusStyled>
              )}

              {getListingById.data.data.status == "DISABLED" && (
                <StatusStyled>
                  <FaBan /> <span>Disabled</span>
                </StatusStyled>
              )}

              {getListingById.data.data.status == "ADMIN_DISABLED" && (
                <StatusStyled>
                  <FaShieldAlt /> <span>Admin Disabled</span>
                </StatusStyled>
              )}

              {getListingById.data.data.status == "DENIED" && (
                <StatusStyled>
                  <MdCancelPresentation /> <span>Denied</span>
                </StatusStyled>
              )}

              {getListingById.data.data.status == "PENDING" && (
                <StatusStyled>
                  <FaHourglassHalf /> <span>Pending</span>
                </StatusStyled>
              )}
            </div>
          </PropertyTitleStyled>
          <div>
            <ViewMoreStyled onClick={() => setViewType((prev) => !prev)}>
              View property type {viewType ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {viewType && (
              <>
                {[
                  propertyOptions.find(
                    (item) => item.value == getListingById.data.data.propertyType
                  ),
                ].map((item, index) => {
                  return (
                    <ItemStyled key={index}>
                      <h4>{item.label}</h4>
                      <p>{item.description}</p>
                    </ItemStyled>
                  );
                })}
              </>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setViewCategory((prev) => !prev)}>
              View category type{" "}
              {viewCategory ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {viewCategory && (
              <ItemStyled>
                <h4>{getListingById.data.data.propertyCategory.categoryName}</h4>
                <p>{getListingById.data.data.propertyCategory.description}</p>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setViewLocation((prev) => !prev)}>
              View Location {viewLocation ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {viewLocation && (
              <ItemStyled>
                <h4>{location}</h4>
                <CoordinateContainer>
                  <MapContainer
                    center={[
                      getListingById.data.data.coordinatesX,
                      getListingById.data.data.coordinatesY,
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        getListingById.data.data.coordinatesX,
                        getListingById.data.data.coordinatesY,
                      ]}
                      icon={iconCurrentLocation}
                    >
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </CoordinateContainer>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setViewBasic((prev) => !prev)}>
              View property basic {viewBasic ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {viewBasic && (
              <ItemStyled>
                <h4>
                  {getListingById.data.data.maximumGuest} Guest,{" "}
                  {getListingById.data.data.numberOfBedRoom} Bedrooms,{" "}
                  {getListingById.data.data.numberOfBed} Beds,{" "}
                  {getListingById.data.data.numberOfBathRoom} Bathrooms
                </h4>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setAbout((prev) => !prev)}>
              View property description{" "}
              {about ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {about && (
              <ItemStyled>
                <div dangerouslySetInnerHTML={{ __html: getListingById.data.data.aboutProperty }} />
                <div dangerouslySetInnerHTML={{ __html: getListingById.data.data.guestAccess }} />
                <div dangerouslySetInnerHTML={{ __html: getListingById.data.data.detailToNote }} />
              </ItemStyled>
            )}
          </div>
          {getListingById.data.data.guestAccess && (
            <>
              <hr />
              <div>
                <ViewMoreStyled onClick={() => setGuessAccess((prev) => !prev)}>
                  View property guess access{" "}
                  {guessAccess ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
                </ViewMoreStyled>
                {guessAccess && (
                  <ItemStyled>
                    <div
                      dangerouslySetInnerHTML={{ __html: getListingById.data.data.guestAccess }}
                    />
                    <div
                      dangerouslySetInnerHTML={{ __html: getListingById.data.data.detailToNote }}
                    />
                  </ItemStyled>
                )}
              </div>
            </>
          )}
          {getListingById.data.data.detailToNote && (
            <>
              <hr />
              <div>
                <ViewMoreStyled onClick={() => setDetail((prev) => !prev)}>
                  View property detail to note{" "}
                  {detail ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
                </ViewMoreStyled>
                {detail && (
                  <ItemStyled>
                    <div
                      dangerouslySetInnerHTML={{ __html: getListingById.data.data.detailToNote }}
                    />
                  </ItemStyled>
                )}
              </div>
            </>
          )}
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setAmenity((prev) => !prev)}>
              View property amenities{" "}
              {amenity ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {amenity && (
              <ItemStyled>
                <h4>
                  {" "}
                  {getListingById.data.data.propertyAmenities
                    .map((amenity) => amenity.name)
                    .join(", ")}
                </h4>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setPhoto((prev) => !prev)}>
              View property photos {photo ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {photo && (
              <ItemStyled>
                <ImageContainerStyled $length={getListingById.data.data.propertyImages.length}>
                  {getListingById.data.data.propertyImages.map((image, index) => (
                    <div key={index}>
                      <img src={image} />
                    </div>
                  ))}
                </ImageContainerStyled>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setAvailability((prev) => !prev)}>
              View property price and availability{" "}
              {availability ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {availability && (
              <AvailabilityStyled>
                <ul>
                  <li>
                    <div>
                      <h4>Property base price: </h4>
                      <p>${getListingById.data.data.basePrice}</p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h4>Property weekly discount: </h4>
                      <p>{getListingById.data.data.weeklyDiscount}%</p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h4>Property monthly discount: </h4>
                      <p>{getListingById.data.data.monthlyDiscount}%</p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h4>How far in advance can guests book: </h4>
                      <p>
                        {getListingById.data.data.maximumMonthPreBook
                          ? getListingById.data.data.maximumMonthPreBook + " months"
                          : "Any times"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h4>Minimum stay guess can book: </h4>
                      <p>
                        {getListingById.data.data.minimumStay
                          ? getListingById.data.data.minimumStay + " days"
                          : "Any times"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h4>Maximum stay guess can book: </h4>
                      <p>
                        {getListingById.data.data.maximumStay
                          ? getListingById.data.data.maximumStay + " days"
                          : "Any times"}
                      </p>
                    </div>
                  </li>
                </ul>
              </AvailabilityStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setRefund((prev) => !prev)}>
              View property refund policy{" "}
              {refund ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {refund && (
              <ItemStyled>
                <h4>{getListingById.data.data.refund.policyName}</h4>
                <p>{getListingById.data.data.refund.policyDescription}</p>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setCheckInType((prev) => !prev)}>
              View property check-in type{" "}
              {checkInType ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {checkInType && (
              <ItemStyled>
                <h4>
                  {!getListingById.data.data.selfCheckIn
                    ? "Host-Managed Check-in"
                    : "Self Check-in"}
                </h4>
                <p>
                  {!getListingById.data.data.selfCheckIn
                    ? "This method requires the guest to meet the host or a property manager upon arrival. The host will physically hand over the key and show the guest around the property."
                    : "Self check-in allows guests to independently access the property without needing to meet the host in person."}
                </p>
                {getListingById.data.data.selfCheckIn && (
                  <>
                    <br />
                    <hr />
                    <br />
                    {getListingById.data.data.selfCheckIn && (
                      <>
                        {[
                          selfCheckInOptions.find(
                            (item) => item.value == getListingById.data.data.selfCheckInType
                          ),
                        ].map((item, index) => (
                          <Fragment key={index}>
                            <h4>{item.label}</h4>
                            <p>{item.description}</p>
                          </Fragment>
                        ))}
                      </>
                    )}
                  </>
                )}
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setBookingType((prev) => !prev)}>
              View property book type{" "}
              {bookingType ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {bookingType && (
              <ItemStyled>
                <h4>
                  {getListingById.data.data.bookingType == "instant"
                    ? "Instant book"
                    : "Reserved book"}
                </h4>
                <p>
                  {getListingById.data.data.bookingType == "instant"
                    ? "Guests can book properties instantly without waiting for host approval. Perfect for last-minute stays, ensuring quick confirmation and hassle-free reservations"
                    : "Guests request a booking and wait for host approval before confirming. Ideal for those who prefer more flexibility and time to finalize details."}
                </p>
              </ItemStyled>
            )}
          </div>
          <hr />
          <div>
            <ViewMoreStyled onClick={() => setAdditionalPolicy((prev) => !prev)}>
              View property price and availability{" "}
              {additionalPolicy ? <HiMiniArrowSmallDown /> : <HiMiniArrowSmallRight />}{" "}
            </ViewMoreStyled>
            {additionalPolicy && (
              <AvailabilityStyled>
                <ul>
                  <li>
                    <div>
                      <h4>Check in after: </h4>
                      <p>{getListingById.data.data.checkInAfter}</p>
                    </div>
                  </li>
                </ul>
                <ul>
                  <li>
                    <div>
                      <h4>Check out before: </h4>
                      <p>{getListingById.data.data.checkOutBefore}</p>
                    </div>
                  </li>
                </ul>
              </AvailabilityStyled>
            )}
          </div>
        </Left>
        <Right>
          <RightContainerStyled ref={rightRef}>
            <UserColumn>
              <div>
                <Avatar
                  round
                  size="70"
                  src={getListingById.data.data.user.avatar}
                  name={getListingById.data.data.user.firstName}
                />
              </div>
              <div>
                <h4>{getListingById.data.data.user.email}</h4>
                <p>
                  {getListingById.data.data.user.firstName} {getListingById.data.data.user.lastName}
                </p>
              </div>
            </UserColumn>

            <div>
              {admin.data.data.roles.find(
                (role) => role.roleName == "ADMIN" || role.roleName == "USER_MANAGEMENT"
              ) && (
                <button
                  onClick={() =>
                    navigate("/admin/user_list?search=" + getListingById.data.data.user.email)
                  }
                >
                  View host detail
                </button>
              )}
              {admin.data.data.roles.find(
                (role) => role.roleName == "ADMIN" || role.roleName == "BOOKING_MANAGEMENT"
              ) && (
                <button
                  onClick={() =>
                    navigate("/admin/booking_list?property=" + getListingById.data.data.id)
                  }
                >
                  View property booking
                </button>
              )}
              <button onClick={() => setPropertyStatus(getListingById.data.data)}>
                Change property status
              </button>
              <button onClick={() => setIsShowReview(getListingById.data.data.id)}>
                View property review
              </button>
            </div>
          </RightContainerStyled>
        </Right>
      </Container>
      {propertyStatus && (
        <PropertyStatusPopUp
          request={getListingById}
          listing={propertyStatus}
          action={() => setPropertyStatus()}
        />
      )}
      {isShowReview && (
        <PropertyDetailReviewPopUp action={() => setIsShowReview()} propertyId={isShowReview} />
      )}
    </>
  );
}
