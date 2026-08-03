export function lbsToKg(weightLbs){
    return Math.round(weightLbs * 0.45359237 * 100) / 100;
}

export function kgToLbs(weightKg){
    return Math.round(weightKg * 2.2046226218 * 100) / 100;
}

export function verifyNumberInput(input, boundsLower, boundsHigher){
    const numInput = Number(input);

    if(Number.isNaN(numInput))
        return 0;

    if(numInput < boundsLower)
        return boundsLower;

    if(input > boundsHigher)
        return boundsHigher;

    return input;
}

export function roundToThousandth(value){
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
}