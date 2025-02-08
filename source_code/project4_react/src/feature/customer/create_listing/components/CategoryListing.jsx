import styled, { css } from "styled-components";
import { useOutletContext } from "react-router-dom";
import SelectInputDescription from "@/shared/components/Input/SelectInputDescription";
import { CategoriesRequest } from "@/shared/api/categoryClientApi";

const Container = styled.div``;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const Right = styled.div``;

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const CategoryItem = styled.button`
  background-color: white;
  border-radius: 10px;
  cursor: pointer;
  padding: 20px 10px;

  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);

  > div {
    width: 30px;
  }

  &:hover {
    border: 2px solid black;
  }

  ${(props) => {
    if (props.$active == true) {
      return css`
        border: 2px solid black;
      `;
    }
  }}

  ${(props) => {
    if (props.$unavailable == true) {
      return css`
        text-decoration: line-through;
      `;
    }
  }}
`;

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

export default function CategoryListing() {
  const categories = CategoriesRequest();

  const [state, dispatch, ACTIONS] = useOutletContext();

  return (
    <Container>
      <Header>
        <h2>What kind of place are you listing</h2>
      </Header>
      <Body>
        <Left>
          <div>
            <label>Choose a property type</label>
            <SelectInputDescription
              state={propertyOptions.find((type) => type.value == state.propertyType)}
              setState={(type) =>
                dispatch({ type: ACTIONS.CHANGE_PROPERTY_TYPE, next: type.value })
              }
              options={propertyOptions}
              isDisable={state.status != "PROGRESS" && true}
            />
          </div>
          <div>
            <h2>Which of these best describes your place?</h2>
            <CategoryContainer>
              {categories.isSuccess &&
                categories.data.data
                  .filter(
                    (category) => category.status == true || state.propertyCategoryID == category.id
                  )
                  .map((category, index) => {
                    return (
                      <CategoryItem
                        $unavailable={category.status == false}
                        $active={state.propertyCategoryID == category.id}
                        onClick={() => {
                          if (state.status == "PROGRESS") {
                            dispatch({
                              type: ACTIONS.CHANGE_PROPERTY_CATEGORY_ID,
                              next: category.id,
                            });
                          }
                        }}
                        key={index}
                      >
                        <div>
                          <img src={category.categoryImage} />
                        </div>
                        {category.categoryName}
                      </CategoryItem>
                    );
                  })}
            </CategoryContainer>
          </div>
        </Left>
        <Right></Right>
      </Body>
    </Container>
  );
}
