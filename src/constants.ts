import path from "node:path";

export const DEFAULT_RATE_PER_KG: number = 10;
export const DEFAULT_RATE_PER_KM: number = 5;
export const DEFAULT_PRICING_FILE_PATH = path.join(process.cwd(), 'pricing.json');
export const PRICING_FILE_PATH_ENVIRONMENT_VARIABLE = "PRICING_FILE";
export const NOT_AVAILABLE = 'N/A';