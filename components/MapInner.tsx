'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  strikeMarkers,
  retaliationMarkers,
  portMarkers,
  navalMarkers,
  hormuzPolygon,
  normalShippingRoute,
  alternativeShippingRoute,
} from '@/constants/map-data';

function Legend() {
  const map = useMap();
  useEffect(() => {
    const legend = new L.Control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-bar');
      div.style.cssText = 'background:#0f1520;border:1px solid #2a3a5e;padding:8px 12px;font-family:monospace;font-size:10px;color:#88aacc;min-width:160px';
      div.innerHTML = `
        <div style="font-weight:700;color:#cc4444;margin-bottom:6px;letter-spacing:0.1em">MAP LEGEND</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;"></span>Strike Target</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;"></span>Retaliation Strike</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3b82f6;"></span>Port / Naval Base</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#60a5fa;"></span>US Naval Group</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:2px;background:#ef4444;border-top:2px dashed #ef4444;"></span>Normal Route (Closed)</div>
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="display:inline-block;width:10px;height:2px;background:#22c55e;"></span>Alt Route (Cape)</div>
      `;
      return div;
    };
    legend.addTo(map);
    return () => { legend.remove(); };
  }, [map]);
  return null;
}

function createNavalIcon() {
  return L.divIcon({
    html: `<div style="color:#60a5fa;font-size:16px;text-shadow:0 0 8px #3b82f6">&#9733;</div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function MapInner() {
  return (
    <MapContainer
      center={[26, 54]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: '#0a0d14' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={18}
      />

      {/* Hormuz Chokepoint */}
      <Polygon
        positions={hormuzPolygon}
        pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 2, dashArray: '4,4' }}
      >
        <Popup>
          <div style={{ fontFamily: 'monospace', color: '#ff6666' }}>
            <strong>STRAIT OF HORMUZ</strong><br />
            Status: CLOSED — War Risk Active<br />
            20% of global oil supply<br />
            ~21M bpd normal throughput
          </div>
        </Popup>
      </Polygon>

      {/* Shipping Routes */}
      <Polyline
        positions={normalShippingRoute.coordinates}
        pathOptions={{
          color: normalShippingRoute.color,
          weight: normalShippingRoute.weight,
          dashArray: normalShippingRoute.dashArray,
          opacity: 0.8,
        }}
      >
        <Popup><div style={{ fontFamily: 'monospace', color: '#ff6666' }}>Normal Route — RESTRICTED<br />War risk insurance suspended</div></Popup>
      </Polyline>

      <Polyline
        positions={alternativeShippingRoute.coordinates}
        pathOptions={{
          color: alternativeShippingRoute.color,
          weight: alternativeShippingRoute.weight,
          opacity: 0.7,
        }}
      >
        <Popup><div style={{ fontFamily: 'monospace', color: '#88ff88' }}>Alternative Route: Cape of Good Hope<br />+14-21 days transit time<br />Freight premium: +80-150%</div></Popup>
      </Polyline>

      {/* Strike Markers */}
      {strikeMarkers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={8}
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.7, weight: 2 }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', color: '#ff8888' }}>
              <strong style={{ color: '#ef4444' }}>&#9889; STRIKE TARGET</strong><br />
              {marker.label}<br />
              <small style={{ color: '#aaaaaa' }}>{marker.detail}</small>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Retaliation Markers */}
      {retaliationMarkers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={7}
          pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.7, weight: 2 }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', color: '#ffcc66' }}>
              <strong style={{ color: '#f59e0b' }}>&#9889; RETALIATION</strong><br />
              {marker.label}<br />
              <small style={{ color: '#aaaaaa' }}>{marker.detail}</small>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Port Markers */}
      {portMarkers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={5}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8, weight: 1.5 }}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', color: '#88aaff' }}>
              <strong style={{ color: '#3b82f6' }}>&#9875; PORT</strong><br />
              {marker.label}<br />
              <small style={{ color: '#aaaaaa' }}>{marker.detail}</small>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Naval Markers */}
      {navalMarkers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={createNavalIcon()}
        >
          <Popup>
            <div style={{ fontFamily: 'monospace', color: '#88aaff' }}>
              <strong style={{ color: '#60a5fa' }}>&#9733; US NAVAL FORCE</strong><br />
              {marker.label}<br />
              <small style={{ color: '#aaaaaa' }}>{marker.detail}</small>
            </div>
          </Popup>
        </Marker>
      ))}

      <Legend />
    </MapContainer>
  );
}
