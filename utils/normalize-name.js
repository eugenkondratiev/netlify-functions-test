module.exports = (name) => {
    return name
    .replace(/\./gi, "_")
    .replace(/&#180;/gi, "`")
    .toLowerCase()
}