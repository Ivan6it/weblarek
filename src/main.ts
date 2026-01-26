import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Api } from './components/base/Api';
import { AppApi } from './components/base/ApiS';

const productsModel = new Products();
const api = new Api(import.meta.env.VITE_API_ORIGIN);
const appApi = new AppApi(api);

appApi.getProducts()
    .then(items => {
        productsModel.setItems(items);
        console.log('Товары:', productsModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });