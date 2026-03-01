<div align="center">

  <h1>💸 CashGlide</h1>

  <p><strong>Visualize and take control of your cashflow</strong></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js" alt="Vue 3"/>
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite"/>
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License"/>
  </p>

</div>

---

## 💡 About

**CashGlide** is a minimalist personal finance tool to map your money flows at a glance. Enter your revenues, investments and expenses, and CashGlide computes your net cashflow, displays an investment breakdown, and renders an interactive Sankey diagram so you can see exactly where your money comes from and where it goes.

No account, no server. Everything lives in your browser's localStorage.

## ✨ Features

- 💰 **Revenue tracking**: organize your income sources into subcategories (salary, freelancing, dividends...)
- 📈 **Investment tracking**: log your investments and see their share of total income
- 💸 **Expense tracking**: categorize your spending and identify where your money goes
- 🔀 **Sankey diagram**: interactive flow chart powered by Plotly.js that visualizes your entire cashflow
- 📊 **Investment overview**: real-time stats including total revenue, total expenses, net cashflow and investment ratio
- 🌍 **Multi-currency**: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY
- 💾 **Zero-backend persistence**: data is automatically saved to localStorage
- 📱 **Responsive**: works on desktop and mobile

## 🛠️ Stack

- **[Vue 3](https://vuejs.org/)**: Composition API, `<script setup>`
- **[TypeScript](https://www.typescriptlang.org/)**: full type safety across the codebase
- **[Vite](https://vite.dev/)**: blazing fast dev server and build tool
- **[Pinia](https://pinia.vuejs.org/)**: lightweight state management
- **[Tailwind CSS v4](https://tailwindcss.com/)**: utility-first styling
- **[Plotly.js](https://plotly.com/javascript/)**: interactive Sankey chart
- **[VueUse](https://vueuse.org/)**: `useLocalStorage` and other composable utilities

## 🚀 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/sybers/cashglide.git
   cd cashglide
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the dev server**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

### Available scripts

```bash
pnpm dev          # Start development server
pnpm build        # Type-check and build for production
pnpm preview      # Preview the production build
pnpm lint         # Lint with oxlint
pnpm lint:fix     # Auto-fix lint errors
pnpm fmt          # Format with oxfmt
pnpm fmt:check    # Check formatting
```

## 🤝 Contributing

Contributions are welcome, feel free to open a [PR](https://github.com/sybers/cashglide/pulls) or an [issue](https://github.com/sybers/cashglide/issues).

## 📝 License

This project is licensed under the MIT License, see the [LICENSE](LICENSE.md) file for details.
