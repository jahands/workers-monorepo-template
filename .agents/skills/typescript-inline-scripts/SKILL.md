---
name: typescript-inline-scripts
description: Guide for running inline TypeScript scripts with Bun
---

## TypeScript Inline Scripts with Bun

### IMPORTANT

- ALWAYS assume Bun runtime with modern TypeScript features
- Imported npm packages will be automatically installed by Bun
- ALWAYS prefer Bun APIs where possible

### Example

```bash
bun run --install=fallback - < <(cat <<'EOF'
import { z } from 'zod'

console.log(z.coerce.number().parse('5'))
EOF
)
```

## Bun APIs Reference

### Core Runtime APIs

- `Bun.spawn()` - Process spawning and management
- `Bun.file()` - File system operations and reading
- `Bun.write()` - File writing operations
- `fetch()` - HTTP requests (Web API standard)
- `Bun.preconnect()` - URL preconnection for performance

### File System

- `Bun.file(path)` - Create file handle for reading/writing
- `await Bun.file(path).text()` - Read file as text
- `await Bun.file(path).json()` - Read file as JSON
- `await Bun.file(path).arrayBuffer()` - Read file as ArrayBuffer
- `await Bun.write(path, data)` - Write data to file

### Shell Commands

```typescript
import { $ } from 'bun'
await $`command` // Execute shell commands with template literals
const result = await $`ls -la` // Capture command output
```

### Compression

- `Bun.gzipSync()` - Synchronous gzip compression
- `Bun.gunzipSync()` - Synchronous gzip decompression
- `Bun.inflateSync()` - Synchronous deflate decompression

### SQLite

```typescript
import { Database } from 'bun:sqlite'
// Database operations and SQL execution
```

### FFI (Foreign Function Interface)

```typescript
import { dlopen, CString } from 'bun:ffi'
// Native library interaction
```

### Utilities

- `Bun.escapeHTML()` - HTML escaping
- `Bun.hash()` - Hashing functions
- `Bun.password.hash()` - Password hashing
- `Bun.password.verify()` - Password verification

### Node.js Compatibility

- Full Node.js API support via `node:` imports
- `import { createRequire } from 'node:module'`
- All standard Node.js modules available
