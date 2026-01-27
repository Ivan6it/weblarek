import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Basket';
import { Order } from './components/Models/Order';
import { Api } from './components/base/Api';
import { AppApi } from './components/base/ApiS';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

const productsModel = new Products();
const cart = new Cart();
const order = new Order();
const api = new Api(API_URL);
const appApi = new AppApi(api);

appApi.getProducts()
    .then(items => {
        productsModel.setItems(items);
        console.log('Товары:', productsModel.getItems());
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

// Тестирование
// Products
console.log(' Тест Products');

productsModel.setItems(apiProducts.items);
console.log('Products.getItems():', productsModel.getItems());

const firstProduct = apiProducts.items[0];
console.log('Products.getProductById("854cef69-..."):', 
    productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390')
);

productsModel.setSelectedProduct(firstProduct);
console.log('Products.getSelectedProduct():', productsModel.getSelectedProduct());

productsModel.setSelectedProduct(null);
console.log('После setSelectedProduct(null):', productsModel.getSelectedProduct());

// Cart
console.log('Тест Cart');
cart.add(apiProducts.items[0]);
cart.add(apiProducts.items[1]);

console.log('Cart.getItems() после добавления:', cart.getItems());

console.log('Cart.hasItem("854cef69-..."):', 
    cart.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390')
);
console.log('Cart.hasItem("не_существует"):', 
    cart.hasItem('не_существует')
);

console.log('Cart.getTotal():', cart.getTotal());
console.log('Cart.getTotalCount():', cart.getTotalCount());

cart.remove('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Cart.getItems() после remove():', cart.getItems());

cart.clear();
console.log('Cart.getItems() после clear():', cart.getItems());

// Order
console.log('Тест Order');
order.setPayment('card');
order.setEmail('user@yandex.ru');
order.setPhone('+79999999999');
order.setAddress('г. Коломна, ул. Кирова, д. 15');
console.log('Order.getData():', order.getData());
console.log('Order.validate() (всё заполнено):', order.validate());
order.clear();
console.log('Order.getData() после clear():', order.getData());
console.log('Order.validate() (после clear):', order.validate());