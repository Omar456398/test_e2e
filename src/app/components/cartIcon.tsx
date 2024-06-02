'use client';
import { useEffect, useState } from "react";
import { itemType } from "../types";
import styles from "./cartIcon.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

export default function CartIcon({ data, refreshToggle }: { data: itemType[], refreshToggle: boolean }) {
  const cartInfoLocal =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("cart") || "{}"
      : "";
  const [cartInfo, setCartInfo] = useState({
    totalCount: 0,
    totalPrice: 0,
  });
  useEffect(() => {
    const cartContent = JSON.parse(cartInfoLocal) as {
      [key: string]: number;
    };
    const totalCount = Object.values(cartContent).reduce((a, b) => a + b, 0);
    const totalPrice = Object.keys(cartContent).reduce(
      (a, b) =>
        a + cartContent[b] * (data.find((item) => item.id === b)?.price || 0),
      0
    );
    setCartInfo({
      totalCount,
      totalPrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartInfoLocal]);
  return <button className={styles.cart}>
    <div>
        <p>{cartInfo.totalCount} items</p>
        <p>{cartInfo.totalPrice} $</p>
    </div>
    <div className={styles['cart-icon']}><FontAwesomeIcon icon={faShoppingCart} /></div>
  </button>
}
