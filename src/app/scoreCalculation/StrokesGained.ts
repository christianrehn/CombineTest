export const computeStrokesGained = (averageStrokesFromStartDistance: number, averageStrokesFromEndDistance: number): number => {
    return !!averageStrokesFromStartDistance && !!averageStrokesFromEndDistance
        ? (averageStrokesFromStartDistance - averageStrokesFromEndDistance - 1)
        : !!averageStrokesFromStartDistance && !averageStrokesFromEndDistance // out of bounds
            ? -2
            : undefined;
}
