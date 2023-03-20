---
name: 'feature'
root: './src/feature'
output: '.'
questions:
  feature: 'Please enter a feature name.'
  name: 'Please enter a component name.'
  story:
    confirm: 'Do you need a story?'
    initial: true
---

# `{{ inputs.feature | camel }}/{{ inputs.name | camel }}/index.ts`

```typescript
export * from './{{ inputs.name | pascal }}';
```

# `{{ inputs.feature | camel }}/{{ inputs.name | camel }}/{{ inputs.name | pascal }}.tsx`

```typescript
export type Props = React.PropsWithChildren<{}>;

export const {{ inputs.name | pascal }}: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```

# `{{ inputs.feature | camel }}/{{ !inputs.story && '!' }}{{ inputs.name | camel }}/{{ inputs.name | pascal }}.stories.tsx`

```typescript
import { {{ inputs.name | pascal }} } from './{{ inputs.model | pascal }}';

export default { component: {{ inputs.name | pascal }} };
export const Overview = { args: {} };
```