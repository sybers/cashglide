<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Plotly from 'plotly.js-dist-min'
import { useCashflowStore } from '../../composables/useCashflow'
import { formatCurrency } from '../../utils/formatting';

const cashflowStore = useCashflowStore();

const chartContainer = ref<HTMLDivElement | null>(null)

function renderChart() {
  if (!chartContainer.value || cashflowStore.sankeyData.nodes.length === 0) {
    if (chartContainer.value) {
      Plotly.purge(chartContainer.value)
    }
    return
  }

  const data: Plotly.Data[] = [{
    type: 'sankey',
    orientation: 'h',
    node: {
      pad: 15,
      thickness: 20,
      line: {
        color: 'rgba(0,0,0,0.2)',
        width: 1
      },
      label: cashflowStore.sankeyData.nodes.map(n => 
        `${n.name}<br>${formatCurrency(n.value, cashflowStore.currency)}`
      ),
      color: cashflowStore.sankeyData.nodes.map((n) => {
        // Color nodes based on their name/type - pastel colors
        if (n.name === 'Total Revenue') return '#34d399'
        if (n.name === 'Total Investments') return '#38bdf8'
        if (n.name === 'Total Expenses') return '#fb7185'
        // Sub-nodes get lighter versions
        return '#cbd5e1'
      })
    },
    link: {
      source: cashflowStore.sankeyData.links.map(l => l.source),
      target: cashflowStore.sankeyData.links.map(l => l.target),
      value: cashflowStore.sankeyData.links.map(l => l.value),
      color: cashflowStore.sankeyData.links.map((l) => {
        const targetNode = cashflowStore.sankeyData.nodes[l.target]
        if (!targetNode) return 'rgba(203, 213, 225, 0.4)'

        if (targetNode.name === 'Total Revenue') return 'rgba(52, 211, 153, 0.4)'
        if (targetNode.name === 'Total Investments') return 'rgba(56, 189, 248, 0.4)'
        if (targetNode.name === 'Total Expenses') return 'rgba(251, 113, 133, 0.4)'

        return 'rgba(203, 213, 225, 0.4)'
      }),
      customdata: cashflowStore.sankeyData.links.map(l => formatCurrency(l.value, cashflowStore.currency)),
      hovertemplate: '%{source.label} → %{target.label}<br>%{customdata}<extra></extra>'
    }
  }]

  const layout: Partial<Plotly.Layout> = {
    title: {
      text: 'Cashflow Diagram',
      font: { size: 18, color: '#475569' }
    },
    font: { size: 12, color: '#64748b' },
    height: 600,
    margin: { l: 20, r: 20, t: 60, b: 20 },
    paper_bgcolor: 'rgba(255,255,255,0)',
    plot_bgcolor: 'rgba(255,255,255,0)'
  }

  const config: Partial<Plotly.Config> = {
    responsive: true,
    staticPlot: true,
    displayModeBar: false
  }

  Plotly.newPlot(chartContainer.value, data, layout, config)
}

onMounted(() => {
  renderChart()
  window.addEventListener('resize', renderChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', renderChart)
  if (chartContainer.value) {
    Plotly.purge(chartContainer.value)
  }
})

watch(() => [cashflowStore.sankeyData, cashflowStore.currency], renderChart, { deep: true })
</script>

<template>
  <div class="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
    <div v-if="cashflowStore.sankeyData.nodes.length === 0" class="text-center text-slate-500 py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-lg font-medium mb-2 text-slate-600">No data to visualize</p>
      <p class="text-sm text-slate-400">Add revenue sources, investments, and expenses to see your cashflow diagram</p>
    </div>
    <div ref="chartContainer" class="w-full"></div>
  </div>
</template>
