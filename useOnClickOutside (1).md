# useOnClickOutside.ts

## Purpose
Provides a custom React hook to detect clicks outside a specified element.

## Features
- **Event Handling**: Attaches a `mousedown` or `touchstart` listener to the document.
- **Callback Execution**: Executes a callback when a click is detected outside the referenced element.

## Example
```typescript
useOnClickOutside(ref, () => setIsOpen(false));
```
