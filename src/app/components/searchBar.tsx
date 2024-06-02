"use client";
import { useMemo, useState, useEffect } from "react";
import { SortByEnum, itemType } from "../types";
import styles from "./searchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({
  data,
  updateQueryString,
}: {
  data: itemType[];
  updateQueryString: (input: { [key: string]: string }) => void;
}) {
  const minPrice = useMemo(
    () => Math.min(...data.map((item) => item.price)),
    [data]
  );
  const maxPrice = useMemo(
    () => Math.max(...data.map((item) => item.price)),
    [data]
  );
  const [searchString, setSearchString] = useState("");
  const [sortBy, setSortBy] = useState(SortByEnum.none);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [toggleInit, setToggleInit] = useState(false);
  useEffect(() => {
    if (toggleInit) {
      updateQueryString({
        q: searchString,
        sort: String(sortBy),
        min: String(priceRange[0]),
        max: String(priceRange[1]),
        p: '1'
      });
    } else {
      setToggleInit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange, sortBy, searchString]);
  return (
    <div className={styles["search-panel"]}>
      <div className={styles["search-bar-container"]}>
        <input
          className={styles["search-bar"]}
          value={searchString}
          placeholder="Enter search string here ..."
          onChange={({ target: { value } }) => setSearchString(value)}
        />
      </div>
      <div className={`${styles.spacer} ${styles["hidden-on-small"]}`} />
      <div className={styles["others-container"]}>
        <input
          type="number"
          className={styles["price-min"]}
          value={priceRange[0]}
          onChange={({ target: { value } }) =>
            setPriceRange((prevState) => [Number(value) || 0, prevState[1]])
          }
          onBlur={() =>
            setPriceRange((prevState) => [
              Math.max(
                minPrice,
                Math.min(maxPrice, prevState[1], prevState[0])
              ),
              prevState[1],
            ])
          }
        />
        <div style={{ fontSize: "0.9em" }}>&nbsp;→&nbsp;</div>
        <input
          type="number"
          className={styles["price-max"]}
          value={priceRange[1]}
          onChange={({ target: { value } }) =>
            setPriceRange((prevState) => [prevState[0], Number(value) || 0])
          }
          onBlur={() =>
            setPriceRange((prevState) => [
              prevState[0],
              Math.min(
                maxPrice,
                Math.max(minPrice, prevState[0], prevState[1])
              ),
            ])
          }
        />
        <div className={styles.spacer} />
        <select
          className={styles["sort-by"]}
          value={sortBy}
          onChange={({ target: { value } }) => {
            setSortBy(Number(value));
          }}
        >
          <option value={SortByEnum.none}>Default Sorting</option>
          <option value={SortByEnum.price}>By Price</option>
          <option value={SortByEnum.name}>Alphabetical</option>
        </select>
      </div>
    </div>
  );
}
