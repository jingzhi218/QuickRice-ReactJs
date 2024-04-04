import React, { useState, useEffect } from 'react';
import { getRevenueData, getFoodSalesData } from '../../services/reportService';
import classes from './reportAdminPage.module.css';
import Title from '../../components/Title/Title';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ReportsAdminPage() {
    const [period, setPeriod] = useState('day');
    const [foodSalesData, setFoodSalesData] = useState([]);
    const [costs, setCosts] = useState({}); // State to track costs

    const [dayRevenue, setDayRevenue] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [yearRevenue, setYearRevenue] = useState(0);

    useEffect(() => {
        // Fetch food sales data and revenue data based on the selected period
        async function fetchData() {
            try {
                const salesData = await getFoodSalesData(period);
                setFoodSalesData(salesData);

                const dayData = await getRevenueData('day');
                const weekData = await getRevenueData('week');
                const monthData = await getRevenueData('month');
                const yearData = await getRevenueData('year');

                setDayRevenue(dayData);
                setWeekRevenue(weekData);
                setMonthRevenue(monthData);
                setYearRevenue(yearData);
            } catch (error) {
                toast.error(`Failed to load data: ${error.message}`);
            }
        }
        fetchData(); // Call the fetchData function when the period changes
    }, [period]); // Re-run the effect when the period changes

    // Handle period change
    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    // Handle cost input change
    const handleCostChange = (id, value) => {
        setCosts({
            ...costs,
            [id]: parseFloat(value) || 0
        });
    };
    // const totalRevenue = sortedFoodSalesData.reduce((acc, food) => acc + food.revenue, 0);
    // food => ((food.revenue / totalRevenue) * 100).toFixed(2)
    
    const sortedFoodSalesData = foodSalesData.slice().sort((a, b) => b.quantity - a.quantity);

    const totalQuantity = sortedFoodSalesData.reduce((acc, food) => acc + food.quantity, 0);
    const pieChartData = {
        labels: sortedFoodSalesData.map(food => food.name),
        datasets: [
            {
                label: 'Quantity Sold Over Time %',
                data: sortedFoodSalesData.map(food => ((food.quantity / totalQuantity) * 100).toFixed(2)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    const netProfits = sortedFoodSalesData.map(food => {
        const cost = costs[food.id] || 0;
        return food.revenue - (cost * food.quantity);
    });

    const lineChartData = {
        labels: sortedFoodSalesData.map(food => food.name),
        datasets: [
            {
                label: 'Net Profit Over Time RM',
                data: netProfits,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    return (
        <div className={classes.container}>
            <Title title="Reports Admin Page" margin="1rem auto" />

            {/* Period selection buttons */}
            <div className={classes.buttons}>
                <div onClick={() => handlePeriodChange('day')} className={period === 'day' ? classes.selected : ''}>
                    <span>Today:</span>
                    <span>RM{dayRevenue.toFixed(2)}</span>
                </div>
                <div onClick={() => handlePeriodChange('week')} className={period === 'week' ? classes.selected : ''}>
                    <span>This Week:</span>
                    <span>RM{weekRevenue.toFixed(2)}</span>
                </div>
                <div onClick={() => handlePeriodChange('month')} className={period === 'month' ? classes.selected : ''}>
                    <span>This Month:</span>
                    <span>RM{monthRevenue.toFixed(2)}</span>
                </div>
                <div onClick={() => handlePeriodChange('year')} className={period === 'year' ? classes.selected : ''}>
                    <span>This Year:</span>
                    <span>RM{yearRevenue.toFixed(2)}</span>
                </div>
            </div>

            {/* Display food sales data or "No more data" message */}
            {foodSalesData.length === 0 ? (
                <div className={classes.noData}>No more data</div>
            ) : (
                <div className={classes.leftRight}>
                    <div className={classes.foodSales}>
                        <h3>Food Sales Data:</h3>
                        {sortedFoodSalesData.map((food, index) => {
                            const cost = costs[food.id] || 0;
                            const netProfit = food.revenue - (cost * food.quantity);

                            return (
                                <div key={index}>
                                    <div className={classes.foodItem}>
                                        <div className={classes.foodImage}>
                                            <Link key={food.id} to={`/food/${food.id}`}>
                                                <img src={food.imageUrl} alt={food.name} />
                                            </Link>
                                        </div>
                                        <div className={classes.foodDetails}>
                                            <p>Name: {food.name}</p>
                                            <p>Quantity Sold: {food.quantity}</p>
                                            <p className={classes.price}>Revenue: RM{food.revenue.toFixed(2)}</p>
                                        </div>
                                        <div className={classes.foodDetails}>
                                            <p>
                                                Cost per food: 
                                                <input
                                                    type="number"
                                                    value={cost}
                                                    onChange={(e) => handleCostChange(food.id, e.target.value)}
                                                    className={classes.costInput}
                                                />
                                            </p>
                                            <p className={classes.netProfit}>Net Profit: RM{netProfit.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={classes.chartContainer}>
                        <h3>Sales Chart:</h3>
                        <div className={classes.chart}>
                            <Pie data={pieChartData} />
                        </div>
                        <div className={classes.chart}>
                            <Line data={lineChartData} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
