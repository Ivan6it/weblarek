import { IBuyer, TPayment } from '../../types';
import { IEvents } from "../base/Events";

export class Order {
    private payment: TPayment = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(protected events: IEvents) {}

    setPayment(value: TPayment): void {
        this.payment = value;
        this.events.emit('set:payment', {
            payment: this.payment,
        });
    }

    setEmail(value: string): void {
        this.email = value;
        this.events.emit('set:contacts');
    }

    setPhone(value: string): void {
        this.phone = value;
        this.events.emit('set:contacts');
    }

    setAddress(value: string): void {
        this.address = value;
        this.events.emit('set:address');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('clear');
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.address) errors.address = 'Укажите адрес доставки';

        return errors;
    }
}