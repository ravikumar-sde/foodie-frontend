import { useState, useEffect, useRef } from 'react';
import './foodCardList.scss';
import FoodCard from './Layout/FoodCard';
import { useNavigation, useParams } from 'react-router-dom';
import OnlineOrderLoader from './Loaders/OrdersLoader';
import GalleryLoader from './Loaders/PhotosLoader';
import ReviewsLoader from './Loaders/ReviewLoader';
import UnviersalLoader from '../Layout/PreLoader';
import NotFound from '../User/Layout/NotFound';
import noDishFound from '../../Asset/no-food-found.webp'
import { fetchData } from '../../Utilities/api';
import { useCart } from '../../Context/cartProvider';
import CartPopup from './Cart/CartPopup';

export default function FoodCardList() {
    const [inputValue, setInputValue] = useState('');
    const [dishes, setDishes] = useState([]);
    const navigation = useNavigation();
    const [renderLoader, setRenderLoader] = useState('');
    const { id } = useParams();
    const queryRef = useRef(null);
    const { addToCart, removeFromCart, getFoodQuantity } = useCart();

    useEffect(() => {
        (async () => {
            const dishList = await fetchData(`/restaurants/${id}/dishes`);
            dishList?.dishes && setDishes([...dishList.dishes]);
        })();
        //eslint-disable-next-line 
    }, [inputValue]);

    useEffect(() => {
        if (navigation.location && navigation.location.pathname.endsWith('/gallery') && !navigation.formMethod) {
            setRenderLoader(<GalleryLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/online-order') && !navigation.formMethod) {
            setRenderLoader(<OnlineOrderLoader />);
        } else if (navigation.location && navigation.location.pathname.endsWith('/reviews') && !navigation.formMethod && !navigation.location.pathname.startsWith('/profile')) {
            setRenderLoader(<ReviewsLoader />);
        } else if (!navigation.formMethod) {
            setRenderLoader(<UnviersalLoader />);
        }
    }, [navigation])

    const renderCards = dishes.length > 0 && dishes.map(food => {
        return (
            <FoodCard
                data={food}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                quantity={getFoodQuantity(food._id)}
            />
        )
    });

    const handleOnChange = (e) => {
        setInputValue(e.target.value);
        queryRef.current = e.target.value;
    }

    const clearInputValue = () => {
        setInputValue('');
    }

    const handleClickEvent = async (e) => {
        e.preventDefault();
        const dishList = await fetchData(`/restaurants/${id}/dishes?dish=${queryRef.current}`);
        setDishes(dishList.dishes || []);
    }

    return (
        <>
            {navigation.state === 'loading' && !navigation.formMethod ? renderLoader : <div className='food-card-list-wrapper'>
                <CartPopup />
                <div className='online-order-container'>
                    <div className='online-order-wrapper'>
                        <p className='heading'>Order Online</p>
                        <p className='track-order'>
                            <i className='bx bx-compass' ></i>
                            <span>Live track your order</span>
                        </p>
                    </div>
                    <form method='get' className='search-restaurant-food' onSubmit={handleClickEvent}>
                        <i className='bx bx-search search-icon'></i>
                        <input className='search' placeholder='Search within menu' value={inputValue} ref={queryRef} onChange={handleOnChange} />
                        <i className='bx bx-x close-icon' onClick={clearInputValue}></i>
                    </form>
                </div>
                {dishes.length > 0 ? <div className='food-card-wrapper'>{renderCards}</div> : <NotFound image={noDishFound} description='No items found that match your search/filter.' />}
            </div>}s
        </>
    )
}