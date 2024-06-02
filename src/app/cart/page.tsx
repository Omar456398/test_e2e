import { itemType } from "../types";
import fs from "fs";
import path from "path";
import { cache } from "react";
import PageRenderer from "./components/renderer";

export const getData = cache((async () => {
  const filePath = path.join(process.cwd(), "src", "app", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  return data.items
}) as () => Promise<itemType[]>);

export const metadata = {
    title: "Shopping Cart"
  }

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const pageNum = Number(searchParams.p) || 1
  const startElement = Math.max(Number(pageNum) - 1, 0) * 20
  const data = await getData()
  return (
    <PageRenderer data={data} />
  );
}
