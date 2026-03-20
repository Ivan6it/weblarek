import { IApi, IProduct, IGetProductsResponse, IOrder, IOrderResponse } from '../../types';

export class AppApi {  
    constructor(private api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IGetProductsResponse>('/product/')
            .then(res => res.items);
    }

    postOrder(orderData: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', orderData)
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error('Ошибка postOrder:', err);
                throw err;
            });
    }
}