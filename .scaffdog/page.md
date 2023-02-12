---
name: 'page'
root: './src/components/page'
output: '.'
questions:
  name: 'Please enter a page name.'
---

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.page.tsx`

```typescript
import { Suspense } from 'react';
import { {{ inputs.name | pascal }} } from './{{ inputs.name | pascal }}'

export const {{ inputs.name | pascal }}Page = () => {
  return (
    <Suspense fallback={<div> loading... </div>}>
      <{{inputs.name}} />
    </Suspense>
  )
};
```

# `{{ inputs.name | pascal }}/{{ inputs.name | pascal }}.tsx`

```typescript
export type Props = React.PropsWithChildren<{}>;

export const {{ inputs.name | pascal }}: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```