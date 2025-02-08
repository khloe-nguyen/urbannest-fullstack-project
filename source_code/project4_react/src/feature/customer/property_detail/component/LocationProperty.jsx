import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import styled from "styled-components";
import dchc from "@/shared/data/dchc";
import { capitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";

// Custom icon cho marker
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/4284/4284108.png",
  iconSize: [30, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component để thay đổi vị trí bản đồ
const ChangeView = ({ position }) => {
  const map = useMap();
  if (position) {
    map.setView(position, 15); // Zoom tới vị trí
  }
  return null;
};
const StyledHeader = styled.div`
  margin: 2rem 0;
  font-size: 22px;
  font-weight: bold;
`;
const StyledAddress = styled.div`
  font-size: 20;
  font-weight: bold;
  margin-bottom: 1rem;
`;
// Component hiển thị bản đồ
const LocationProperty = ({ data }) => {
  const position = [data.coordinatesX, data.coordinatesY]; // Lấy tọa độ từ props
  const convertAddressCode = () => {
    var addrressArr = data.addressCode.split("_");
    var addreess = data.addressDetail;
    const tempProvince = dchc.data.find((city) => city.level1_id == addrressArr[0]);
    const tempDistrict = tempProvince.level2s.find(
      (district) => district.level2_id == addrressArr[1]
    );
    const tempWard = tempDistrict.level3s.find((ward) => ward.level3_id == addrressArr[2]);
    return addreess + ", " + tempWard.name + ", " + tempDistrict.name + ", " + tempProvince.name;
  };

  return (
    <div>
      <StyledHeader>Where you’ll be</StyledHeader>
      <StyledAddress>{capitalizeFirstLetter(convertAddressCode())} </StyledAddress>
      <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={customIcon}>
          <Popup>
            Coordinates: {position[0]}, {position[1]}
          </Popup>
        </Marker>
        <ChangeView position={position} />
      </MapContainer>
    </div>
  );
};

export default LocationProperty;
