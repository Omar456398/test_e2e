export type itemType = {
    id: string,
    title: string,
    description: string,
    price: number
}

export enum SortByEnum {
    none = 0,
    price = 1,
    name = 2
}