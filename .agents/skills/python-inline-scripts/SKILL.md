---
name: python-inline-scripts
description: Guide for running inline Python scripts with uv
---

## Python Inline Scripts with uv

### IMPORTANT

- NEVER add stdlib modules like json, os, re, etc. to dependencies OR THE SCRIPT WILL FAIL
- ALWAYS assume Python 3.12+

### Example

```bash
uv run --no-project -q --script - < <(cat <<'EOF'
# /// script
# # ONLY add dependencies array if you need PyPi packages
# dependencies = [
#   "httpx"
# ]
# requires-python = ">=3.12"
# ///

import httpx
print(httpx.get("https://api.github.com/zen").text)
EOF
)
```
