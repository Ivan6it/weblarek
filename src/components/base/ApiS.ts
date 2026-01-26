import { Api } from './Api';
import { IProduct } from '../../types';
import { IGetProductsResponse } from '../../types';

export class AppApi {
    constructor(private api: Api) {}

    getProducts(): Promise<IProduct[]> {
        return this.api.get<IGetProductsResponse>('/api/weblarek/product/')
            .then(res => res.items);
    }

    postOrder(orderData: object): Promise<any> {
        return this.api.post('/order/', orderData);
    }
}