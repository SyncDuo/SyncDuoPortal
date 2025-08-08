export function formatTimestamp(timestamp: string): string {
    // format to xx second/minutes/hour ago
    if (!timestamp) {
        return '';
    }
    const dotIndex = timestamp.lastIndexOf(".");
    if (dotIndex < 0) {
        return timestamp;
    }
    const dateString = timestamp.substring(0, dotIndex);
    // 解析日期字符串（本地时间）
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    // 验证日期有效性
    const pastDate = new Date(year, month - 1, day, hours, minutes, seconds);
    if (isNaN(pastDate.getTime())) {
        return "invalid date";
    }
    // 计算与当前时间差值
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
    // 处理未来时间
    if (diffSeconds < 0) {
        const absSeconds = Math.abs(diffSeconds);
        if (absSeconds < 60) return `in ${absSeconds} seconds`;
        return "in the future";
    }
    // 时间单位定义（秒为单位）
    const units: [string, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60]
    ];
    // 查找最匹配的时间单位
    for (const [unit, secondsInUnit] of units) {
        const count = Math.floor(diffSeconds / secondsInUnit);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
        }
    }
    // 处理几秒钟前的情况
    return diffSeconds < 10 ? "just now" : `${diffSeconds} seconds ago`;
}