"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureLogger = void 0;
class SecureLogger {
    static log(message, data) {
        const safeData = data ? this.sanitize(data) : '';
        console.log(`[SECURE LOG] ${message}`, safeData);
    }
    static error(message, error) {
        console.error(`[SECURE ERROR] ${message}`, error);
    }
    static sanitize(data) {
        if (typeof data !== 'object' || data === null)
            return data;
        const sanitized = Array.isArray(data) ? [] : {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                // Hash sensitive keys
                if (['privateKey', 'secret', 'seed', 'mnemonic'].includes(key)) {
                    sanitized[key] = '[REDACTED]';
                }
                else if (['address', 'wallet', 'to', 'from'].includes(key) && typeof value === 'string') {
                    // Keep first/last 4 chars for addresses
                    sanitized[key] = value.length > 10 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;
                }
                else if (typeof value === 'object') {
                    sanitized[key] = this.sanitize(value);
                }
                else {
                    sanitized[key] = value;
                }
            }
        }
        return sanitized;
    }
}
exports.SecureLogger = SecureLogger;
