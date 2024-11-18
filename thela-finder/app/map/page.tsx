"use client";

import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

const MapDisplay = () => {
  console.log("I get here");
  const apiKey: string = process.env.NEXT_PUBLIC_API_KEY || "hello";

  if (apiKey === "hello") {
    console.error("API key is missing");
    return <div>Error: API key is missing</div>; // Render a fallback UI
  }

  return (
    <div className="w-1/2 h-1/2">
      <APIProvider apiKey={apiKey} onLoad={() => console.log("Map Loaded")}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: 43.6635, lng: -79.399689 }}
          onCameraChanged={(ev: MapCameraChangedEvent) =>
            console.log(
              "camera changed:",
              ev.detail.center,
              "zoom:",
              ev.detail.zoom
            )
          }
        ></Map>
      </APIProvider>
    </div>
  );
};

export default MapDisplay;
