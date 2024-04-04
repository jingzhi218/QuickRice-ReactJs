import React, { useEffect, useReducer, useState } from 'react';
import { getAll, getAllByTags, getAllTags, search } from '../../services/foodService';
import { getTopSalesData, getTopSetSalesData, getSuccessfulPaymentsCount } from '../../services/reportService';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import { Link, useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import NotFound from '../../components/NotFound/NotFound';
import classes from './homePage.module.css';
import Button from '../../components/Button/Button';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialState = { foods: [], tags: [] };

const reducer = (state, action) => {
    switch (action.type) {
        case 'FOODS_LOADED':
            return { ...state, foods: action.payload };
        case 'TAGS_LOADED':
            return { ...state, tags: action.payload };
        default:
            return state;
    }
};

export default function HomePage() {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { foods, tags } = state;
    const { searchTerm, tag } = useParams();
    const element = document.getElementById("menu");
    const handleClick = () => {
        element.scrollIntoView({ behavior: 'smooth' });
    };
    const [topSellingFoods, setTopSellingFoods] = useState([]);
    const [topSellingFoodSet, setTopSellingFoodSet] = useState([]);

    useEffect(() => {
        getAllTags().then(tags => dispatch({ type: 'TAGS_LOADED', payload: tags }));

        const loadFoods = tag ? getAllByTags(tag) : searchTerm ? search(searchTerm) : getAll();

        loadFoods.then(foods => dispatch({ type: 'FOODS_LOADED', payload: foods }));

        async function fetchTopSellingData() {
            try {
                const { count } = await getSuccessfulPaymentsCount();
                const period = count < 10 ? 'lastMonth' : 'month';

                const foodSalesData = await getTopSalesData(period);
                setTopSellingFoods(foodSalesData);

                const foodSetData = await getTopSetSalesData(period); 
                setTopSellingFoodSet(foodSetData);
            } catch (error) {
                console.error(`Failed to load top selling data: ${error.message}`);
            }
        }
        fetchTopSellingData();
    }, [searchTerm, tag]);

    const handleAddToCart = (foodSet) => {
        foodSet.foods.forEach(food => {
            addToCart(food); 
        });
        navigate('/cart');
        toast.success('The food set has been added to the cart!');
    };

    return (
        <div className={classes.container}>
            <section className={classes.hero}>
                <div className={classes.heroContent}>
                    <h1 className={classes.heroTitle}>Quick Rice</h1>
                    <p className={classes.heroSubtitle}>
                        We offer Mix Rice, which contains a wide range of cuisines in various formats. Use our services now and stimulate your taste buds with good food!
                    </p>
                    <Button onClick={handleClick} text="Order Now" />
                </div>
            </section>

            <section className={classes.monthlyBest}>
                <h2 className={classes.sectionTitle}>Monthly Best Sellers</h2>
                <div className={classes.menuItems}>
                    {topSellingFoods.map((food, index) => (
                        <Link to={`/food/${food.food._id}`} key={index}>
                            <div className={`${classes.foodItem} ${index === 0 ? classes.leftItem : index === 1 ? classes.topItem : classes.rightItem}`}>
                                <img src={food.food.imageUrl} alt={food.food.name} />
                                <div className={classes.foodDetails}>
                                    <p>Name: {food.food.name}</p>
                                    <p>Price: RM {food.food.price}</p>
                                    <p>Origins: {food.food.origins.join(', ')}</p>
                                    <p>Tags: {food.food.tags.join(', ')}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={classes.topSellingSet}>
                <h2 className={classes.sectionTitle2}>Top Selling Food Set</h2>
                <div className={classes.setItems}>
                    {topSellingFoodSet.foods && topSellingFoodSet.foods.map((food, index) => (
                        <div className={classes.setItem} key={index}>
                            <Link to={`/food/${food._id}`}>
                                <div className={classes.foodItem}>
                                    <img src={food.imageUrl} alt={food.name} />
                                    <div className={classes.foodDetails}>
                                        <p>Name: {food.name}</p>
                                        <p>Price: RM {food.price}</p>
                                        <p>Origins: {food.origins.join(', ')}</p>
                                        <p>Tags: {food.tags.join(', ')}</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <Button onClick={() => handleAddToCart(topSellingFoodSet)} text="Add to Cart" className={classes.addButton} />
            </section>

            <div className={classes.searchTags}>
                <Search />
                <Tags tags={tags} />
            </div>

            <section id='menu' className={classes.popularMenu}>
                <h2 className={classes.sectionTitle}>Popular Menu</h2>
                <div className={classes.menuItems}>
                    {foods.length === 0 ? <NotFound linkText="Reset Search" /> : <Thumbnails foods={foods} />}
                </div>
            </section>
        </div>
    );
}
