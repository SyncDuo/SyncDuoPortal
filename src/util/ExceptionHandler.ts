export function captureAndLogOld<T>(func: () => Promise<T>): () => Promise<T | null> {
    return async function(): Promise<T | null> {
        try {
            return await func();
        } catch (e) {
            // 记录错误信息
            console.groupCollapsed('Custom Error Handler');
            console.error(`Error occurred in function ${func.name || 'anonymous'}:`, e);
            console.groupEnd();
            // 返回 null 作为错误指示，您也可以根据需要返回其他值
            return null;
        }
    };
}

export function captureAndLog<T>(func: () => Promise<T>): Promise<T | null> {
    return captureAndLogOld(func)();
}