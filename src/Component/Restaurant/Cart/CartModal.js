import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../Context/cartProvider';
import { fetchData } from '../../../Utilities/api';
import './cartModal.scss';

export default function CartModal({ isOpen, onClose }) {
    const { cart, addToCart, removeFromCart } = useCart();
    const { id } = useParams();
    const [dishes, setDishes] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [address, setAddress] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {
        if (isOpen) {
            (async () => {
                const dishList = await fetchData(`/restaurants/${id}/dishes`);
                const { brand } = await fetchData(`/restaurants/${id}`);
                dishList?.dishes && setDishes([...dishList.dishes]);
                setRestaurant(brand);
            })();
        }
        //eslint-disable-next-line 
    }, [id, isOpen]);

    const cartItems = dishes.filter(dish => cart[dish._id]);
    
    const subtotal = cartItems.reduce((total, dish) => {
        return total + (dish.price * cart[dish._id]);
    }, 0);

    const deliveryFee = subtotal > 0 ? 40 : 0;
    const gst = subtotal * 0.05; // 5% GST
    const platformFee = subtotal > 0 ? 5 : 0;
    
    let discount = 0;
    if (appliedCoupon) {
        discount = subtotal * (appliedCoupon.discount / 100);
    }

    const total = subtotal + deliveryFee + gst + platformFee - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE10') {
            setAppliedCoupon({ code: 'SAVE10', discount: 10 });
        } else if (couponCode.toUpperCase() === 'SAVE20') {
            setAppliedCoupon({ code: 'SAVE20', discount: 20 });
        } else {
            alert('Invalid coupon code');
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
    };

    const handleCheckout = () => {
        if (!address.trim()) {
            alert('Please enter delivery address');
            return;
        }
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        alert('Order placed successfully!');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="cart-modal-overlay" onClick={onClose}></div>
            <div className="cart-modal">
                <div className="cart-modal-header">
                    <div className="header-content">
                        <h1>Your Cart</h1>
                        {restaurant && <p className="restaurant-name">{restaurant.name}</p>}
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="cart-modal-content">
                    <div className="cart-left-section">
                        {/* Delivery Address */}
                        <div className="cart-section address-section">
                            <div className="section-header">
                                <i className='bx bx-map'></i>
                                <h2>Delivery Address</h2>
                            </div>
                            <textarea
                                className="address-input"
                                placeholder="Enter your complete delivery address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                            />
                        </div>

                        {/* Cart Items */}
                        <div className="cart-section items-section">
                            <div className="section-header">
                                <i className='bx bx-food-menu'></i>
                                <h2>Order Items ({cartItems.length})</h2>
                            </div>
                            <div className="cart-items-list">
                                {cartItems.map(dish => (
                                    <div key={dish._id} className="cart-item">
                                        <div className="item-image">
                                            <img src={dish.image} alt={dish.name} />
                                        </div>
                                        <div className="item-details">
                                            <h3>{dish.name}</h3>
                                            <p className="item-price">
                                                <i className='bx bx-rupee'></i>
                                                <span>{dish.price}</span>
                                            </p>
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => removeFromCart(dish._id)}>-</button>
                                            <span>{cart[dish._id]}</span>
                                            <button onClick={() => addToCart(dish._id)}>+</button>
                                        </div>
                                        <div className="item-total">
                                            <i className='bx bx-rupee'></i>
                                            <span>{(dish.price * cart[dish._id]).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cart-right-section">
                        {/* Apply Coupon */}
                        <div className="cart-section coupon-section">
                            <div className="section-header">
                                <i className='bx bx-purchase-tag'></i>
                                <h2>Apply Coupon</h2>
                            </div>
                            {!appliedCoupon ? (
                                <div className="coupon-input-wrapper">
                                    <input
                                        type="text"
                                        className="coupon-input"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    />
                                    <button className="apply-coupon-btn" onClick={handleApplyCoupon}>
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className="applied-coupon">
                                    <div className="coupon-info">
                                        <i className='bx bx-check-circle'></i>
                                        <span>{appliedCoupon.code} applied ({appliedCoupon.discount}% off)</span>
                                    </div>
                                    <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                                        <i className='bx bx-x'></i>
                                    </button>
                                </div>
                            )}
                            <div className="coupon-suggestions">
                                <p className="suggestions-title">Available Coupons:</p>
                                <div className="coupon-chip" onClick={() => setCouponCode('SAVE10')}>
                                    <i className='bx bx-purchase-tag-alt'></i>
                                    <span>SAVE10 - Get 10% off</span>
                                </div>
                                <div className="coupon-chip" onClick={() => setCouponCode('SAVE20')}>
                                    <i className='bx bx-purchase-tag-alt'></i>
                                    <span>SAVE20 - Get 20% off</span>
                                </div>
                            </div>
                        </div>

                        {/* Bill Details */}
                        <div className="cart-section bill-section">
                            <div className="section-header">
                                <i className='bx bx-receipt'></i>
                                <h2>Bill Details</h2>
                            </div>
                            <div className="bill-details">
                                <div className="bill-row">
                                    <span>Item Total</span>
                                    <span className="bill-value">
                                        <i className='bx bx-rupee'></i>
                                        {subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="bill-row">
                                    <span>Delivery Fee</span>
                                    <span className="bill-value">
                                        <i className='bx bx-rupee'></i>
                                        {deliveryFee.toFixed(2)}
                                    </span>
                                </div>
                                <div className="bill-row">
                                    <span>Platform Fee</span>
                                    <span className="bill-value">
                                        <i className='bx bx-rupee'></i>
                                        {platformFee.toFixed(2)}
                                    </span>
                                </div>
                                <div className="bill-row">
                                    <span>GST (5%)</span>
                                    <span className="bill-value">
                                        <i className='bx bx-rupee'></i>
                                        {gst.toFixed(2)}
                                    </span>
                                </div>
                                {appliedCoupon && (
                                    <div className="bill-row discount-row">
                                        <span>Discount ({appliedCoupon.discount}%)</span>
                                        <span className="bill-value discount-value">
                                            - <i className='bx bx-rupee'></i>
                                            {discount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                <div className="bill-divider"></div>
                                <div className="bill-row total-row">
                                    <span>To Pay</span>
                                    <span className="bill-value total-value">
                                        <i className='bx bx-rupee'></i>
                                        {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button className="checkout-btn" onClick={handleCheckout}>
                            <span>Proceed to Checkout</span>
                            <i className='bx bx-right-arrow-alt'></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
