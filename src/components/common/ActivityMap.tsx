import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MapPoint = { lat: number; lng: number };
export type MapCell = MapPoint & { actions: number; estimated: number; estimatedCount: number };
export const roundLocation = (p: MapPoint): MapPoint => ({ lat: Math.round(p.lat * 100) / 100, lng: Math.round(p.lng * 100) / 100 });
// Viewing/selection extent only, not an administrative boundary.
export const inMapArea = (p: MapPoint) => p.lat >= 35 && p.lat <= 35.4 && p.lng >= 127.85 && p.lng <= 128.4;

export function ActivityMap({ cells = [], point, onPick, onSelect }: {
  cells?: MapCell[]; point?: MapPoint | null;
  onPick?: (p: MapPoint) => void; onSelect?: (p: MapCell) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const callbacks = useRef({ onPick, onSelect });
  callbacks.current = { onPick, onSelect };
  const [tileError, setTileError] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const instance = L.map(container.current, { scrollWheelZoom: false, minZoom: 9, maxZoom: 16 })
      .setView([35.18, 128.10], 12);
    map.current = instance;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).on('tileerror', () => setTileError(true)).addTo(instance);
    instance.on('click', (event: L.LeafletMouseEvent) => {
      const p = roundLocation({ lat: event.latlng.lat, lng: event.latlng.lng });
      if (inMapArea(p)) callbacks.current.onPick?.(p);
    });
    const resize = new ResizeObserver(() => instance.invalidateSize());
    resize.observe(container.current);
    return () => { resize.disconnect(); instance.remove(); map.current = null; };
  }, []);
  useEffect(() => {
    if (!map.current) return;
    const group = L.layerGroup().addTo(map.current);
    cells.forEach(cell => {
      L.circleMarker([cell.lat, cell.lng], {
        radius: Math.min(24, 7 + Math.sqrt(cell.actions) * 3),
        color: '#047857', fillColor: '#34d399', fillOpacity: .65, weight: 2,
      }).bindTooltip(`인증 ${cell.actions}회`)
        .on('click', () => callbacks.current.onSelect?.(cell)).addTo(group);
    });
    if (point) {
      L.circle([point.lat, point.lng], { radius: 550, color: '#2563eb', weight: 2 }).addTo(group);
      map.current.panTo([point.lat, point.lng]);
    }
    return () => { group.remove(); };
  }, [cells, point]);
  return <div className="space-y-2">
    <div ref={container} role="region" aria-label="진주 실천 지도" className="relative z-0 h-72 w-full rounded-2xl bg-slate-100" />
    {tileError && <p className="text-xs text-amber-800">지도 배경을 불러오지 못했습니다. 인터넷 연결을 확인해주세요. 아래 집계 목록은 계속 이용할 수 있어요.</p>}
  </div>;
}
