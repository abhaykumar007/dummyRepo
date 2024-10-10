import Button from "@/components/common/button";
import Modal from "@/components/ui/modal";
import { Flex, FormInstance } from "antd";
import { BiTargetLock } from "react-icons/bi";
import { useCallback, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  LoadScript,
} from "@react-google-maps/api";
import Input from "@/components/common/input";

interface AddAddressProps {
  form: FormInstance;
}

const center = {
  lat: 18.5204,
  lng: 73.8567,
};


const AddAddress = ({ form }: AddAddressProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const mapRef = useRef<any>(null);
  const onLoad = useCallback(function callback(map: any) {
    mapRef.current = map;
    map.setZoom(30);
    setMap(map);
  }, []);
  const onUnmount = useCallback(function callback() {
    mapRef.current = null;
    setMap(null);
  }, []);
  const onClick = () => {
    setIsModalOpen(true);
  };
  const onClose = () => {
    setIsModalOpen(false);
  };

  const autocompleteRef = useRef<any>(null);
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place) {
      setSelectedPlace(place);
      map?.setCenter(place.geometry.location);
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      form.setFieldsValue({ address: place.formatted_address });
      form.setFields([
        {
          name: "lat",
          value: lat,
        },
        {
          name: "long",
          value: lng,
        },
      ]);
      setMarkerPosition({
        lat: lat,
        lng: lng,
      });
    }
  };
  const handleDrag = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter().toJSON();
      setMarkerPosition(newCenter);
    }
  };
  const handleDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter().toJSON();
      setMarkerPosition(newCenter);
    }
  };
 
  const hahdleOk = () => {
    form.setFields([
      {
        name: "lat",
        value: selectedPlace.geometry.location.lat(),
      },
      {
        name: "long",
        value: selectedPlace.geometry.location.lng(),
      },
    ]);
    setIsModalOpen(false);
  }

  return (
    <>
      <LoadScript
        googleMapsApiKey="AIzaSyCLc7WFQ4BEvHbouoToY0LsLaXSuIR5fd4"
        libraries={["places"]}
      >
        <Flex
          style={{ width: "100%", position: "relative" }}
          className="auto-complete"
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceChanged}
          >
            <Input
              label="Address"
              name="address"
              placeholder={"Enter your address"}
              rules={[
                {
                  required: true,
                  message: "Please enter your address",
                },
              ]}
            />
          </Autocomplete>
          <div style={{ display: "none" }}>
            <Input name="lat" />
            <Input name="long" />
          </div>

          <Button
            icon={<BiTargetLock />}
            iconPosition="start"
            style={{ width: "20%", position: "absolute", right: 0, top: 30 }}
            onClick={onClick}
            type="link"
            label="Edit on map"
          />
        </Flex>
        <Modal
          onOk={hahdleOk}
          destroyOnClose
          title="Address"
          open={isModalOpen}
          onClose={onClose}
          onCancel={onClose}
        >
          <Autocomplete
            onLoad={(autocomplete) => {
              autocompleteRef.current = autocomplete;
            }}
            onPlaceChanged={handlePlaceChanged}
          >
            <Input label="Address" placeholder={"Search you address"} />
          </Autocomplete>
          <div style={{ width: "100%", height: "400px" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              onZoomChanged={handleDrag}
            >
              <MarkerF position={markerPosition} />
            </GoogleMap>
          </div>
          {/* </LoadScript> */}
        </Modal>
        {/* <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Enter an address"
            // value={address}
            // onChange={(e) => setAddress(e.target.value)}
            style={{ width: "300px", padding: "10px" }}
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        /> */}
      </LoadScript>
    </>
  );
};

export default AddAddress;
