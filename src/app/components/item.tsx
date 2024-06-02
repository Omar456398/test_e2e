"use client";
import { itemType } from "../types";
import styles from "./item.module.css";

export default function Item({
  item: { id, title, description, price },
  setRefreshToggle,
}: {
  item: itemType;
  setRefreshToggle: (updateFunc: (prevState: boolean) => boolean) => void;
}) {
  const handleClick = () => {
    let jsonCart = JSON.parse(localStorage.getItem("cart") || "{}");
    jsonCart[id] = (jsonCart[id] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(jsonCart));
    setRefreshToggle(prevState => !prevState)
  };
  return (
    <div className={styles.item} onClick={handleClick}>
      <div className={styles["item-desc"]}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles["item-price"]}>{String(price)}$</div>
    </div>
  );
}
