# Import Order Standards

This project enforces a strict import order to maintain consistency and readability across the codebase.

## Configuration

The import order is enforced by ESLint using `eslint-plugin-import` with the following configuration:

```json
"import/order": [
    "error",
    {
        "groups": [
            "builtin",  // Node.js built-in modules (e.g., fs, path)
            "external", // External dependencies (e.g., react, lodash)
            "internal", // Internal project modules
            "parent",   // Parent directory imports (e.g., ../utils)
            "sibling",  // Sibling directory imports (e.g., ./Component)
            "index",    // Index file imports (e.g., ./)
            "object",   // Object imports
            "type"      // TypeScript type imports
        ]
    }
]
```

## Example

```typescript
// 1. Built-in
import path from 'path';

// 2. External
import React from 'react';
import { useNavigate } from 'react-router';

// 3. Internal
import { Button } from '~/components/Button';

// 4. Parent
import { formatDate } from '../utils/date';

// 5. Sibling
import { Header } from './Header';

// 6. Index
import { styles } from './';

// 7. Object
import log = console.log;

// 8. Type
import type { User } from '~/types/user';
```
