"""Extract Jinju, dissolve neighboring rural districts and build the offline SVG.
Requires shapely. Input: boundaries-source.local (admdongkor 20261001 GeoJSON).
"""
import json
import math
from pathlib import Path
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

source = json.loads(Path("boundaries-source.local").read_text(encoding="utf-8"))
features = [f for f in source["features"] if f["properties"].get("sgg") == "48170"]
districts = {f["properties"]["adm_nm"].split()[-1]: f for f in features}
groups = [
    ("west", "서부권", ["수곡면", "대평면", "명석면"]),
    ("north", "북부권", ["집현면", "미천면", "대곡면"]),
    ("east", "동부권", ["지수면", "사봉면", "일반성면", "이반성면"]),
    ("southeast", "금산·진성권", ["금산면", "진성면"]),
    ("south", "남부권", ["내동면", "정촌면", "문산읍", "금곡면"]),
]
groups += [(f["properties"]["adm_cd2"], name, [name])
           for name, f in districts.items() if name.endswith("동")]
assert len(features) == 30 and len(groups) == 19
assert sorted(n for _, _, names in groups for n in names) == sorted(districts)
city = unary_union([shape(f["geometry"]) for f in features])
minx, miny, maxx, maxy = city.bounds
cos = math.cos(math.radians((miny + maxy) / 2))
scale = min(760 / ((maxx - minx) * cos), 640 / (maxy - miny))
def xy(x, y):
    return [round(20 + (x - minx) * cos * scale, 2), round(20 + (maxy - y) * scale, 2)]
def path(geom):
    polygons = list(geom.geoms) if geom.geom_type == "MultiPolygon" else [geom]
    parts = []
    for p in polygons:
        for ring in [p.exterior, *p.interiors]:
            points = [xy(x, y) for x, y in ring.coords]
            parts.append("M" + "L".join(f"{x},{y}" for x, y in points) + "Z")
    return "".join(parts)
regions = []
for id, title, names in groups:
    original = unary_union([shape(districts[n]["geometry"]) for n in names])
    # Ensure each rural grouping is connected, not simply geographically close.
    assert original.geom_type == "Polygon", (id, original.geom_type)
    geom = original.simplify(0.00012, preserve_topology=True)
    center = geom.representative_point()
    regions.append(dict(id=id, name=title, members=names, path=path(geom),
                        label=xy(center.x, center.y), geometry=mapping(original)))
urban = unary_union([shape(f["geometry"]) for n, f in districts.items() if n.endswith("동")])
ux0, uy0, ux1, uy1 = urban.bounds
left, top = xy(ux0, uy1)
right, bottom = xy(ux1, uy0)
data = dict(version="20261001", source="https://github.com/vuski/admdongkor",
            viewBox=f"0 0 {round(40+(maxx-minx)*cos*scale,2)} {round(40+(maxy-miny)*scale,2)}",
            urbanViewBox=f"{left-8} {top-8} {right-left+16} {bottom-top+16}",
            regions=regions)
Path("src/data/jinjuRegions.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Prepared {len(features)} districts in {len(regions)} display regions")
