---
name: 'layouts'
root: './src/components/layouts'
output: '.'
questions:
  name: 'Please enter a element name.'
  story:
    confirm: 'Do you need a story?'
    initial: true
---

# `{{ inputs.name | camel }}/index.ts`

```typescript
export * from './{{ inputs.name | pascal }}';
```

# `{{ inputs.name | camel }}/{{ inputs.name | pascal }}.tsx`

```typescript
export type Props = React.PropsWithChildren<{}>;

export const {{ inputs.name | pascal }}: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```

# `{{ !inputs.story && '!' }}{{ inputs.name | camel }}/{{ inputs.name | pascal }}.stories.tsx`

```typescript
import { {{ inputs.name | pascal }} } from './{{ inputs.name | pascal }}';

export default { component: {{ inputs.name | pascal }} };
export const Overview = { args: {} };
```