function buildURL(resource: string) {
    return `${import.meta.env.VITE_API_URL}/${resource}`
}

export {
    buildURL
}