type token = string;
type userId = string;
export const sessions = new Map<token, userId>();
