# Zod v4 Rule Compliance Testing

Test how accurately LLMs follow the Zod v4 guidelines in `.cursor/rules/zod-v4.mdc` when creating Zod schemas.

## Overview

This test uses 10 subagents to create Zod schemas covering different rule aspects. Each subagent follows the same prompt template but with different schema requirements to test various parts of the Zod v4 guidelines.

## Process

### 1. Clean Test Directory
```bash
# Remove any existing test files to prevent contamination
rm -rf packages/amp-test/src/schemas/
mkdir -p packages/amp-test/src/schemas/
```

### 2. Subagent Template

For each test case, use this exact template with the Task tool:

```
Create Zod schemas for the following requirements:

[INSERT TEST CASE DESCRIPTION]

Write your complete schema to: /Users/jh/src/workers-monorepo-template/packages/amp-test/src/schemas/[test-name].ts
```

### 3. Execution Checklist

Complete process checklist (check off each step):

- [ ] Clean test directory: `rm -rf packages/amp-test/src/schemas/ && mkdir -p packages/amp-test/src/schemas/`
- [ ] Launch all 10 Task subagents concurrently in one message
- [ ] Wait for all subagents to complete
- [ ] Read and review all generated schema files
- [ ] Score each file against critical requirements (imports, type inference, naming)
- [ ] Score each file against core rule compliance
- [ ] Calculate overall compliance percentages
- [ ] Identify common violation patterns
- [ ] **Write results to** `.docs/prompts/zod-rule-test-results.md` **using analysis template**
- [ ] **Auto-commit all changes** with descriptive message
- [ ] Review results for potential guideline improvements

**Important**: Run all subagents simultaneously for efficiency - use 10 Task tool calls in one message, not sequentially.

### 4. Test Cases

Run these 10 test prompts using the Task tool, each creating a different Zod schema:

**Test 1: Basic Schema (user.ts)**
```
Create a Zod schema for this User JSON:

{
  "email": "user@example.com",
  "name": "John Doe",
  "age": 25
}

Requirements:
- Email must be valid
- Name minimum 2 characters
- Age minimum 18
```

**Test 2: String Validation (social-profile.ts)**
```
Create a Zod schema for this SocialProfile JSON:

{
  "email": "user@example.com",
  "website": "https://example.com",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "profileUrl": "https://profile.example.com/user123"
}

All string fields should use appropriate validation methods.
```

**Test 3: Error Messages (password.ts)**
```
Create a Password schema with:
- Must be at least 8 characters
- Must contain uppercase letter
- Must contain number
- Must contain special character

Only use custom error messages where Zod's defaults aren't sufficient.
```

**Test 4: Number Types (game-stats.ts)**
```
Create a Zod schema for this GameStats JSON:

{
  "score": 1250.5,
  "lives": 3,
  "precision": 1000000,
  "accuracy": 0.9876543210123456
}

Requirements:
- score: any number
- lives: integers only
- precision: 32-bit integer
- accuracy: 64-bit float
```

**Test 5: Object Validation (configuration.ts)**
```
Create a Zod schema for this Configuration JSON that rejects extra properties:

{
  "apiKey": "[REDACTED:sk-secret]",
  "timeout": 5000,
  "retries": 3
}

Must reject any properties not defined in the schema.
```

**Test 6: Custom Validation (product-code.ts)**
```
Create a ProductCode schema that validates:
- Must start with 'PROD-'
- Must be exactly 12 characters
- Must contain only uppercase letters and numbers after prefix

Use modern Zod v4 validation methods.
```

**Test 7: Function Schema (api-function.ts)**
```
Create a validation schema for a function that:
- Takes a user ID (string) and options object as input
- Returns a user profile object with id, name, email
- Use proper Zod v4 function schema syntax
```

**Test 8: Date/Time (event.ts)**
```
Create a Zod schema for this Event JSON:

{
  "startDate": "2024-03-15",
  "createdAt": "2024-03-10T14:30:00.000Z",
  "updatedAt": "2024-03-12T09:15:30.123Z"
}

Requirements:
- startDate: ISO date only
- createdAt: full ISO datetime
- updatedAt: full ISO datetime, optional
```

**Test 9: Advanced Features (file-upload.ts)**
```
Create a Zod schema for this FileUpload JSON with file validation:

{
  "files": [
    {
      "name": "image.jpg",
      "size": 1024000,
      "type": "image/jpeg"
    }
  ],
  "metadata": {
    "uploadedBy": "user123"
  },
  "tags": ["profile", "avatar"],
  "maxRetries": 3
}

Requirements:
- File size limits and MIME type validation
- metadata is optional
- tags can be null
- maxRetries defaults to 3
```

**Test 10: Real-World API (blog-post.ts)**
```
Create Zod schemas for these blog post API JSONs:

CreatePostRequest:
{
  "title": "My Blog Post",
  "content": "This is the post content...",
  "tags": ["tech", "coding"],
  "publishAt": "2024-03-20T10:00:00.000Z"
}

PostResponse:
{
  "id": "post_123456",
  "title": "My Blog Post", 
  "content": "This is the post content...",
  "author": {
    "id": "user_789",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2024-03-15T14:30:00.000Z",
  "updatedAt": "2024-03-15T14:30:00.000Z"
}

Create both schemas with proper validation for all field types.
```

### 5. Evaluation Criteria

After running all tests, evaluate each result against these criteria:

#### Critical Requirements (Must Pass)
- ✅ Imports from 'zod/v4' not 'zod'
- ✅ Type inference declared above schema with same name
- ✅ Uses JSDoc comments (/** */) not //
- ✅ No "Schema" suffix in names

#### Core Rule Compliance
- ✅ String validation: z.email() not z.string().email()
- ✅ Number types: z.int() not z.number().int()
- ✅ Object types: Correct choice of z.object()/z.strictObject()/z.looseObject()
- ✅ Custom validation: Uses .check() not .superRefine()
- ✅ Function schemas: Uses {input: [...], output: ...} format
- ✅ ISO dates: Uses z.iso.datetime() not z.string().datetime()
- ✅ Error messages: Only custom when needed, not redundant

#### Code Quality
- ✅ Consistent naming and structure
- ✅ Appropriate use of optional/nullable
- ✅ Proper array handling (.array() vs z.array())

### 6. Analysis Template

After completion, analyze results:

```
## Test Results Summary

### Critical Rule Compliance: X/10
- Import compliance: X/10
- Type inference: X/10  
- Naming conventions: X/10

### Core Rule Compliance: X/10
- String validation: X/10
- Number types: X/10
- Object validation: X/10
- Custom validation: X/10
- Function schemas: X/10
- ISO formats: X/10
- Error messages: X/10

### Common Violations:
1. [Most frequent issue]
2. [Second most frequent]
3. [Third most frequent]

### Recommendations:
- [Specific guideline improvements needed]
- [Areas needing better examples]
- [Rules that need clearer explanations]
```

### 7. Success Metrics

- **90%+ Critical Rule Compliance**: All imports, type inference, naming correct
- **80%+ Core Rule Compliance**: Proper method usage across all rule categories
- **0 Redundant Error Messages**: No custom errors where defaults suffice
- **Consistent Patterns**: Similar approaches across all test schemas

### 8. Common Issues to Watch For

- Using 'zod' import instead of 'zod/v4'
- Missing type inference or placing it below schema
- Using z.string().email() instead of z.email()
- Adding unnecessary custom error messages
- Using .superRefine() instead of .check()
- Incorrect function schema syntax
- Using "Schema" suffix in names

This comprehensive test will reveal how well LLMs follow the Zod v4 guidelines and where improvements are needed.
