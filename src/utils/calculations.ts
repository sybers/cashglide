import type { Category, SubCategory, CashflowItem, InvestmentStats, CashflowData, SankeyData } from '@/types'

export function calculateItemsTotal(items: CashflowItem[]): number {
  return items.reduce((total, item) => total + item.amount, 0)
}

export function calculateSubCategoriesTotal(subCategories: SubCategory[]): number {
  return subCategories.reduce((total, sub) => {
    return total + calculateItemsTotal(sub.items)
  }, 0)
}

export function calculateCategoryTotal(categories: Category[]): number {
  return categories.reduce((total, category) => {
    return total + calculateSubCategoriesTotal(category.subCategories)
  }, 0)
}

export function calculateInvestmentStats(
  totalRevenue: number,
  totalInvestments: number,
  totalExpenses: number
): InvestmentStats {
  const currentPercentage = totalRevenue > 0
    ? (totalInvestments / totalRevenue) * 100
    : 0

  // "Possible" percentage assumes we could invest revenue minus necessary expenses
  const availableForInvestment = totalRevenue - totalExpenses
  const possiblePercentage = totalRevenue > 0
    ? (availableForInvestment / totalRevenue) * 100
    : 0

  return {
    currentPercentage: parseFloat(currentPercentage.toFixed(2)),
    possiblePercentage: Math.max(0, parseFloat(possiblePercentage.toFixed(2))),
    currentAmount: totalInvestments,
    possibleAmount: Math.max(0, availableForInvestment)
  }
}

export function generateSankeyData(cashflowData: CashflowData): SankeyData {
  const nodes: { name: string; value: number }[] = []
  const links: { source: number; target: number; value: number }[] = []

  // Node index tracking
  let nodeIndex = 0
  const nodeMap = new Map<string, number>()

  // Helper to add node
  const addNode = (name: string, value: number = 0): number => {
    if (nodeMap.has(name)) {
      return nodeMap.get(name)!
    }
    const index = nodeIndex++
    nodes.push({ name, value })
    nodeMap.set(name, index)
    return index
  }

  // Calculate totals first
  const revenues = cashflowData.categories.filter(c => c.type === 'revenue')
  const investments = cashflowData.categories.filter(c => c.type === 'investment')
  const expenses = cashflowData.categories.filter(c => c.type === 'expense')

  const totalRevenue = calculateCategoryTotal(revenues)
  const totalInvestments = calculateCategoryTotal(investments)
  const totalExpenses = calculateCategoryTotal(expenses)

  // Main revenue node
  const revenueNodeIdx = addNode('Total Revenue', totalRevenue)

  // Investment and expense target nodes
  const investmentsNodeIdx = addNode('Total Investments', totalInvestments)
  const expensesNodeIdx = addNode('Total Expenses', totalExpenses)

  // Process each category type
  cashflowData.categories.forEach(category => {
    if (category.type === 'revenue') {
      category.subCategories.forEach(sub => {
        const subTotal = calculateItemsTotal(sub.items)
        if (subTotal > 0) {
          const subNodeIdx = addNode(sub.name, subTotal)
          links.push({ source: subNodeIdx, target: revenueNodeIdx, value: subTotal })
        }
      })
    } else if (category.type === 'investment') {
      category.subCategories.forEach(sub => {
        const subTotal = calculateItemsTotal(sub.items)
        if (subTotal > 0) {
          const subNodeIdx = addNode(sub.name, subTotal)
          links.push({ source: revenueNodeIdx, target: subNodeIdx, value: subTotal })
          links.push({ source: subNodeIdx, target: investmentsNodeIdx, value: subTotal })
        }
      })
    } else if (category.type === 'expense') {
      category.subCategories.forEach(sub => {
        const subTotal = calculateItemsTotal(sub.items)
        if (subTotal > 0) {
          const subNodeIdx = addNode(sub.name, subTotal)
          links.push({ source: revenueNodeIdx, target: subNodeIdx, value: subTotal })
          links.push({ source: subNodeIdx, target: expensesNodeIdx, value: subTotal })
        }
      })
    }
  })

  return { nodes, links }
}
