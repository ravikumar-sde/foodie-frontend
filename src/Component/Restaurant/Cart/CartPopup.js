import { useCart } from "../../../Context/cartProvider";
import './cartPopup.scss';

export default function CartPopup() {
    const { getTotalQuantity } = useCart();
    const totalQuantity = getTotalQuantity();

    return (
        <>
            {totalQuantity > 0 && <div className="cart-popup">
                <div>
                    <span>
                        <i className='bx bxs-cart cart-icon'></i>
                    </span>
                    <span className="cart-quantity">{totalQuantity}</span>
                </div>
            </div>}
        </>
    );
}