export function lbsToKg(weightLbs){
    return Math.round(weightLbs * 0.45359237 * 100) / 100;
}

export function kgToLbs(weightKg){
    return Math.round(weightKg * 2.2046226218 * 100) / 100;
}

// to the power of 10 so like 10000 or 100
export function verifyNumberInput(input, boundsLower, boundsHigher){
    const numInput = Number(input);

    if(Number.isNaN(numInput))
        return 0;

    if(numInput < boundsLower)
        return boundsLower;

    if(numInput === boundsHigher)
        return numInput;
    
    const boundsHigherLength = boundsHigher.toString().length - 1;
    const cleanedInput = String(numInput);
    if(cleanedInput.length > boundsHigherLength){
        const ret = cleanedInput.slice(0, boundsHigherLength);

        return ret;
    }

    return input;
}

export function roundToThousandth(value){
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
}