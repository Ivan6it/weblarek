import { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    add(item: IProduct): void {
        this.items.push(item);
    }

    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}