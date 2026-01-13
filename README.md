# CashGlide - Cashflow Analysis

A modern web application to visualize and analyze your cash flows. Track your revenues, investments, and expenses with interactive charts and detailed statistics.

## Features

- **Revenue Management**: Organize your income sources by categories and subcategories
- **Investment Tracking**: Analyze your investments and their distribution
- **Expense Management**: Categorize your expenses for better control
- **Sankey Visualization**: Interactive flow chart to visualize money circulation
- **Real-time Statistics**: Automatic calculations of totals and investment statistics
- **Multi-currency Support**: Support for 8 major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY)
- **Modern Interface**: Clean and responsive design with Tailwind CSS
- **Data Persistence**: Automatic saving to localStorage

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Static typing for enhanced safety
- **Vite** - Lightning-fast build tool
- **Pinia** - Modern state management for Vue
- **Plotly.js** - Interactive charting library
- **Tailwind CSS** - Utility-first CSS framework
- **VueUse** - Collection of Vue composables

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Clone the project
git clone <repo-url>
cd cashglide

# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select Currency**: Choose your currency from the dropdown in the top-right corner
2. **Add Categories**: Create subcategories to organize your financial flows
3. **Add Items**: Enter your revenues, investments, and expenses with their amounts
4. **Visualize**: View the Sankey diagram and real-time statistics

## License

MIT
