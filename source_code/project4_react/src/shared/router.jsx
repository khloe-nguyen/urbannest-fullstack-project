import { createBrowserRouter } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import HomePage from "@/feature/customer/homepage/HomePage";
import DashBoard from "@/feature/admin/dashboard/DashBoard";
import AdminLayout from "./layout/AdminLayout";
import AdminLogin from "@/feature/admin/admin_login/AdminLogin";
import HostLayout from "./layout/HostLayout";
import Hosting from "@/feature/customer/hosting/Hosting";
import ManagedCity from "@/feature/admin/managed_city/ManagedCity";
import Amenity from "@/feature/admin/amenity/Amenity";
import CreateAmenity from "@/feature/admin/create_amenity/CreateAmenity";
import EditAmenity from "@/feature/admin/edit_amenity/EditAmenity";
import CreateCategory from "@/feature/admin/create_category/CreateCategory";
import Category from "@/feature/admin/category/Category";
import UpdateCategory from "@/feature/admin/update_category/UpdateCategory";
import CreateListing from "@/feature/customer/create_listing/CreateListing";
import CreateListingInitial from "@/feature/customer/create_listing/components/CreateListingInitial";
import ListingDetailIntro from "@/feature/customer/create_listing/components/ListingDetailIntro";
import CategoryListing from "@/feature/customer/create_listing/components/CategoryListing";
import LocationListing from "@/feature/customer/create_listing/components/LocationListing";
import AmenityListing from "@/feature/customer/create_listing/components/AmenityListing";
import BasicListing from "@/feature/customer/create_listing/components/BasicListing";
import PhotoListing from "@/feature/customer/create_listing/components/PhotoListing";
import DetailListing from "@/feature/customer/create_listing/components/DetailListing";
import PricingListing from "@/feature/customer/create_listing/components/PricingListing";
import PolicyListing from "@/feature/customer/create_listing/components/PolicyListing";
import PropertyDetail from "@/feature/customer/property_detail/PropertyDetail";
import HostListing from "@/feature/customer/host_listing/HostListing";
import HostCalendar from "@/feature/customer/host_calendar/HostCalendar";
import HostMessages from "@/feature/customer/host_messages/HostMessages";
import HostReservation from "@/feature/customer/host_reservation/HostReservation";
import CreateEmployee from "@/feature/admin/create_employee/CreateEmployee";
import EmployeeList from "@/feature/admin/employee_list/EmployeeList";
import UpdateEmployee from "@/feature/admin/update_employee/UpdateEmployee";
import UserList from "@/feature/admin/user_list/UserList";
import UserDocument from "@/feature/admin/user_document/UserDocument";
import ListingList from "@/feature/admin/listing_list/ListingList";
import AdminPropertyDetail from "@/feature/admin/admin_property_detail/AdminPropertyDetail";
import AmenityChart from "@/feature/admin/amenity_chart/AmenityChart";
import Transaction from "@/feature/customer/booking/components/Transacsion";
import AdminBookingList from "@/feature/admin/admin_booking_list/AdminBookingList";
import CustomerMessages from "@/feature/customer/customer_messages/CustomerMessages";
import AdminMessage from "@/feature/admin/admin_message/AdminMessage";
import AdminCreateMail from "@/feature/admin/admin_mail/AdminCreateMail";
import MailList from "@/feature/admin/mail_list/MailList";
import EditMail from "@/feature/admin/edit_mail/EditMail";
import CustomerTrips from "@/feature/customer/customer_trips/CustomerTrips";
import HostDiscount from "@/feature/customer/host_discount/HostDiscount";
import AccountSetting from "@/feature/customer/account_settings/AccountSetting";
import PersonalInfo from "@/feature/customer/account_settings/components/PersonalInfo";
import GovernmentID from "@/feature/customer/account_settings/components/GovernmentID";
import LoginAndSecurity from "@/feature/customer/account_settings/pages/LoginAndSecurity";
import WishListDetail from "@/feature/customer/wishlist/WishListDetail";
import WishList from "@/feature/customer/wishlist/WishList";
import UserProfile from "@/feature/customer/user_profile/UserProfile";
import UserShow from "@/feature/customer/user_profile/UserShow";
import Test from "@/feature/customer/test/Test";
import DisputeList from "@/feature/admin/dispute_list/DisputeList";
import DisputeDetail from "@/feature/admin/dispute_detail/DisputeDetail";
import AdminNotification from "@/feature/admin/admin_notification/AdminNotification";
import CustomerNotification from "@/feature/customer/customer_notification/CustomerNotification";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <UserLayout />,
      children: [
        { path: "customer_notification", element: <CustomerNotification /> },
        { path: "test", element: <Test /> },
        { path: "user/show/:id", element: <UserShow /> },
        { path: "user-profile", element: <UserProfile /> },
        { path: "account-settings", element: <AccountSetting /> },
        { path: "account-settings/login-and-sercurity", element: <LoginAndSecurity /> },
        {
          path: "/wishlist",
          element: <WishList />,
        },
        {
          path: "/wishlist/wishlist-detail/:collectionName",
          element: <WishListDetail />,
        },
        { path: "account-settings/personal-info", element: <PersonalInfo /> },
        { path: "account-settings/personal-info/govermentSetting", element: <GovernmentID /> },
        { path: "", element: <HomePage /> },
        { path: "/property_detail", element: <PropertyDetail /> },
        { path: "/property_detail/:property_id", element: <PropertyDetail /> },

        { path: "/messages", element: <CustomerMessages /> },
        { path: "/booking/transaction/:booking_id", element: <Transaction /> },
        { path: "/trips", element: <CustomerTrips /> },
        {
          path: "/hosting",
          element: <HostLayout />,
          children: [
            { path: "", element: <Hosting /> },
            { path: "listing", element: <HostListing /> },
            { path: "calendar", element: <HostCalendar /> },
            { path: "host_messages", element: <HostMessages /> },
            { path: "host_reservation", element: <HostReservation /> },
            { path: "host_discount", element: <HostDiscount /> },
          ],
        },
        {
          path: "become_a_host",
          element: <CreateListing />,
          children: [
            {
              path: "",
              element: <CreateListingInitial />,
            },
            {
              path: ":listing_id",
              element: <ListingDetailIntro />,
            },
            {
              path: ":listing_id/category",
              element: <CategoryListing />,
            },
            {
              path: ":listing_id/location",
              element: <LocationListing />,
            },
            {
              path: ":listing_id/amenity",
              element: <AmenityListing />,
            },
            {
              path: ":listing_id/basic",
              element: <BasicListing />,
            },
            {
              path: ":listing_id/photo",
              element: <PhotoListing />,
            },
            {
              path: ":listing_id/detail",
              element: <DetailListing />,
            },
            {
              path: ":listing_id/pricing",
              element: <PricingListing />,
            },
            {
              path: ":listing_id/policy",
              element: <PolicyListing />,
            },
          ],
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "",
          element: <DashBoard />,
        },
        {
          path: "managed_city",
          element: <ManagedCity />,
        },
        {
          path: "amenity_list",
          element: <Amenity />,
        },
        {
          path: "new_amenity",
          element: <CreateAmenity />,
        },
        {
          path: "edit_amenity",
          element: <EditAmenity />,
        },
        {
          path: "new_category",
          element: <CreateCategory />,
        },
        {
          path: "category_list",
          element: <Category />,
        },
        {
          path: "edit_category",
          element: <UpdateCategory />,
        },
        {
          path: "create_employee",
          element: <CreateEmployee />,
        },
        {
          path: "employee_list",
          element: <EmployeeList />,
        },
        {
          path: "update_employee/:id",
          element: <UpdateEmployee />,
        },
        {
          path: "user_list",
          element: <UserList />,
        },
        {
          path: "user_document",
          element: <UserDocument />,
        },
        {
          path: "listing_list",
          element: <ListingList />,
        },
        {
          path: "admin_property_detail/:id",
          element: <AdminPropertyDetail />,
        },
        {
          path: "amenity_chart",
          element: <AmenityChart />,
        },
        {
          path: "booking_list",
          element: <AdminBookingList />,
        },
        {
          path: "messages",
          element: <AdminMessage />,
        },
        {
          path: "create_mail",
          element: <AdminCreateMail />,
        },
        {
          path: "mail_list",
          element: <MailList />,
        },
        {
          path: "edit_mail/:id",
          element: <EditMail />,
        },
        {
          path: "dispute_list",
          element: <DisputeList />,
        },
        {
          path: "dispute_detail/:id",
          element: <DisputeDetail />,
        },
        {
          path: "admin_notification",
          element: <AdminNotification />,
        },
      ],
    },
    {
      path: "/admin_login",
      element: <AdminLogin />,
    },
  ],
  { basename: "/UrbanNest" }
);

export default router;
