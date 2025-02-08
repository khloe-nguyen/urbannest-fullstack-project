import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import styled from "styled-components";

const StyleTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
`;

const RangeSlider = ({
  min,
  max,
  step,
  onChange,
  selectedPrice,
  setSelectedPrice,
}) => {
  const [values, setValues] = useState([min, max]);

  //to update clearAll
  useEffect(() => {
    if (selectedPrice[0] == min && selectedPrice[1] == max) {
      setValues(selectedPrice); //to clearAll
    }
    //to save the value to send API
    // setSelectedPrice(values);
  }, [selectedPrice]);

  return (
    <>
      <StyleTitle>Price range</StyleTitle>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "2rem 0",
        }}
      >
        <Range
          values={values}
          step={step}
          min={min}
          max={max}
          onChange={(values) => {
            setValues(values);
            onChange(values);
            setSelectedPrice(values);
          }}
          renderTrack={({ props, children }) => {
            const { key, ...restProps } = props; // Tách key ra khỏi props
            return (
              <div
                {...restProps}
                style={{
                  ...restProps.style,
                  height: "6px",
                  width: "100%",
                  background: getTrackBackground({
                    values,
                    colors: ["lightgray", "#ff0000", "lightgray"],
                    min: min,
                    max: max,
                  }),
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props; // Tách key ra khỏi props
            return (
              <div
                {...restProps}
                style={{
                  ...restProps.style,
                  height: "1rem",
                  width: "0.4rem",
                  outline: "none",
                  border: "none",
                  backgroundColor: "#ff0000",
                }}
                key={`thumb-${index}`}
              />
            );
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <output style={{ marginTop: "20px" }}> {values[0]}</output>
          <output style={{ marginTop: "20px" }}> {values[1]}$</output>
        </div>
      </div>
    </>
  );
};

export default RangeSlider;
