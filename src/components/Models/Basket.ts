import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    add(item: IProduct): void {
        this.items.push(item);
        this.events.emit('basket:change');
    }

    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:change');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:clear');
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