import { KbrTotalLoad } from "./KbrTotalLoad";

export const NaBrTotalLoad = Object.freeze(
    KbrTotalLoad.map(dose => Math.round(dose * 0.85))
);