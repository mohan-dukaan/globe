import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { COUNTRIES_DATA } from "./data/countries_data.js";
import HEX_DATA from "./data/countries_hex_data.json";
import Globe from "react-globe.gl";

export default function App() {
  const globeEl = useRef();
  const draggingRef = useRef(0);

  const [hex, setHex] = useState({ features: [] });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setHex(HEX_DATA);
  }, []);

  useEffect(() => {
    globeEl.current.controls().autoRotateSpeed = 0.5;
    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("mousedown", () => {
      draggingRef.current++;
    });
    canvas.addEventListener("mouseup", () => {
      setTimeout(() => {
        draggingRef.current--;
        if (!draggingRef.current) {
          setFoucus(index);
        }
      }, 5000);
    });
  }, [globeEl]);

  useEffect(() => {
    if (!draggingRef.current) {
      setFoucus(index);
    }
  }, [globeEl, index]);

  const setFoucus = (index = 0) => {
    console.log("dara", draggingRef.current);
    if (!draggingRef.current) {
      const MAP_CENTER = { ...COUNTRIES_DATA[index], altitude: 0.4 };
      globeEl.current.pointOfView(MAP_CENTER, 2000);
      setTimeout(() => {
        if (!draggingRef.current) {
          globeEl.current.pointOfView({ ...MAP_CENTER, altitude: 1.5 }, 2000);
          setTimeout(() => {
            if (!draggingRef.current) {
              var idx = index + 1 >= COUNTRIES_DATA.length ? 0 : index + 1;
              setIndex(idx);
            }
          }, 3000);
        }
      }, 5000);
    }
  };

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="/transparent.png"
      backgroundColor="#fff"
      labelsData={COUNTRIES_DATA}
      labelAltitude={0.05}
      hexPolygonsData={hex.features}
      hexPolygonResolution={4}
      hexPolygonMargin={0.62}
      hexPolygonColor={useCallback(() => "#006ee6", [])}
      labelLat={(d) => d.lat}
      labelLng={(d) => d.lng}
      labelText={(d) => d.name}
      labelSize={(d) => 0.8}
      labelDotRadius={(d) => 0.5}
      labelColor={() => "#FF0000"}
      hexTopColor={() => "#FF0000"}
      hexSideColor={() => "#006ee6"}
      labelResolution={2}
      hexBinPointsData={COUNTRIES_DATA}
      hexBinPointWeight="size"
      hexAltitude={(d) => 0.04}
      hexBinResolution={4}
      hexBinMerge={true}
      enablePointerInteraction={false}
    />
  );
}
