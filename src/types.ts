type Coupon = {
    discount_percent: number,
    conditions: {
        "minDistance"?: number,
        "maxDistance"?: number,
        "minWeight"?: number,
        "maxWeight"?: number
    }
}

type Coupons = {
    [key: string]: Coupon
}

type PackageInfo = {
    id: string,
    weight: number,
    distance: number,
    couponCode: string,
    index: number,
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

type PricingData = {
    rate_per_km: number,
    rate_per_kg: number,
    coupons: Coupons
}

export {
    Coupon,
    Coupons,
    PricingData,
    PackageInfo,
    FleetInfo,
    ParsedUserInput,
    InquireQuestion
}