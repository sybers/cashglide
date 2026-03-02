<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import Plotly from "plotly.js-dist-min";
import { useCashflowStore } from "@/composables/useCashflow";
import { formatCurrency } from "@/utils/formatting";
import { storeToRefs } from "pinia";

const { sankeyData, currency } = storeToRefs(useCashflowStore());

const chartContainer = ref<HTMLDivElement | null>(null);
const isExporting = ref(false);

async function exportChart() {
  if (!chartContainer.value || isExporting.value) return;
  isExporting.value = true;
  try {
    const dataUrl = await Plotly.toImage(chartContainer.value, {
      format: "png",
      width: 1600,
      height: 700,
      scale: 2,
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "cashglide-sankey.png";
    a.click();
  } finally {
    isExporting.value = false;
  }
}

function renderChart() {
  if (!chartContainer.value || sankeyData.value.links.length === 0) {
    if (chartContainer.value) {
      Plotly.purge(chartContainer.value);
    }
    return;
  }

  const data: Plotly.Data[] = [
    {
      type: "sankey",
      orientation: "h",
      node: {
        pad: 15,
        thickness: 20,
        line: {
          color: "rgba(0,0,0,0.2)",
          width: 1,
        },
        label: sankeyData.value.nodes.map(
          (n) => `${n.name}<br>${formatCurrency(n.value, currency.value)}`,
        ),
        color: sankeyData.value.nodes.map((n) => {
          if (n.name === "Total Revenue") return "#14b8a6";
          if (n.name === "Total Investments") return "#8b5cf6";
          if (n.name === "Total Expenses") return "#f97316";
          return "#cbd5e1";
        }),
      },
      link: {
        source: sankeyData.value.links.map((l) => l.source),
        target: sankeyData.value.links.map((l) => l.target),
        value: sankeyData.value.links.map((l) => l.value),
        color: sankeyData.value.links.map((l) => {
          const targetNode = sankeyData.value.nodes[l.target];
          if (!targetNode) return "rgba(203, 213, 225, 0.4)";

          if (targetNode.name === "Total Revenue") return "rgba(20, 184, 166, 0.4)";
          if (targetNode.name === "Total Investments") return "rgba(139, 92, 246, 0.4)";
          if (targetNode.name === "Total Expenses") return "rgba(249, 115, 22, 0.4)";

          return "rgba(203, 213, 225, 0.4)";
        }),
        customdata: sankeyData.value.links.map((l) => formatCurrency(l.value, currency.value)),
        hovertemplate: "%{source.label} → %{target.label}<br>%{customdata}<extra></extra>",
      },
    },
  ];

  const layout: Partial<Plotly.Layout> = {
    font: { size: 12, color: "#64748b" },
    height: 600,
    margin: { l: 20, r: 20, t: 20, b: 20 },
    paper_bgcolor: "rgba(255,255,255,0)",
    plot_bgcolor: "rgba(255,255,255,0)",
  };

  const config: Partial<Plotly.Config> = {
    responsive: true,
    staticPlot: true,
    displayModeBar: false,
  };

  Plotly.newPlot(chartContainer.value, data, layout, config);
}

onMounted(() => {
  renderChart();
  window.addEventListener("resize", renderChart);
});

onUnmounted(() => {
  window.removeEventListener("resize", renderChart);
  if (chartContainer.value) {
    Plotly.purge(chartContainer.value);
  }
});

watch([sankeyData, currency], renderChart, { deep: true });
</script>

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-slate-700">Cashflow Diagram</h2>
      <button
        v-if="sankeyData.links.length > 0"
        @click="exportChart"
        :disabled="isExporting"
        class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as PNG"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {{ isExporting ? "Exporting..." : "Export PNG" }}
      </button>
    </div>
    <div
      v-if="sankeyData.links.length === 0"
      class="flex flex-col items-center justify-center py-10 px-4 select-none"
    >
      <!-- Sankey illustration -->
      <svg
        viewBox="0 0 480 200"
        class="w-full max-w-md mb-8 opacity-60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Left nodes (sources) -->
        <rect x="8" y="20" width="14" height="60" rx="3" fill="#14b8a6" opacity="0.8" />
        <rect x="8" y="90" width="14" height="40" rx="3" fill="#14b8a6" opacity="0.5" />
        <rect x="8" y="140" width="14" height="44" rx="3" fill="#14b8a6" opacity="0.3" />

        <!-- Center node (Total Revenue) -->
        <rect x="164" y="10" width="14" height="170" rx="3" fill="#14b8a6" />

        <!-- Right nodes (targets) -->
        <rect x="302" y="14" width="14" height="80" rx="3" fill="#8b5cf6" />
        <rect x="302" y="104" width="14" height="76" rx="3" fill="#f97316" />

        <!-- Far right nodes (sub-targets) -->
        <rect x="458" y="14" width="14" height="38" rx="3" fill="#8b5cf6" opacity="0.8" />
        <rect x="458" y="56" width="14" height="36" rx="3" fill="#8b5cf6" opacity="0.5" />
        <rect x="458" y="104" width="14" height="36" rx="3" fill="#f97316" opacity="0.8" />
        <rect x="458" y="144" width="14" height="36" rx="3" fill="#f97316" opacity="0.5" />

        <!-- Flows: sources → center -->
        <path
          d="M22 50 C90 50, 90 80, 164 80"
          stroke="#14b8a6"
          stroke-width="48"
          stroke-opacity="0.12"
        />
        <path
          d="M22 110 C90 110, 90 108, 164 108"
          stroke="#14b8a6"
          stroke-width="30"
          stroke-opacity="0.10"
        />
        <path
          d="M22 162 C90 162, 90 148, 164 148"
          stroke="#14b8a6"
          stroke-width="32"
          stroke-opacity="0.08"
        />

        <!-- Flows: center → right -->
        <path
          d="M178 54 C240 54, 240 54, 302 54"
          stroke="#8b5cf6"
          stroke-width="64"
          stroke-opacity="0.14"
        />
        <path
          d="M178 140 C240 140, 240 142, 302 142"
          stroke="#f97316"
          stroke-width="60"
          stroke-opacity="0.12"
        />

        <!-- Flows: right → far right -->
        <path
          d="M316 33 C388 33, 388 33, 458 33"
          stroke="#8b5cf6"
          stroke-width="28"
          stroke-opacity="0.15"
        />
        <path
          d="M316 70 C388 70, 388 74, 458 74"
          stroke="#8b5cf6"
          stroke-width="26"
          stroke-opacity="0.12"
        />
        <path
          d="M316 122 C388 122, 388 122, 458 122"
          stroke="#f97316"
          stroke-width="28"
          stroke-opacity="0.15"
        />
        <path
          d="M316 162 C388 162, 388 162, 458 162"
          stroke="#f97316"
          stroke-width="26"
          stroke-opacity="0.12"
        />
      </svg>

      <!-- Labels -->
      <p class="text-base font-semibold text-slate-600 mb-1">
        Your cashflow diagram will appear here
      </p>
      <p class="text-sm text-slate-400 text-center max-w-xs">
        Add revenues, investments, and expenses on the left to visualize your flows.
      </p>

      <!-- Hint badges -->
      <div class="flex items-center gap-2 mt-5 flex-wrap justify-center">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-600 border border-teal-100"
        >
          <span class="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
          Revenues
        </span>
        <svg class="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-600 border border-violet-100"
        >
          <span class="w-2 h-2 rounded-full bg-violet-400 inline-block"></span>
          Investments
        </span>
        <svg class="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100"
        >
          <span class="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
          Expenses
        </span>
      </div>
    </div>
    <div class="overflow-x-auto">
      <div ref="chartContainer" class="w-full min-w-[560px]"></div>
    </div>
  </div>
</template>
