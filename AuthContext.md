# AuthContext.tsx

## Purpose
Provides authentication context for managing user sessions.

## Features
- **Session Persistence**: Restores user sessions from localStorage.
- **Authentication Management**: Includes `login`, `logout`, and `register`.
- **Global Accessibility**: Allows app-wide access to authentication data.

## Example
```typescript
const { user, login } = useAuth();
await login('email@example.com', 'password123');
```
