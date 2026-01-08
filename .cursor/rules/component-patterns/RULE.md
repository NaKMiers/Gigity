---
description: 'Standards for React Native component structure, props, and patterns'
globs: ['src/components/**/*.tsx', 'src/app/**/*.tsx']
alwaysApply: false
---

# Component Patterns & Structure

## Component Structure

When creating React Native components, follow this structure:

1. **Component Definition**:

   ```tsx
   interface ComponentProps extends ViewProps {
      className?: string,
      ...props
   }

   function ComponentName({
     className,
     ...props
   }: ComponentProps) {
     return (
       <View className={cn('base-styles', className)} {...props}>
         {/* Component content */}
       </View>
     )
   }

   export default memo(ComponentName)
   ```

## Component Rules

- **Always use functional components** - No class components
- **Always use declaration functions** - Use `function ComponentName()` not arrow functions
- **Use `memo()` for exported components** - Wrap with `React.memo()` for performance
- **Extend native props** - Use `ViewProps`, `TextProps`, `TouchableOpacityProps`, etc. when appropriate
- **Always include `className` prop** - For styling flexibility
- **Use `cn()` utility** - Always use `cn()` from `@/lib/utils` for className merging
- **Default export** - Components should use default export
- **Named interfaces** - Props interfaces should be named `ComponentNameProps`

## Component Naming

- **PascalCase** for component names: `TransactionItem`, `BudgetCard`
- **PascalCase** for file names matching component: `TransactionItem.tsx`
- **Descriptive names** - Use clear, descriptive names that indicate purpose

## Props Patterns

- **Required props first** - List required props before optional ones
- **Default values** - Use default parameters for optional props
- **Spread props** - Use `...props` to pass through native component props
- **Type safety** - Always define TypeScript interfaces for props

## Example Component

```tsx
import { cn } from '@/lib/utils'
import React, { memo } from 'react'
import { View, ViewProps } from 'react-native'
import Text from './Text'

interface CardProps extends ViewProps {
  title: string
  subtitle?: string
  className?: string
}

function Card({ title, subtitle, className, ...props }: CardProps) {
  return (
    <View
      className={cn('bg-primary rounded-xl p-4', className)}
      {...props}
    >
      <Text className="text-lg font-semibold">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-600">{subtitle}</Text>}
    </View>
  )
}

export default memo(Card)
```

## Screen Components

For screen components in `src/app/`:

- Use descriptive function names ending with `Screen`: `HomeScreen`, `SettingsScreen`
- Export as default
- Use `SafeAreaView` from `react-native-safe-area-context` when needed
- Import and use layout components when appropriate

## Import Ordering

Organize imports in this exact order:

1. External libraries (React, React Native, third-party)
2. Internal utilities (`@/lib/utils`, `@/lib/string`)
3. Internal components (`@/components/...`)
4. Internal constants (`@/constants/...`)
5. Internal hooks (`@/hooks/...`)
6. Internal services (`@/realm/services`, `@/services/...`)
7. Internal storage (`@/storage/...`)
8. Types (if needed separately)

```tsx
// 1. External
import React, { memo, useCallback, useState } from 'react'
import { View, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

// 2. Internal utilities
import { cn } from '@/lib/utils'

// 3. Internal components
import Text from '@/components/common/Text'

// 4. Internal constants
import { COLORS } from '@/constants/styles'

// 5. Internal hooks
import useLanguage from '@/hooks/useLanguage'

// 6. Internal services
import { useTransactionService } from '@/realm/services'
```

## Component with Hooks

When using hooks in components, organize them in this order:

```tsx
function ComponentWithHooks({ prop1 }: Props) {
  // 1. Hooks
  const { t } = useTranslation()
  const service = useTransactionService()

  // 2. States - Always define types
  const [state, setState] = useState<StateType>(initialValue)
  const [count, setCount] = useState<number>(0)
  const [items, setItems] = useState<Item[]>([])

  // 3. Refs - Always define types
  const inputRef = useRef<TextInput>(null)
  const viewRef = useRef<View>(null)

  // 4. Values
  const memoized = useMemo(() => compute(), [deps])

  // 5. Callbacks
  const handleAction = useCallback(() => {
    // Action
  }, [deps])

  // 6. Effects
  useEffect(() => {
    // Side effect
  }, [deps])

  // 7. Render
  return <View />
}
```

**Type Safety Rules:**

- **Always define types for `useState`** - Use explicit generic: `useState<Type>(initialValue)`
- **Always define types for `useRef`** - Use explicit generic: `useRef<ElementType>(null)`
- Never use `useState()` or `useRef()` without type parameters

## Event Handlers

- Use `handle` prefix: `handlePress`, `handleChange`, `handleSubmit`
- Use `useCallback` for handlers passed as props
- Extract complex logic to separate functions

```tsx
const handlePress = useCallback(() => {
  // Handler logic
}, [dependencies])

const handleLongPress = useCallback(() => {
  // Long press logic
}, [dependencies])
```

## Conditional Rendering

- Use ternary for simple conditions: `{condition ? <A /> : <B />}`
- Use `&&` for optional rendering: `{condition && <Component />}`
- Extract complex conditions to variables

```tsx
const hasContent = items.length > 0
const isLoading = status === 'loading'

return (
  <View>
    {isLoading && <ActivityIndicator />}
    {hasContent ? <List items={items} /> : <EmptyState />}
  </View>
)
```

## Error Handling

- Handle errors gracefully in components
- Show user-friendly error messages
- Use try-catch for async operations

```tsx
const [error, setError] = useState<string | null>(null)

const handleAction = useCallback(async () => {
  try {
    setError(null)
    await asyncOperation()
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Operation failed')
  }
}, [])
```

## Performance Tips

- Use `memo()` for components that receive stable props
- Use `useMemo` for expensive computations
- Use `useCallback` for functions passed to child components
- Avoid creating objects/arrays in render (use `useMemo`)
