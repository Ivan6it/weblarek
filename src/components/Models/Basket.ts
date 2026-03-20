import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    add(item: IProduct): void {
        this.items.push(item);
        this.events.emit('cart:changed');
    }

    remove(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('cart:changed');
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