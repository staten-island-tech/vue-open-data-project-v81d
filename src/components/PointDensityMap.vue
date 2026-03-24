<template>
  <div id="chart"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import * as d3 from "d3";
import { contourDensity } from "d3-contour";

const props = defineProps<{
  locationData: [number, number][]; // array of [long, lat]
  highlightLocation?: [number, number];
}>();

const geojsonData = ref<any>(null); // too lazy to define an interface for this, sorry!

const viewBoxSize = 500;

async function loadGeoJSON() {
  try {
    const res = await fetch(import.meta.env.VITE_GEOJSON_API);
    const data = await res.json();

    /*
     * Since the API does not actually return a JSON in the GeoJSON format,
     * we will convert it manually.
     */
    geojsonData.value = {
      type: "FeatureCollection",
      features: data.map((d: any) => ({
        type: "Feature",
        properties: {
          borocode: d.borocode,
          boroname: d.boroname,
          shape_area: d.shape_area,
          shape_leng: d.shape_leng,
        },
        geometry: d.the_geom,
      })),
    };
  } catch (_) {}
}

function renderChart() {
  if (!props.locationData.length || !geojsonData.value) return;

  const firstPoint = props.locationData[0]!;
  const boroughFeature = geojsonData.value.features.find((f: any) =>
    d3.geoContains(f, firstPoint),
  );
  if (!boroughFeature) return;

  const padding = 40;

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const projection = d3.geoMercator().fitExtent(
    [
      [padding, padding], // top-left corner
      [viewBoxSize - padding, viewBoxSize - padding], // bottom-right corner
    ],
    boroughFeature,
  );

  const path = d3.geoPath().projection(projection);

  svg
    .append("g")
    .selectAll("path")
    .data(geojsonData.value.features)
    .join("path")
    .attr("d", (d: any) => path(d))
    .attr("fill", "#eee")
    .attr("stroke", "#333")
    .attr("stroke-width", 1);

  const points = props.locationData
    .map((d) => projection(d))
    .filter((p): p is [number, number] => p !== null);

  const density = contourDensity<[number, number]>()
    .x((d) => d[0])
    .y((d) => d[1])
    .size([viewBoxSize, viewBoxSize])
    .bandwidth(viewBoxSize / 75)
    .thresholds(15)(points);

  const colorScale = d3
    .scaleSequential(d3.interpolateYlOrRd)
    .domain([0, d3.max(density, (d) => d.value) ?? 1]);

  let highlightPoint: [number, number] | null = null;
  if (props.highlightLocation) {
    const projected = projection(props.highlightLocation);
    if (projected) highlightPoint = projected as [number, number];
  }

  svg
    .append("g")
    .selectAll("path")
    .data(density)
    .join("path")
    .attr("d", (d: any) => d3.geoPath()(d))
    .attr("fill", (d) => colorScale(d.value))
    .attr("stroke", "none")
    .attr("opacity", 0.85);

  svg
    .append("g")
    .selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", (d) => d[0])
    .attr("cy", (d) => d[1])
    .attr("r", 1.5)
    .attr("fill", "steelblue")
    .attr("opacity", 0.1);

  if (highlightPoint) {
    const group = svg.append("g").attr("class", "highlight-point");

    group
      .append("circle")
      .attr("cx", highlightPoint[0])
      .attr("cy", highlightPoint[1])
      .attr("r", 5)
      .attr("fill", "red")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
      .attr("opacity", 1);

    group
      .append("text")
      .attr("x", highlightPoint[0] + 12)
      .attr("y", highlightPoint[1] - 12)
      .text("YOU")
      .attr("fill", "red")
      .attr("stroke", "#000")
      .attr("font-size", 24)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle");
  }
}

function redrawChart() {
  d3.select("#chart").selectAll("*").remove();
  renderChart();
}

onMounted(async () => {
  await loadGeoJSON();
  renderChart();
  window.addEventListener("resize", redrawChart);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", redrawChart);
  d3.select("#chart").selectAll("*").remove();
});
</script>

<style scoped></style>
