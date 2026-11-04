export declare function unwrapResponse<T>(data: T): {
    data: T;
};
export declare function paginatedResponse<T>(items: T[], total: number, page: number, perPage: number): {
    data: {
        data: T[];
        total: number;
        last_page: number;
        current_page: number;
        per_page: number;
    };
};
export declare function generateNumeroTicket(): string;
