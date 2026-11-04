"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapResponse = unwrapResponse;
exports.paginatedResponse = paginatedResponse;
exports.generateNumeroTicket = generateNumeroTicket;
function unwrapResponse(data) {
    return { data };
}
function paginatedResponse(items, total, page, perPage) {
    return {
        data: {
            data: items,
            total,
            last_page: Math.ceil(total / perPage),
            current_page: page,
            per_page: perPage,
        },
    };
}
function generateNumeroTicket() {
    const now = new Date();
    const prefix = `TK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `${prefix}-${random}`;
}
//# sourceMappingURL=helpers.js.map