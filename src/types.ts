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

type FleetInfo = {
    num: number,
    speed: number,
    maxWeight: number,
}

type ParsedUserInput = {
    baseDeliveryCost: number,
    packages: Array<PackageInfo>,
    fleetInfo: FleetInfo | null
}

type InquireQuestion = {
    type: "list" | "input" | "editor"
    name: string,
    message: string,
    choices?: Array<String>
}

export {
    Coupon,
    Coupons,
    PackageInfo,
    FleetInfo,
    ParsedUserInput,
    InquireQuestion
}