export const uploadsUrl = () => {
    return process?.env?.ADMIN_URL || ''
}

export const apiUrl = () => {
    return `${process?.env?.API_URL || ''}`
}