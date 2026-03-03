export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'strike' | 'retaliation' | 'port' | 'naval' | 'base';
  subtype?: string;
  detail?: string;
}

export interface ShippingRoute {
  id: string;
  name: string;
  color: string;
  weight: number;
  dashArray?: string;
  coordinates: [number, number][];
}

export const strikeMarkers: MapMarker[] = [
  { id: 'tehran', lat: 35.6892, lng: 51.3890, label: 'Tehran', type: 'strike', detail: 'Capital — Command HQ' },
  { id: 'isfahan', lat: 32.6546, lng: 51.6680, label: 'Isfahan Nuclear', type: 'strike', detail: 'Nuclear Research Center' },
  { id: 'bushehr', lat: 28.9234, lng: 50.8203, label: 'Bushehr NPP', type: 'strike', detail: 'Nuclear Power Plant' },
  { id: 'natanz', lat: 33.7231, lng: 51.7267, label: 'Natanz', type: 'strike', detail: 'Uranium Enrichment Facility' },
  { id: 'fordow', lat: 34.8846, lng: 50.9933, label: 'Fordow', type: 'strike', detail: 'Underground Enrichment Site' },
  { id: 'parchin', lat: 35.4953, lng: 51.7766, label: 'Parchin', type: 'strike', detail: 'Military Research Complex' },
  { id: 'shiraz', lat: 29.5918, lng: 52.5836, label: 'Shiraz Base', type: 'strike', detail: 'IRGC Air Base' },
];

export const retaliationMarkers: MapMarker[] = [
  { id: 'tel-aviv', lat: 32.0853, lng: 34.7818, label: 'Tel Aviv', type: 'retaliation', detail: 'Missile Strikes — City Center' },
  { id: 'dubai', lat: 25.2048, lng: 55.2708, label: 'Dubai Airport', type: 'retaliation', detail: 'DXB — Closed 48hrs' },
  { id: 'abu-dhabi', lat: 24.4539, lng: 54.3773, label: 'Abu Dhabi', type: 'retaliation', detail: 'ADNOC HQ — Drone Strike' },
  { id: 'jebel-ali-ret', lat: 25.0182, lng: 55.0714, label: 'Jebel Ali Port', type: 'retaliation', detail: 'Drone Strike — Ops Disrupted' },
];

export const portMarkers: MapMarker[] = [
  { id: 'jebel-ali', lat: 25.0182, lng: 55.0714, label: 'Jebel Ali', type: 'port', detail: 'World\'s Largest Artificial Harbour' },
  { id: 'fujairah', lat: 25.1164, lng: 56.3473, label: 'Fujairah', type: 'port', detail: 'Key Oil Bunkering Hub' },
  { id: 'ras-tanura', lat: 26.6434, lng: 50.1581, label: 'Ras Tanura', type: 'port', detail: 'Saudi Aramco Export Terminal' },
  { id: 'bandar-abbas', lat: 27.1865, lng: 56.2808, label: 'Bandar Abbas', type: 'port', detail: 'Iran\'s Main Naval Base' },
  { id: 'chabahar', lat: 25.2919, lng: 60.6430, label: 'Chabahar', type: 'port', detail: 'Alternative Iran Port' },
];

export const navalMarkers: MapMarker[] = [
  { id: 'cvn-arabian', lat: 22.5, lng: 64.0, label: 'USS CVN-78 Battle Group', type: 'naval', detail: 'Carrier Strike Group — Arabian Sea' },
  { id: 'cvn-gulf-oman', lat: 23.8, lng: 59.2, label: 'USS CVN-77 Battle Group', type: 'naval', detail: 'Carrier Strike Group — Gulf of Oman' },
  { id: 'amphibious', lat: 18.5, lng: 57.5, label: 'Amphibious Ready Group', type: 'naval', detail: 'ARG — Red Sea / Gulf of Aden' },
];

export const hormuzPolygon: [number, number][] = [
  [26.35, 56.27],
  [26.65, 56.45],
  [27.05, 57.12],
  [27.22, 57.55],
  [27.05, 57.75],
  [26.55, 57.35],
  [26.15, 56.85],
  [25.88, 56.55],
  [26.05, 56.27],
];

export const normalShippingRoute: ShippingRoute = {
  id: 'normal',
  name: 'Normal Route (via Hormuz) — RESTRICTED',
  color: '#ef4444',
  weight: 3,
  dashArray: '8,6',
  coordinates: [
    [22.3, 59.8],  // Arabian Sea
    [24.5, 58.2],  // Approach Gulf of Oman
    [26.1, 57.0],  // Hormuz
    [26.8, 56.1],  // Persian Gulf entry
    [25.2, 55.1],  // Jebel Ali
    [26.2, 50.5],  // Ras Tanura area
    [29.0, 48.8],  // Kuwait
  ],
};

export const alternativeShippingRoute: ShippingRoute = {
  id: 'alternative',
  name: 'Alternative Route (Cape of Good Hope)',
  color: '#22c55e',
  weight: 2.5,
  coordinates: [
    [22.3, 59.8],   // Arabian Sea
    [12.0, 57.0],   // Off Somalia
    [2.0, 48.0],    // Off Kenya
    [-5.0, 41.0],   // Off Tanzania
    [-12.0, 37.0],  // Off Mozambique
    [-25.0, 33.0],  // Off Madagascar
    [-34.4, 18.5],  // Cape of Good Hope
    [-25.0, 10.0],  // South Atlantic
  ],
};
