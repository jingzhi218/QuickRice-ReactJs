import { Router } from 'express';
import handler from 'express-async-handler';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';

const router = Router();

router.get('/revenue', handler(async (req, res) => {
    const { period } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (period === 'day') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (period === 'week') {
        const daysSinceMonday = (now.getDay() || 7) - 1; 
        startDate = new Date(now);
        startDate.setDate(now.getDate() - daysSinceMonday);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        return res.status(BAD_REQUEST).send('Invalid period parameter');
    }

    const orders = await OrderModel.find({
        status: OrderStatus.PAYED,
        createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalRevenue = orders.reduce((total, order) => total + order.totalPrice, 0);

    res.send(totalRevenue.toFixed(2));
}));



router.get('/foodSales', handler(async (req, res) => {
    const { period } = req.query;

    let startDate, endDate;
    const now = new Date();

    if (period === 'day') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (period === 'week') {
        const daysSinceMonday = (now.getDay() === 0 ? 7 : now.getDay()) - 1;
        startDate = new Date(now.setDate(now.getDate() - daysSinceMonday));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'year') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        return res.status(400).send('Invalid period parameter');
    }

    const orders = await OrderModel.find({
        status: OrderStatus.PAYED,
        createdAt: { $gte: startDate, $lte: endDate },
    });

    const foodSalesData = {};

    orders.forEach(order => {
        order.items.forEach(item => {
            const { food, quantity, price } = item;
            const foodId = food._id.toString();
            if (!foodSalesData[foodId]) {
                foodSalesData[foodId] = {
                    id: foodId,
                    name: food.name,
                    imageUrl: food.imageUrl,
                    quantity: 0,
                    revenue: 0,
                };
            }
            foodSalesData[foodId].quantity += quantity;
            foodSalesData[foodId].revenue += price;
        });
    });

    const salesDataArray = Object.values(foodSalesData);

    res.send(salesDataArray);
}));


router.get('/topSales', handler(async (req, res) => {
    const { period } = req.query;

    // Determine the start and end dates for the query
    let startDate, endDate;
    const now = new Date();

    if (period === 'day') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (period === 'week') {
        const daysSinceMonday = (now.getDay() === 0 ? 7 : now.getDay()) - 1;
        startDate = new Date(now.setDate(now.getDate() - daysSinceMonday));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (period === 'lastMonth') {
        startDate = new Date(now.getFullYear(), now.getMonth()-1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() , 0, 23, 59, 59, 999);
    } else {
        return res.status(400).send('Invalid period parameter');
    }

    // Query paid orders within the specified time period
    const orders = await OrderModel.find({
        status: OrderStatus.PAYED,
        createdAt: { $gte: startDate, $lte: endDate },
    });

    // Initialize an object to store food sales data
    const foodSalesData = {};

    // Iterate through orders and populate food sales data
    orders.forEach(order => {
        order.items.forEach(item => {
            const { food, quantity } = item;
            const foodId = food._id.toString(); // Convert ObjectId to string
            if (!foodSalesData[foodId]) {
                foodSalesData[foodId] = {
                    food,
                    quantity: 0,
                };
            }
            foodSalesData[foodId].quantity += quantity;
        });
    });

    // Convert the food sales data object to an array
    const salesDataArray = Object.values(foodSalesData);

    // Sort by quantity sold in descending order
    salesDataArray.sort((a, b) => b.quantity - a.quantity);

    // Return the top 3 selling foods
    // const topSellingFoods = salesDataArray.slice(0, 3);
    let topSellingFoods;

    // Check if the request is from a mobile device
    const userAgent = req.headers['user-agent'];
    const isMobile = /mobile/i.test(userAgent);

    if (isMobile) {
        topSellingFoods = [salesDataArray[0], salesDataArray[1], salesDataArray[2]];
    } else {
        topSellingFoods = [salesDataArray[1], salesDataArray[0], salesDataArray[2]];
    }
    res.send(topSellingFoods);
}));

router.get('/topSetSales', handler(async (req, res) => {
    const { period } = req.query;

    // Determine the start and end dates for the query
    let startDate, endDate;
    const now = new Date();

    if (period === 'day') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
    } else if (period === 'week') {
        const daysSinceMonday = (now.getDay() === 0 ? 7 : now.getDay()) - 1;
        startDate = new Date(now.setDate(now.getDate() - daysSinceMonday));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    } else if (period === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }  else if (period === 'lastMonth') {
        startDate = new Date(now.getFullYear(), now.getMonth()-1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth() , 0, 23, 59, 59, 999);
    } else {
        return res.status(400).send('Invalid period parameter');
    }

    // Query paid orders within the specified time period
    const orders = await OrderModel.find({
        status: OrderStatus.PAYED,
        createdAt: { $gte: startDate, $lte: endDate },
    });

    // Initialize an object to store food set sales data
    const foodSetSalesData = {};

    // Iterate through orders and populate food set sales data
    orders.forEach(order => {
        // Use a Set to store unique food IDs for each order
        const foodSet = new Set(order.items.map(item => item.food._id.toString()));
        const foodSetKey = Array.from(foodSet).sort().join('-');

        if (!foodSetSalesData[foodSetKey]) {
            foodSetSalesData[foodSetKey] = {
                foods: Array.from(foodSet).map(id => order.items.find(item => item.food._id.toString() === id).food),
                quantity: 0,
            };
        }
        foodSetSalesData[foodSetKey].quantity += 1; // Count the number of times this set is ordered
    });

    // Convert the food set sales data object to an array
    const foodSetSalesArray = Object.values(foodSetSalesData);

    // Sort by quantity sold in descending order
    foodSetSalesArray.sort((a, b) => b.quantity - a.quantity);

    // Return the top selling food set
    const topSellingFoodSet = foodSetSalesArray[0];
    res.send(topSellingFoodSet);
}));

router.get('/successfulPaymentsCount', handler(async (req, res) => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const count = await OrderModel.countDocuments({
        status: OrderStatus.PAYED,
        createdAt: { $gte: startDate, $lte: endDate },
    });

    res.send({ count });
}));


export default router;