import { useState } from "react";
import styled from "styled-components";
import { GetCategoryListRequest } from "./api/categoryListApi";
import Pagination from "@/shared/components/Pagination/Pagination";
import TextInput from "@/shared/components/Input/TextInput";
import InputCheckBox from "@/shared/components/Input/InputCheckBox";
import SelectInput from "@/shared/components/Input/SelectInput";
import { Link } from "react-router-dom";
import { UpdateCategoryStatusRequest } from "./api/categoryListApi";

const Container = styled.div`
  background-color: white;
  margin: 2rem;
  padding: 2rem;
  border-radius: 15px;
`;

const Footer = styled.div`
  margin-top: 5rem;
`;

const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 700px;
  overflow-x: scroll;
  font-size: 0.9em;
  overflow: hidden;

  thead tr {
    /* background-color: #0091ea; */
    /* color: #ffffff; */
    border-bottom: 3px solid black;
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    padding: 18px 15px;
  }

  tbody tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
  }

  tbody tr.active-row {
    font-weight: bold;
    color: #009879;
  }
`;

const Filter = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const CustomSelectInput = styled(SelectInput)`
  width: 12rem;
`;

const ImgContainer = styled.div`
  width: 2rem;
`;

const AmenityColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionStyled = styled.div`
  display: flex;
  gap: 1rem;

  & a {
    color: #701e8b;
  }

  & a:hover {
    color: red;
  }
`;

const PropertyCount = styled.p`
  font-weight: 600;

  color: rgba(0, 0, 0, 0.7);
`;

const optionsPage = [
  { label: "10 items", value: 10 },
  { label: "20 items", value: 20 },
  { label: "50 items", value: 50 },
];

const optionStatus = [
  { label: "All", value: "all" },
  { label: "Active", value: true },
  { label: "Not Active", value: false },
];

export default function Category() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(optionsPage[0]);
  const [status, setStatus] = useState(optionStatus[0]);
  const updateCategoryStatus = UpdateCategoryStatusRequest();

  const [search, setSearch] = useState("");
  const getCategoryList = GetCategoryListRequest(
    currentPage - 1,
    totalPage.value,
    search,
    status.value
  );

  const onChangeStatus = (id, status) => {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);

    updateCategoryStatus.mutate(formData, {
      onSuccess: (response) => {
        if (response.status == 200) {
          getCategoryList.refetch();
        }
      },
    });
  };

  return (
    <Container>
      <Filter>
        <TextInput placeholder={"Search for type and name"} state={search} setState={setSearch} />
        <CustomSelectInput state={status} setState={setStatus} options={optionStatus} />
        <CustomSelectInput state={totalPage} setState={setTotalPage} options={optionsPage} />
      </Filter>
      <TableContent>
        <thead>
          <tr>
            <th>CATEGORY</th>
            <th>PROPERTY TOTAL</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {getCategoryList.isSuccess &&
            getCategoryList.data.data.map((category, index) => {
              return (
                <tr key={index}>
                  <td>
                    <AmenityColumn>
                      <ImgContainer>
                        <img src={category.categoryImage} />
                      </ImgContainer>{" "}
                      {category.categoryName}
                    </AmenityColumn>
                  </td>
                  <td>
                    <PropertyCount>{category.propertyCount} Properties</PropertyCount>
                  </td>
                  <td>
                    <InputCheckBox
                      onChange={() => onChangeStatus(category.id, !category.status)}
                      checked={category.status}
                    />
                  </td>
                  <td>
                    <ActionStyled>
                      <Link to={"/admin/edit_category?id=" + category.id}>Edit</Link>
                      {/* <Link to={"/admin/edit_amenity?id=" + category.id}>Send mail</Link> */}
                      <Link to={"/admin/listing_list?category=" + category.id}>View property</Link>
                    </ActionStyled>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </TableContent>
      <Footer>
        {getCategoryList.isSuccess && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={getCategoryList.data.totalPages}
          />
        )}
      </Footer>
    </Container>
  );
}
