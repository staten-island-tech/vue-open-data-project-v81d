<template>
  <div ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";

const props = defineProps<{
  data: string[];
  xAxisLabel: string;
  yAxisLabel: string;
}>();

const chartRef = ref<HTMLDivElement>();

const viewBoxWidth = 500;
const viewBoxHeight = 300;

function renderChart() {
  const counts = props.data.reduce<Record<string, number>>((acc, val) => {
    acc[val] = (acc[val] ?? 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(counts);

  const margin = { top: 20, right: 20, bottom: 60, left: 60 };
  const width = viewBoxWidth - margin.left - margin.right;
  const height = viewBoxHeight - margin.top - margin.bottom;

  const svg = d3
    .select(chartRef.value!)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(entries.map(([label]) => label))
    .range([0, width])
    .padding(0.3);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .call((a) => a.selectAll("text").attr("fill", "currentColor"))
    .call((a) => a.selectAll("line, path").attr("stroke", "currentColor"));

  g.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .text(props.xAxisLabel);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(entries, ([, val]) => val)!])
    .range([height, 0]);

  g.append("g")
    .call(d3.axisLeft(y))
    .call((a) => a.selectAll("text").attr("fill", "currentColor"))
    .call((a) => a.selectAll("line, path").attr("stroke", "currentColor"));

  g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 15)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .text(props.yAxisLabel);

  g.selectAll(".bar")
    .data(entries)
    .join("rect")
    .attr("x", ([label]) => x(label)!)
    .attr("y", ([, val]) => y(val))
    .attr("width", x.bandwidth())
    .attr("height", ([, val]) => height - y(val))
    .attr("fill", "brown");

  g.selectAll(".label")
    .data(entries)
    .join("text")
    .attr("x", ([label]) => x(label)! + x.bandwidth() / 2)
    .attr("y", ([, val]) => y(val) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "currentColor")
    .text(([, val]) => val);
}

function redrawChart() {
  d3.select(chartRef.value!).selectAll("*").remove();
  renderChart();
}

onMounted(() => {
  renderChart();
  window.addEventListener("resize", redrawChart);
});
</script>

<style scoped></style>
