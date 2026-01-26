import { IBuyer, TPayment } from '../../types';

export class Order {
    private payment: TPayment | null = null;
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setPayment(value: TPayment): void {
        this.payment = value;
    }

    setEmail(value: string): void {
        this.email = value;
    }

    setPhone(value: string): void {
        this.phone = value;
    }

    setAddress(value: string): void {
        this.address = value;
    }

    getData(): Partial<IBuyer> {
    const result: Partial<IBuyer> = {};

    if (this.payment !== null) {
        result.payment = this.payment;
    }
    if (this.email) result.email = this.email;
    if (this.phone) result.phone = this.phone;
    if (this.address) result.address = this.address;

    return result;
}

    clear(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validate(): { [key: string]: string } | null {
        const errors: { [key: string]: string } = {};

        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.email) errors.email = 'Укажите email';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.address) errors.address = 'Укажите адрес доставки';

        return Object.keys(errors).length > 0 ? errors : null;
    }
}