export function getFileExtension(filename: string) {
    // 处理空值或非字符串输入
    if (!filename || typeof filename !== 'string') {
        return "";
    }
    // 找到最后一个点的位置
    const lastDotIndex: number = filename.lastIndexOf('.');
    // 如果没有点，或者点是第一个字符（隐藏文件），返回空字符串
    if (lastDotIndex <= 0) {
        return "";
    }
    // 返回点之后的部分（扩展名）
    return filename.substring(lastDotIndex + 1, filename.length);
}