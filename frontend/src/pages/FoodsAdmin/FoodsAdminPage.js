import { useEffect, useState } from 'react';
import classes from './foodsAdminPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { deleteById, getAll, search } from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';
import Price from '../../components/Price/Price';
import { toast } from 'react-toastify';
import Loader from '../../components/Loading/Loading';
import { useCart } from '../../hooks/useCart';

export default function FoodsAdminPage() {
    const { removeFoodFromCart } = useCart();
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const { searchTerm } = useParams();

    useEffect(() => {
        loadFoods();
    }, [searchTerm]);

    const loadFoods = async () => {
        setLoading(true);
        const foods = searchTerm ? await search(searchTerm) : await getAll();
        setFoods(foods);
        setLoading(false);
    };

    const FoodsNotFound = () => {
        if (foods.length > 0) return null;

        return searchTerm ? (
            <NotFound linkRoute="/admin/foods" linkText="Show All" />
        ) : (
            <NotFound linkRoute="/dashboard" linkText="Back to dashboard!" />
        );
    };

    const deleteFood = async (food) => {
        const confirmed = window.confirm(`Delete Food ${food.name}?`);
        if (!confirmed) return;

        await deleteById(food.id);
        toast.success(`"${food.name}" Has Been Removed!`);
        setFoods((foods) => foods.filter((f) => f.id !== food.id));

        // Remove the item from the cart if it exists
        removeFoodFromCart(food.id);
    };

    return (
        <div className={classes.container}>
            <div className={classes.list}>
                <Title title="Manage Foods" margin="1rem auto" />
                <Search
                    searchRoute="/admin/foods/"
                    defaultRoute="/admin/foods"
                    placeholder="Search Foods"
                    margin="1rem 0"
                />
                <Link to="/admin/addFood" className={classes.add_food}>
                    Add Food +
                </Link>
                <FoodsNotFound />
                {loading ? (
                    <Loader />
                ) : (
                    foods.map((food) => (
                        <div key={food.id} className={`${classes.list_item} ${classes.foodCard}`}>
                            <img src={food.imageUrl} alt={food.name} />
                            <Link to={'/food/' + food.id}>{food.name}</Link>
                            <Price price={food.price} />
                            <div className={classes.actions}>
                                <Link to={'/admin/editFood/' + food.id}>Edit</Link>
                                <Link onClick={() => deleteFood(food)}>Delete</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
