'use client';

//? leaflet maps library
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
//? leaflet css
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//! all this stuff is related to the leaflet library, nothing to do with react, so chill out 😅.
//@ts-ignore
// fix the marker icons
delete L.Icon.Default.prototype._getIconUrl;
// set the default icon for the map
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
    center?: number[]; // the center of the map i.e [latitude, longitude]
}

const Map: React.FC<MapProps> = ({ center }) => {
    return (
        <MapContainer
            center={(center as L.LatLngExpression) || [51, -0.09]} // set the center of the map
            zoom={center ? 4 : 2} // set the zoom of the map
            // scrollWheelZoom={false} // disable the scroll wheel zoom
            className="h-[35vh] rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {center && (
                <Marker position={center as L.LatLngExpression} /> // set the marker position
            )}
        </MapContainer>
    );
};

export default Map;
