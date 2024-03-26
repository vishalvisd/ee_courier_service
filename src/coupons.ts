import {Coupon, Coupons} from "./types.js";

const coupons: Coupons<Coupon> = {
    "OFR001": {
        "discount_percent": 10,
        "conditions": {
            "minDistance": 0,
            "maxDistance": 199,
            "minWeight": 70,
            "maxWeight": 200
        }
    },
    "OFR002": {
        "discount_percent": 7,
        "conditions": {
            "minDistance": 50,
            "maxDistance": 150,
            "minWeight": 100,
            "maxWeight": 250
        }
    },
    "OFR003": {
        "discount_percent": 5,
        "conditions": {
            "minDistance": 50,
            "maxDistance": 250,
            "minWeight": 10,
            "maxWeight": 150
        }
    }
};

export default coupons;
