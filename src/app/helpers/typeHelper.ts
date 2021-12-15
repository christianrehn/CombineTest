export const isArrayOfStrings = (value: any): boolean => {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

export const isNonEmptyArrayOfStrings = (value: any): boolean => {
    return Array.isArray(value) && value.length && value.every(item => typeof item === "string");
}
