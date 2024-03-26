type Coupon = {
    discount_percent: number,
    conditions: {
        "minDistance": number,
        "maxDistance": number,
        "minWeight": number,
        "maxWeight": number
    }
}

type Coupons <Coupon> = {
    [key: string]: Coupon
}

export {
    Coupon,
    Coupons
}