import { useState } from "react";
import styled from "styled-components";
import { GetHostListingsRequest } from "./api/hostListingApi";
import Avatar from "react-avatar";
import { formatDate } from "@/shared/utils/DateTimeHandle";
import dchc from "@/shared/data/dchc";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Pagination from "@/shared/components/Pagination/Pagination";
import { CiSquarePlus } from "react-icons/ci";
import SelectInput from "@/shared/components/Input/SelectInput";
import RedButton from "@/shared/components/Button/RedButton1";
import TextInput from "@/shared/components/Input/TextInput";
import { PiLightningFill } from "react-icons/pi";
import { PiLightningSlashBold } from "react-icons/pi";

const ContainerStyled = styled.div`
  padding: 3rem 0;
  width: 90%;
  margin: auto;
`;

const HeaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BodyStyled = styled.div`
  margin: 3rem 0;
  min-height: 20rem;

  & h4 {
    font-size: 16px;
  }
`;

const TableContentStyled = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background-color: #f7f7f7;
  }

  tbody tr svg {
    font-size: 20px;
    color: white;
  }
  tbody tr:hover svg {
    color: black;
    font-size: 20px;
  }

  & p {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const ListingStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Active = styled.span`
  &::before {
    background-color: red;
    border-color: #78d965;
    box-shadow: 0px 0px 6px 1.5px #94e185;
    content: " ";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 12px;
    border: 1px solid #000;
    border-radius: 10px;
  }
`;

const StatusStyled = styled.div`
  font-size: 16px;
  display: flex;
`;

const FooterStyled = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
`;

const HeaderFilterStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  & svg {
    font-size: 40px;
    cursor: pointer;
    background-color: #f7f7f7;
  }

  & svg:active {
    transform: scale(0.9);
  }
`;

const BookingTypeStyled = styled.div`
  display: flex;
  gap: 10px;

  svg {
    color: yellow !important;
  }
`;

const CustomSelectInput = styled(SelectInput)`
  width: 10rem;
`;

const options = [
  { label: "All", value: "All" },
  { label: "In progress", value: "PROGRESS" },
  { label: "Public", value: "PUBLIC" },
];

export default function HostListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(options[0]);
  const [search, setSearch] = useState("");
  const getHostListings = GetHostListingsRequest(currentPage - 1, 10, search, status.value);
  const navigate = useNavigate();

  return (
    <ContainerStyled>
      <HeaderStyled>
        <h1>Your listings</h1>
        <HeaderFilterStyled>
          <div>
            <TextInput state={search} setState={setSearch} placeholder={"Search for name"} />
          </div>
          <div>
            <CustomSelectInput state={status} setState={setStatus} options={options} />
          </div>
          <div>
            <RedButton onClick={() => navigate("/become_a_host")}>Add</RedButton>
          </div>
        </HeaderFilterStyled>
      </HeaderStyled>

      <BodyStyled>
        <TableContentStyled>
          <thead>
            <tr>
              <th>
                <h4>Listing</h4>
              </th>
              <th>
                <h4>Location</h4>
              </th>
              <th>
                <h4>Instant book</h4>
              </th>
              <th>
                <h4>Status</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            {getHostListings.isSuccess &&
              getHostListings.data.data.map((listing, index) => {
                let province;
                let district;

                if (listing.addressCode) {
                  province = dchc.data.find(
                    (dchcProvince) => dchcProvince.level1_id == listing.addressCode.split("_")[0]
                  );
                  district = province.level2s.find(
                    (dchcDistrict) => dchcDistrict.level2_id == listing.addressCode.split("_")[1]
                  );
                }

                return (
                  <tr onClick={() => navigate("/become_a_host/" + listing.id)} key={index}>
                    <td>
                      <ListingStyled>
                        <Avatar name="_" round={10} size="70" src={listing.propertyImages[0]} />
                        <h4>
                          {listing.propertyTitle
                            ? listing.propertyTitle
                            : `Your listing stated at ${formatDate(listing.createdAt)}`}
                        </h4>
                      </ListingStyled>
                    </td>
                    <td>
                      {listing.addressCode && (
                        <p>
                          {district.name}, {province.name}
                        </p>
                      )}
                    </td>
                    <td>
                      <BookingTypeStyled>
                        {listing.bookingType == "instant" ? (
                          <>
                            <PiLightningFill />
                            <p>On</p>
                          </>
                        ) : (
                          <>
                            <PiLightningSlashBold />
                            <p>Off</p>
                          </>
                        )}
                      </BookingTypeStyled>
                    </td>
                    <td>
                      {listing.status == "ADMIN_DISABLED" && (
                        <StatusStyled>
                          <p>Admin disabled</p>
                        </StatusStyled>
                      )}
                      {listing.status == "PROGRESS" && (
                        <StatusStyled>
                          <p>In progress</p>
                        </StatusStyled>
                      )}
                      {listing.status == "PUBLIC" && (
                        <StatusStyled>
                          <Active /> <p>Public</p>
                        </StatusStyled>
                      )}
                      {listing.status == "PENDING" && (
                        <StatusStyled>
                          <p>Pending</p>
                        </StatusStyled>
                      )}
                      {listing.status == "DENIED" && (
                        <StatusStyled>
                          <p>Denied</p>
                        </StatusStyled>
                      )}
                    </td>
                    <td>
                      <MdKeyboardArrowRight />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </TableContentStyled>
      </BodyStyled>
      <FooterStyled>
        {getHostListings.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getHostListings.data.totalPages}
          />
        )}
      </FooterStyled>
    </ContainerStyled>
  );
}
