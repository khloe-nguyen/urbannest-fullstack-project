import { CgProfile } from "react-icons/cg";
import { PiCity } from "react-icons/pi";
import { FaSwimmingPool } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { FaRegMessage } from "react-icons/fa6";
import { IoNotificationsCircle } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { BsFillHousesFill } from "react-icons/bs";
import { FaCalendar } from "react-icons/fa";

const sidebar_content = [
  {
    name: "Dashboard",
    type: "button",
    icon: <CgProfile />,
    link: "/admin",
    role: ["ADMIN", "EMPLOYEE"],
  },
  {
    name: "Employee",
    type: "group",
    icon: <FaUserTie />,
    role: ["ADMIN", "EMPLOYEE_MANAGEMENT"],
    children: [
      {
        name: "Employee list",
        icon: <FaListUl />,
        link: "/admin/employee_list",
        role: ["EMPLOYEE_MANAGEMENT", "ADMIN"],
      },
      {
        name: "Create new employee",
        icon: <FaPlus />,
        link: "/admin/create_employee",
        role: ["EMPLOYEE_MANAGEMENT", "ADMIN"],
      },
    ],
  },
  {
    name: "User",
    type: "group",
    icon: <FaUser />,
    role: ["ADMIN", "USER_MANAGEMENT"],
    children: [
      {
        name: "User list",
        icon: <FaListUl />,
        link: "/admin/user_list",
        role: ["USER_MANAGEMENT", "ADMIN"],
      },
      {
        name: "User document",
        icon: <FaAddressCard />,
        link: "/admin/user_document",
        role: ["USER_MANAGEMENT", "ADMIN"],
      },
    ],
  },
  {
    name: "Managed City",
    type: "button",
    icon: <PiCity />,
    link: "/admin/managed_city",
    role: ["ADMIN", "CITY_MANAGEMENT"],
  },
  {
    name: "Amenities",
    type: "group",
    icon: <FaSwimmingPool />,
    role: ["ADMIN", "AMENITY_MANAGEMENT"],
    children: [
      {
        name: "Amenity list",
        icon: <FaListUl />,
        link: "/admin/amenity_list",
        role: ["AMENITY_MANAGEMENT", "ADMIN"],
      },
      {
        name: "Create new amenity",
        icon: <FaPlus />,
        link: "/admin/new_amenity",
        role: ["AMENITY_MANAGEMENT", "ADMIN"],
      },
    ],
  },
  {
    name: "Category",
    type: "group",
    icon: <TbCategory />,
    role: ["ADMIN", "CATEGORY_MANAGEMENT"],
    children: [
      {
        name: "Category list",
        icon: <FaListUl />,
        link: "/admin/category_list",
        role: ["CATEGORY_MANAGEMENT", "ADMIN"],
      },
      {
        name: "Create new category",
        icon: <FaPlus />,
        link: "/admin/new_category",
        role: ["CATEGORY_MANAGEMENT", "ADMIN"],
      },
    ],
  },
  {
    name: "Listings",
    type: "button",
    icon: <BsFillHousesFill />,
    link: "/admin/listing_list",
    role: ["ADMIN", "PROPERTY_MANAGEMENT"],
  },
  {
    name: "Booking",
    type: "group",
    icon: <FaCalendar />,
    role: ["ADMIN", "BOOKING_MANAGEMENT"],
    children: [
      {
        name: "Booking list",
        icon: <FaListUl />,
        link: "/admin/booking_list",
        role: ["BOOKING_MANAGEMENT", "ADMIN"],
      },
    ],
  },
  {
    name: "Message",
    type: "button",
    icon: <FaRegMessage />,
    link: "/admin/messages",
    role: ["ADMIN", "MESSAGE_MANAGEMENT"],
  },
  {
    name: "Notification",
    type: "button",
    icon: <IoNotificationsCircle />,
    link: "/admin/admin_notification",
    role: ["ADMIN", "EMPLOYEE"],
  },
  // {
  //   name: "Mail",
  //   type: "group",
  //   icon: <IoMailOpen />,
  //   role: ["ADMIN", "MAIL_MANAGEMENT"],
  //   children: [
  //     {
  //       name: "Mail list",
  //       icon: <FaListUl />,
  //       link: "/admin/mail_list",
  //       role: ["CATEGORY_MANAGEMENT", "ADMIN"],
  //     },
  //     {
  //       name: "Create new mail",
  //       icon: <FaPlus />,
  //       link: "/admin/create_mail",
  //       role: ["CATEGORY_MANAGEMENT", "ADMIN"],
  //     },
  //   ],
  // },
];

export default sidebar_content;
