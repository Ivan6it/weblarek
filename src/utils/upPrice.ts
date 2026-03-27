export function renderPrice(price: number): string {
    return price > 9999 ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : price.toString();
}