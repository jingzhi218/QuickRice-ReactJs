import axios from 'axios';

export async function getRevenueData(period) {
    try {
        const response = await axios.get(`/api/reports/revenue?period=${period}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to load revenue data: ${error.message}`);
        throw error;
    }
}

export async function getTopSalesData(period) {
    try {
        const response = await axios.get(`/api/reports/topSales?period=${period}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to load top sales data: ${error.message}`);
        throw error;
    }
}

export async function getTopSetSalesData(period) {
    try {
        const response = await axios.get(`/api/reports/topSetSales?period=${period}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to load top set sales data: ${error.message}`);
        throw error;
    }
}

export async function getFoodSalesData(period) {
    try {
        const response = await axios.get(`/api/reports/foodSales?period=${period}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to load food sales data: ${error.message}`);
        throw error;
    }
}

export async function getSuccessfulPaymentsCount() {
    try {
        const response = await axios.get(`/api/reports/successfulPaymentsCount`);
        return response.data;
    } catch (error) {
        console.error(`Failed to load food sales data: ${error.message}`);
        throw error;
    }
}
