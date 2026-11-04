export function unwrapResponse<T>(data: T) {
  return { data };
}

export function paginatedResponse<T>(items: T[], total: number, page: number, perPage: number) {
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

export function generateNumeroTicket(): string {
  const now = new Date();
  const prefix = `TK-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `${prefix}-${random}`;
}
