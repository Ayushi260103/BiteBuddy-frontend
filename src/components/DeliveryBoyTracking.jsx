import React from 'react'
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { MapContainer, Polyline } from 'react-leaflet';
import { TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import { Popup } from 'react-leaflet';


const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});
const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
});
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function RecenterMap({ lat, lon }) {
    const map = useMap();

    useEffect(() => {
        if (lat && lon) {
            map.flyTo([lat, lon], map.getZoom(), {
                duration: 1.5
            });
        }
    }, [lat, lon]);

    return null;
}
function DeliveryBoyTracking({ data }) {

    const deliveryBoyLat = (data?.deliveryBoyLocation?.lat);
    const deliveryBoyLon = (data?.deliveryBoyLocation?.lon);
    const customerLat = (data?.customerLocation?.lat);
    const customerLon = (data?.customerLocation?.lon);

    const path = [
        [deliveryBoyLat, deliveryBoyLon],
        [customerLat, customerLon]
    ];

    const center = [deliveryBoyLat, deliveryBoyLon];
    // const center = [
    //     (deliveryBoyLat + customerLat) / 2,
    //     (deliveryBoyLon + customerLon) / 2
    // ];

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            {/* Map Placeholder */}

            {customerLat && customerLon && deliveryBoyLat && deliveryBoyLon &&
                <MapContainer
                    className={'w-full h-full'}
                    center={center}
                    zoom={16} >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <RecenterMap lat={deliveryBoyLat} lon={deliveryBoyLon} />

                    {/* Delivery boy marker */}
                    <Marker
                        position={[deliveryBoyLat, deliveryBoyLon]} icon={deliveryBoyIcon}>
                        <Popup>
                            Delivery Boy
                        </Popup>
                    </Marker>
                    {/* customer marker */}
                    <Marker
                        position={[customerLat, customerLon]} icon={customerIcon}>
                        <Popup>
                            Customer
                        </Popup>

                    </Marker>
                    <Polyline positions={path} color="blue" weight={4} />
                </MapContainer>
            }

        </div>
    )
}

export default DeliveryBoyTracking