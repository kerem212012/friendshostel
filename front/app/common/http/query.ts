
export function buildQuery(params: Record<string, any>, prefix = ""): string {
    const parts: string[] = [];

    for (const key in params) {
        const value = params[key];
        if (value === undefined || value === null) continue;

        const queryKey = prefix ? `${prefix}[${key}]` : key;

        if (typeof value === "object" && value !== null && value !== "*") {
            parts.push(buildQuery(value, queryKey));
        } else {
            // Ручное кодирование только значений
            parts.push(`${queryKey}=${encodeURIComponent(String(value))}`);
        }
    }

    return parts.join("&");
}
