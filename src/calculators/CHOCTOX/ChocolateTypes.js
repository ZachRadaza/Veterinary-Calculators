export const ChocolateTypes = Object.freeze({
    WHITE: 'White Chocolate',
    MILK: 'Milk Chocolate',
    DARK: 'Dark, Sweet Chocolate',
    SEMISWEET: 'Semi-Sweet Chocolate',
    COCOA60: '60% Cocoa',
    COCOA72: '72% Cocoa',
    COCOA86: '86% Cocoa',
    COCOAOTHER: 'Other Cocoa Content (%)',
    BAKER: 'Baker (unsweetened) Chocolate',
    POWDERDRY: 'Dry Cocoa Powder',
});

export const ChocolateMethylxanthineMgG = Object.freeze({
    [ChocolateTypes.WHITE]: 0.04,
    [ChocolateTypes.MILK]: 2.3,
    [ChocolateTypes.DARK]: 5.6,
    [ChocolateTypes.SEMISWEET]: 5.6,
    [ChocolateTypes.COCOA60]: 15.5 * 0.60,
    [ChocolateTypes.COCOA72]: 15.5 * 0.72,
    [ChocolateTypes.COCOA86]: 15.5 * 0.86,
    [ChocolateTypes.BAKER]: 15.5,
    [ChocolateTypes.POWDERDRY]: 28.5,
});