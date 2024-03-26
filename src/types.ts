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

type PackageInfo = {
    id: string,
    weight: number,
    distance: number,
    couponCode: string,
    index: number
    discount?: number,
    deliveryCost?: number,
    deliveryTime?: number
}

export {
    Coupon,
    Coupons,
    PackageInfo
}