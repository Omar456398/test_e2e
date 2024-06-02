"use client";
import styles from "./renderer.module.css";
import { SortByEnum, itemType } from "../types";
import { useEffect, useMemo, useState } from "react";
import Item from "./item";
import CartIcon from "./cartIcon";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchBar from "./searchBar";

export default function PageRenderer({
  data,
  pageNum,
  startElement,
}: {
  data: itemType[];
  pageNum: number;
  startElement: number;
}) {
  const route = useRouter();
  const pathName = usePathname();
  const query = useSearchParams();
  const dataFiltered = useMemo(
    () =>
      data
        .filter(
          (item) =>
            `${item.title} ${item.description}`.includes(
              query.get("q") || ""
            ) &&
            item.price >= (Number(query.get("min")) || 0) &&
            item.price <= (Number(query.get("max")) || Infinity)
        )
        .sort((a, b) =>
          Number(query.get("sort")) === SortByEnum.none
            ? Number(a.id) - Number(b.id)
            : Number(query.get("sort")) === SortByEnum.price
            ? a.price - b.price
            : a.title > b.title
            ? 1
            : -1
        ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.get("q"), query.get("sort"), query.get("min"), query.get("max")]
  );
  const updateQueryString = (newQueryParams: { [key: string]: string }) => {
    const url = new URL(window.location.href);
    Object.keys(newQueryParams).forEach((key) => {
      url.searchParams.set(key, newQueryParams[key]);
    });
    route.push(url.toString(), { scroll: false });
  };
  const correctQueryString = () => {
    const url = new URL(window.location.href);
    url.searchParams.set(
      "p",
      String(Math.max(1, Math.min(Math.ceil(data.length / 20), pageNum)))
    );
    route.replace(url.toString(), { scroll: false });
  };

  const [refreshToggle, setRefreshToggle] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => correctQueryString(), []);
  return (
    <>
      <div className={styles["header-wrapper"]}>
        <div className={styles.header}>
          Items List
          <div className={styles.cart}>
            <CartIcon data={data} refreshToggle={refreshToggle} />
          </div>
          <div className={styles.spacing} />
          <SearchBar data={data} updateQueryString={updateQueryString} />
        </div>
      </div>
      {dataFiltered.slice(startElement, startElement + 20).map((item) => (
        <div className={styles.item} key={item.id}>
          <Item item={item} setRefreshToggle={setRefreshToggle} />
        </div>
      ))}
      {dataFiltered.length ? <div>
        <div
          className={styles.prev}
          onClick={() =>
            updateQueryString({ p: String(Math.max(pageNum - 1, 1)) })
          }
        >{`<`}</div>
        <div
          className={styles.next}
          onClick={() =>
            updateQueryString({
              p: String(Math.min(pageNum + 1, Math.ceil(dataFiltered.length / 20))),
            })
          }
        >{`>`}</div>
      </div>: null}
    </>
  );
}
