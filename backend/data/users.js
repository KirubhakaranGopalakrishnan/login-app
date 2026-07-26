// Mock "database" — a hardcoded array instead of a real DB, per the brief.
// In a real app, passwords would never be stored in plain text like this;
// they'd be hashed (e.g. bcrypt) before ever touching storage.
export const users = [
  { name: 'Dev', email: 'kirubha@gk.app', password: 'Gk@123' },
  { name: 'Deva', email: 'dev@gk.app', password: 'Gk@123' },
]
  