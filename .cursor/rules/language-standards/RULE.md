---
description: 'Language and communication standards for code, comments, and AI responses'
alwaysApply: true
---

# Language & Communication Standards

## Code Language Rules

- **Always use English for variable names** - All variables, functions, and identifiers must be in English
- **Always use English for code comments** - All comments in code must be written in English
- **Always use English for function names** - All function and method names must be in English
- **Always use English for type definitions** - All TypeScript interfaces, types, and enums must use English names

## Examples

### ✅ Correct - English Variables

```typescript
const userName = 'John'
const transactionAmount = 100
const isActive = true

function getUserData() {
  // Get user data from API
  return userService.getUser()
}
```

### ❌ Incorrect - Non-English Variables

```typescript
const tenNguoiDung = 'John' // Vietnamese
const montantTransaction = 100 // French
const istAktiv = true // German
```

## Comments

All comments must be in English:

```typescript
// ✅ Correct
// Calculate total amount for the transaction
const total = amount + tax

// ❌ Incorrect
// Tính tổng số tiền cho giao dịch
const total = amount + tax
```

## AI Response Language

- **AI responses must be in English only** - All AI-generated code, explanations, and responses must be in English
- **No translations** - Do not translate code, comments, or technical terms to other languages
- **English documentation** - All documentation, README files, and code explanations must be in English

## Code Review

When reviewing code:

- Reject code with non-English variable names
- Reject code with non-English comments
- Ensure all identifiers follow English naming conventions

## Exception

- **Translation files** - Files in `messages/` directory (like `en.json`, `vi.json`) are for i18n and can contain translations
- **User-facing strings** - UI text displayed to users can be translated via i18n system
