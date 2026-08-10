export const RecoveryDietOptions = Object.freeze({
    HILLSPRES: "Hill's Prescription Diet a/d canine/feline canned",
    CLINICARE: 'Clinicare',
    CLINICARERF: 'Clinicare RF',
    ROYAL: 'Royal Canin Veterinary Diet Recovery canine/feline canned',
    PURINA: 'Purina ProPlan Veterinary Diet CN canine/feline canned',
    OTHER: 'Other product'
});

export const RecoveryDietDensity = Object.freeze({
    // 183 kcal / 156 g
    [RecoveryDietOptions.HILLSPRES]: 1.17,

    // Ready-to-use liquid diets
    [RecoveryDietOptions.CLINICARE]: 1.00,
    [RecoveryDietOptions.CLINICARERF]: 1.00,

    // 1025 kcal/kg
    [RecoveryDietOptions.ROYAL]: 1.025,

    // 1325 kcal/kg
    [RecoveryDietOptions.PURINA]: 1.325,

    // User enters density
    [RecoveryDietOptions.OTHER]: null
});