export const enumKeys = <O extends object, K extends keyof O = keyof O>(obj: O): K[] => {
    return Object.keys(obj).filter((k: string) => Number.isNaN(+k)) as K[];
};

export function getEnumKeyByEnumValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
    let keys: string[] = Object.keys(myEnum).filter((x: string): boolean => myEnum[x] == enumValue);
    return keys.length > 0 ? keys[0] : null;
}
