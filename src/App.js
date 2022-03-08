import React from "react";
import { useEffect, useState, useRef } from "react";
import { COUNTRIES_DATA } from "./data/countries_data.js";
import HEX_DATA from "./data/countries_hex_data.json";
import Globe from "react-globe.gl";
import axios from "axios";

export default function App() {
  const globeEl = useRef();
  const draggingRef = useRef(0);

  const [hex, setHex] = useState({ features: [] });
  const [index, setIndex] = useState(0);
  const [type, setType] = useState("dark_1");

  const [update, setUpdate] = useState(false);

  useEffect(() => {
    setUpdate(false);
    setTimeout(() => {
      setUpdate(true);
    }, 1000);
  }, [type]);

  useEffect(() => {
    // let ts = new Date().getTime();
    // let varToken =
    //   "eyJrIjoiSHV2a3FxaW5PTndERXNtSzF6WWttcnROR29KbkVrem8iLCJuIjoiSW5mcmFBbmFseXRpY3MiLCJpZCI6MX0";
    // var data =
    //   '{"queries":[{"expr":"avg(probe_duration_seconds{probe=~\\".*\\", instance=\\"103.181.194.10\\", job=\\"ip ping\\"} * on (instance, job,probe,config_version) group_left probe_success{probe=~\\".*\\",instance=\\"103.181.194.10\\", job=\\"ip ping\\"} > 0) by (probe)","instant":false,"interval":"","intervalFactor":1,"refId":"A","datasource":{"uid":"grafanacloud-prom","type":"prometheus"},"key":"Q-f8515d80-5462-4b2c-9ea9-20b5db0771d5-0","exemplar":true,"queryType":"timeSeriesQuery","requestId":"Q-f8515d80-5462-4b2c-9ea9-20b5db0771d5-0A","utcOffsetSec":19800,"legendFormat":"","datasourceId":13,"intervalMs":15000,"maxDataPoints":1269}],"range":{"raw":{"from":"now-5m","to":"now"}},"from":"' +
    //   ts +
    //   '","to":"' +
    //   ts +
    //   '"}';
    // console.log(ts);
    // axios
    //   .get("https://dukaan.grafana.net/api/ds/query", data, {
    //     headers: { Authorization: `Bearer ${varToken}` },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((res) => {
    //     console.log(res);
    //   });
    setHex(HEX_DATA);
  }, []);

  useEffect(() => {
    if (update && globeEl.current) {
      globeEl.current.controls().autoRotateSpeed = 0.1;
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
    }
  }, [globeEl, update]);

  console.log("draggingRef.current", draggingRef.current);
  useEffect(() => {
    if (!draggingRef.current && globeEl.current && update) {
      setFoucus(index);
    }
  }, [globeEl, index, update]);

  const setFoucus = (index = 0) => {
    if (!draggingRef.current && globeEl) {
      const MAP_CENTER = { ...COUNTRIES_DATA[index], altitude: 0.8 };
      globeEl.current.pointOfView(MAP_CENTER, 5000);
      setTimeout(() => {
        if (!draggingRef.current && globeEl) {
          globeEl.current.pointOfView({ ...MAP_CENTER, altitude: 1.7 }, 5000);
          setTimeout(() => {
            if (!draggingRef.current && globeEl) {
              var idx = index + 1 >= COUNTRIES_DATA.length ? 0 : index + 1;
              setIndex(idx);
            }
          }, 5000);
        }
      }, 6000);
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex fixed-top p-3">
        {BTNS.map((el, idx) => (
          <button
            key={idx}
            className={`btn me-3 ${
              el.key === type ? "btn-primary" : "btn-outline-secondary"
            } ${idx === 0 ? "ms-auto" : "me-3"} `}
            onClick={() => setType(el.key)}
          >
            {el.name}
          </button>
        ))}
      </div>
      {update && (
        <Globe
          ref={globeEl}
          labelsData={COUNTRIES_DATA}
          labelAltitude={0.05}
          // hexPolygonsData={hex.features}
          hexPolygonResolution={4}
          hexPolygonMargin={0.62}
          labelLat={(d) => d.lat}
          labelLng={(d) => d.lng}
          labelText={(d) => d.name}
          labelSize={(d) => 0.8}
          labelDotRadius={(d) => 0.5}
          labelResolution={2}
          enablePointerInteraction={false}
          {...THEME[type]}
        />
      )}
    </React.Fragment>
  );
}

const THEME = {
  light_1: {
    globeImageUrl: "/white.jpeg",
    backgroundColor: "#fff",
    hexPolygonColor: () => "#006ee6",
    labelColor: () => "#FF0000",
    hexSideColor: () => "#006ee6",
    hexTopColor: () => "#006ee6",
    hexPolygonsData: HEX_DATA.features,
  },
  dark_1: {
    // globeImageUrl: "https://unpkg.com/three-globe/example/img/earth-night.jpg",
    globeImageUrl: "/map_dark.jpg",
    backgroundImageUrl:
      "https://unpkg.com/three-globe/example/img/night-sky.png",
    hexPolygonColor: () => "#006ee6",
    labelColor: () => "#FFF",
    hexSideColor: () => "#006ee6",
    hexTopColor: () => "#006ee6",
  },
  t_dark_2: {
    globeImageUrl: "/transparent.png",
    hexPolygonColor: () => "#006ee6",
    labelColor: () => "#FF0000",
    hexSideColor: () => "#006ee6",
    hexTopColor: () => "#006ee6",
    hexPolygonsData: HEX_DATA.features,
  },
  t_light_2: {
    globeImageUrl: "/transparent.png",
    backgroundColor: "#fff",
    hexPolygonColor: () => "#006ee6",
    labelColor: () => "#FF0000",
    hexSideColor: () => "#006ee6",
    hexTopColor: () => "#006ee6",
    hexPolygonsData: HEX_DATA.features,
  },
};

const BTNS = [
  { key: "light_1", name: "Light" },
  { key: "dark_1", name: "Dark" },
  { key: "t_light_2", name: "Transparent Light" },
  { key: "t_dark_2", name: "Transparent Dark" },
];
