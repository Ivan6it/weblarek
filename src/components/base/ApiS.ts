import { IApi } from '../../types';
import { IProduct } from '../../types';
import { IGetProductsResponse } from '../../types';
import { IOrder } from '../../types';
import { IOrderResponse } from '../../types';

export class AppApi {
    constructor(private api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IGetProductsResponse>('/product/')
            .then(res => res.items);
    }

    postOrder(orderData: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', orderData);
    }
}