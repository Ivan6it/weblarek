/**
 * Форматирует число с пробелами от 10000 и выше
 * Пример: 18000 → '18 000'
 */
export function formatNumber(value: number): string {
    return value >= 10000
        ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        : value.toString();
}