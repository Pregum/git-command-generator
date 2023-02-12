---
name: 'model'
root: './src/components/model'
output: '.'
questions:
  model: 'Please enter a model name.'
  name: 'Please enter a component name.'
  story:
    confirm: 'Do you need a story?'
    initial: true
---

# `{{ inputs.model | camel }}/{{ inputs.model | pascal }}{{ inputs.name | pascal }}/index.ts`

```typescript
export * from './{{ inputs.model | pascal }}{{ inputs.name | pascal }}';
```

# `{{ inputs.model }}/{{ inputs.model | pascal }}{{ inputs.name | pascal }}/{{ inputs.model | pascal }}{{ inputs.name | pascal }}.tsx`

```typescript
export type Props = React.PropsWithChildren<{}>;

export const {{ inputs.model | pascal }}{{ inputs.name | pascal }}: React.FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};
```

# `{{ inputs.model }}/{{ !inputs.story && '!' }}{{ inputs.model | pascal }}{{ inputs.name | pascal }}/{{ inputs.model | pascal }}{{ inputs.name | pascal }}.stories.tsx`

```typescript
import { {{ inputs.model | pascal }}{{ inputs.name | pascal }} } from './{{ inputs.model | pascal }}{{ inputs.name | pascal }}';

export default { component: {{ inputs.model | pascal }}{{ inputs.name | pascal }} };
export const Overview = { args: {} };
```