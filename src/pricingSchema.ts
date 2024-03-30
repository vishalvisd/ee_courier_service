import Ajv from "ajv";

const pricingSchema = {
    type: "object",
    properties: {
        "rate_per_km": {type: "integer", minimum: 0},
        "rate_per_kg": {type: "integer", minimum: 0},
        "coupons": {
            type: "object",
            minProperties: 1,
            patternProperties: {
                "^.*$": {
                    type: "object",
                    properties: {
                        "discount_percent": {type: "integer", minimum: 0},
                        "conditions": {
                            type: "object",
                            "anyOf": [{
                                properties: {
                                    "minDistance": {type: "integer", minimum: 0},
                                    "maxDistance": {type: "integer", minimum: 0},
                                    "minWeight": {type: "integer", minimum: 0},
                                    "maxWeight": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "minDistance": {type: "integer", minimum: 0},
                                    "maxDistance": {type: "integer", minimum: 0},
                                }
                            }, {
                                properties: {
                                    "minWeight": {type: "integer", minimum: 0},
                                    "maxWeight": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "minDistance": {type: "integer", minimum: 0},
                                    "minWeight": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "minDistance": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "minWeight": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "maxDistance": {type: "integer", minimum: 0},
                                    "maxWeight": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "maxDistance": {type: "integer", minimum: 0}
                                }
                            }, {
                                properties: {
                                    "maxWeight": {type: "integer", minimum: 0}
                                }
                            }],

                        }
                    },
                    required: ["discount_percent"]
                }
            }
        }
    },
    required: ["rate_per_km", "rate_per_kg"]
}

//@ts-ignore
export const ajv = new Ajv();
export default pricingSchema;
