export function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getAge(dateOfBirth) {
    if(!dateOfBirth)
        return null;

    // Prevent "YYYY-MM-DD" strings from being interpreted as UTC.
    const birthDate = typeof dateOfBirth === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
            ? new Date(...dateOfBirth.split('-').map((value, index) =>
                index === 1 ? Number(value) - 1 : Number(value)
            ))
            : new Date(dateOfBirth);

    if(Number.isNaN(birthDate.getTime()))
        return null;

    const today = new Date();
    birthDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if(birthDate > today)
        return null;

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if(months < 0){
        years--;
        months += 12;
    }

    return `${years} Years ${months} Months`;
}