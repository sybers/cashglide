import { ref } from "vue";
import * as formatting from "../utils/formatting";

const currency = ref('EUR');

export function useCurrency() {

    function formatCurrency(amount: number): string {
        return formatting.formatCurrency(amount, currency.value)
    }

    return {
        currency,
        formatCurrency
    }
}