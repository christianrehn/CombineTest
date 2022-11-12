export async function startPolling(
    functionToBeCalledInLoop: () => any,
    delayOrDelayCallbackInMilliseconds: number | (() => number),
    shouldStopPolling: () => boolean | Promise<boolean> = (): boolean => false
): Promise<void> {
    do {
        await functionToBeCalledInLoop()

        if (await shouldStopPolling()) {
            break
        }

        const delay: number = typeof delayOrDelayCallbackInMilliseconds === 'number' ? delayOrDelayCallbackInMilliseconds : delayOrDelayCallbackInMilliseconds()
        await new Promise(resolve => setTimeout(resolve, Math.max(0, delay)))
    } while (!await shouldStopPolling())
}
