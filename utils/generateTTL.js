const defaultTTL = 1000 * 60 * 60; // 1 hour
const TTL = process.env.TTL || defaultTTL;

const generateDatePlusTTL = () => new Date(+ (new Date()) + TTL);

module.exports = generateDatePlusTTL;