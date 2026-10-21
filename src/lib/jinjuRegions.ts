import data from '../data/jinjuRegions.json';

export const regions = data.regions;
export const regionViewBox = data.viewBox;
export const urbanViewBox = data.urbanViewBox;
export const boundarySource = data.source;
export const carbonSource = 'https://www.gnu.ac.kr/jinjunetzero/cm/cntnts/cntntsView.do?cntntsId=9237&mi=18920';
export const regionById = (id: string) => regions.find(r => r.id === id);

// Locate in the browser; only the region ID is sent to the server.
function insideRing(x: number, y: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
export function regionAt(lng: number, lat: number) {
  return regions.find(r => {
    const rings = r.geometry.coordinates;
    return insideRing(lng, lat, rings[0]) && !rings.slice(1).some(ring => insideRing(lng, lat, ring));
  });
}

export type RegionStat = {
  id: string; actions: number; previous: number; estimated: number;
  measured: number; challenges: { id: string; count: number }[];
};
export type RegionSummary = { regions: RegionStat[]; unmapped: number; hidden: number };
export const emptyRegionStat = (id: string): RegionStat => ({id, actions:0, previous:0, estimated:0, measured:0, challenges:[]});

export const knownPlaces = [
  { region:'4817073000', name:'진양호공원', address:'진주시 남강로1번길 96-6 (판문동)',
    activity:'산책할 때 다회용 물병을 챙기고 쓰레기는 되가져와요.',
    url:'https://www.jinju.go.kr/park/main.web' },
];
