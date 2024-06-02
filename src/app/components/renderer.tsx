"use client";
import styles from "./renderer.module.css";
import { itemType } from "../types";
import { useEffect, useState } from "react";
import Item from "./item";
import CartIcon from "./cartIcon";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
        </div>
      </div>
      {data.slice(startElement, startElement + 20).map((item) => (
        <div className={styles.item} key={item.id}>
          <Item item={item} setRefreshToggle={setRefreshToggle} />
        </div>
      ))}
      <div>
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
              p: String(Math.min(pageNum + 1, Math.ceil(data.length / 20))),
            })
          }
        >{`>`}</div>
      </div>
    </>
  );
}
