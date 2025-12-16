import { useCart } from "../../../Context/cartProvider";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchData } from '../../../Utilities/api';
import CartModal from './CartModal';
import './cartPopup.scss';

export default function CartPopup() {
    const { cart, getTotalQuantity } = useCart();
    const totalQuantity = getTotalQuantity();
    const { id } = useParams();
    const [dishes, setDishes] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const dishList = await fetchData(`/restaurants/${id}/dishes`);
            dishList?.dishes && setDishes([...dishList.dishes]);
        })();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (dishes.length > 0) {
            let total = 0;
            Object.keys(cart).forEach(foodId => {
                const dish = dishes.find(d => d._id === foodId);
                if (dish) {
                    total += dish.price * cart[foodId];
                }
            });
            setTotalPrice(total);
        }
    }, [cart, dishes]);

    const handleViewCart = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {totalQuantity > 0 && (
                <div className="cart-popup-bar">
                    <div className="cart-container">
                        <div className="cart-left">
                            <div className="cart-icon-wrapper">
                                <i className='bx bxs-cart cart-icon'></i>
                                <span className="cart-badge">{totalQuantity}</span>
                            </div>
                            <div className="cart-info">
                                <p className="cart-items-count">
                                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                                </p>
                                <p className="cart-total-price">
                                    <i className='bx bx-rupee'></i>
                                    <span>{totalPrice.toFixed(2)}</span>
                                </p>
                            </div>
                        </div>
                        <div className="cart-right">
                            <button className="view-cart-btn" onClick={handleViewCart}>
                                <span>View Cart</span>
                                <i className='bx bx-right-arrow-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <CartModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}