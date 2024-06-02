"use client";
import styles from "./renderer.module.css";
import { itemType } from "../../types";
import { useEffect, useState } from "react";
import { faPlus, faMinus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function PageRenderer({ data }: { data: itemType[] }) {
  const [cartInfo, setCartInfo] = useState({} as { [key: string]: number });
  const [toggle, setToggle] = useState(false);
  const route = useRouter();
  const cartInfoLocal =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("cart") || "{}"
      : "";
  useEffect(() => {
    const cartContent = JSON.parse(cartInfoLocal) as {
      [key: string]: number;
    };
    setCartInfo(cartContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartInfoLocal, toggle]);
  const updateCart = (id: string, operation: string) => {
    const cartContent = JSON.parse(cartInfoLocal) as {
      [key: string]: number;
    };
    if (operation === "add" && cartContent[id]) {
      cartContent[id] += 1;
    }
    if (operation === "sub" && cartContent[id]) {
      cartContent[id] -= 1;
    }
    if (operation === "none" && cartContent[id]) {
      cartContent[id] = 0;
    }
    if (cartContent[id] === 0) {
      delete cartContent[id];
    }
    localStorage.setItem("cart", JSON.stringify(cartContent));
    setToggle((prevState) => !prevState);
  };
  return (
    <>
      <div className={styles["header-wrapper"]}>
        <div className={styles.header}>Cart</div>
      </div>
      <div className={styles["cart-content"]}>
        {Object.keys(cartInfo).map((key) => {
          const count = cartInfo[key];
          const item = data.find((item) => item.id === key);
          if (!item) return null;
          const { title, price } = item;
          return (
            <div className={styles["cart-item"]} key={key}>
              <div className={styles["cart-item-count"]}>{count}</div>
              <div className={styles["cart-item-title"]}>
                <div>{title}</div>
                <div className={styles["cart-item-price"]}>{price} $</div>
              </div>
              <div className={styles["cart-item-options"]}>
                <div className={styles["cart-item-option"]}>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => updateCart(key, "none")}
                  />
                </div>
                <div className={styles["cart-item-option"]}>
                  <FontAwesomeIcon
                    icon={faMinus}
                    onClick={() => updateCart(key, "sub")}
                  />
                </div>
                <div className={styles["cart-item-option"]}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => updateCart(key, "add")}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {Object.keys(cartInfo).length ? (
        <div className={styles["cart-buttons"]}>
          <button onClick={() => route.push("/")}>Continue Shopping</button>
          <button
            onClick={() => {
              Boolean(alert("Purchase Successful!")) ||
                Boolean(localStorage.clear()) ||
                route.push("/");
            }}
          >
            {" "}
            Check Out
          </button>
        </div>
      ) : (
        <>
          <div className={styles["cart-empty"]}>Nothing To Show</div>
          <div className={`${styles["cart-buttons"]} ${styles["cart-buttons-empty"]}`}>
            <button onClick={() => route.push("/")}>Continue Shopping</button>
          </div>
        </>
      )}
    </>
  );
}
