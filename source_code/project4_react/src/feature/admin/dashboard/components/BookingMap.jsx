import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { ManagedCityAdminRequest } from "@/shared/api/managedCityAdminApi";

// Import the GeoJSON for Vietnam's provinces
import vietnamProvincesGeoJSON from "../data/vn.json"; // Add your GeoJSON file here
import WaitingIcon from "@/shared/components/AnimationIcon/WaitingIcon";

const CustomMapCotainer = styled(MapContainer)`
  border-radius: 5px;
  background-color: black;
`;

const WaitingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const BookingMap = () => {
  const managedCityAdmin = ManagedCityAdminRequest();
  const [provinceData, setProvinceData] = useState(null);

  // Fetch booking data or other relevant data for each province

  // Function to style each province based on booking data
  const onEachProvince = (province, layer) => {
    const cityData = managedCityAdmin.data.data;
    const provinceId = province.properties.id; // Assuming `id` is the unique identifier
    const bookings = provinceData ? provinceData[provinceId]?.bookings : 0;
    const city = cityData.find((city) => city.cityName == province.properties.name);
    const isActive = city.managed;

    layer.setStyle({
      fillColor: isActive ? "red" : "black",
      weight: 2,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    });

    if (isActive) {
      layer.bindPopup(`
        <strong>Province:</strong> ${province.properties.name} <br/>
        <a href="admin/booking_list?city=${city.id}">View bookings</a> <br/>
        <a href="admin/listing_list?city=${city.id}">View properties</a> <br/>
      `);
    }

    if (isActive && layer._map) {
      alert("ss");
      const latLng = layer.getBounds().getCenter(); // Get the center of the province's boundary
      L.circleMarker(latLng, {
        radius: 8,
        color: "red",
        fillColor: "red",
        fillOpacity: 1,
      })
        .addTo(layer._map)
        .bindPopup(`Active Province: ${province.properties.name}`);
    }
  };

  if (managedCityAdmin.isLoading) {
    return (
      <WaitingContainer>
        <WaitingIcon />
      </WaitingContainer>
    );
  }

  return (
    <CustomMapCotainer
      center={[18.0583, 105.2772]} // Center on Vietnam
      zoom={6.4} // Zoom in to Vietnam's level
      style={{ height: "100%", width: "100%", backgroundColor: "white" }}
    >
      {/* GeoJSON Layer to render the provinces */}
      {vietnamProvincesGeoJSON && (
        <GeoJSON
          style={{ backgroundColor: "white" }}
          data={vietnamProvincesGeoJSON}
          onEachFeature={onEachProvince}
        />
      )}
    </CustomMapCotainer>
  );
};

export default BookingMap;
