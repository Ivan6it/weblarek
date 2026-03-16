import { IBuyer, TPayment } from '../../types';

export class Order {
    private payment: TPayment = null;
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