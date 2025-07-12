# Zod v4 Rule Compliance Testing

Test how accurately LLMs follow the Zod v4 guidelines in `.cursor/rules/zod-v4.mdc` when creating Zod schemas.

## Overview

This test uses 10 subagents to create Zod schemas covering different rule aspects. Each subagent follows the same prompt template but with different schema requirements to test various parts of the Zod v4 guidelines.

## Process

### 1. Clean Test Directory
```bash
# Remove any existing test files to prevent contamination
rm -rf .cursor/rules/test-zod/
mkdir -p .cursor/rules/test-zod/
```

### 2. Test Cases

Run these 10 test prompts using the Task tool, each creating a different Zod schema:

1. **Basic Import & Type Inference** (Critical Rule)
   - Create a simple User schema with email, name, age
   - Tests: Import from 'zod/v4', type inference above schema

2. **String Validation Methods** (Core Rule)
   - Create schema with email, URL, UUID fields
   - Tests: Using z.email(), z.url(), z.uuid() vs z.string().email()

3. **Error Message Usage** (Core Rule)
   - Create password validation schema with custom business logic
   - Tests: When to use custom error messages vs defaults

4. **Number Types** (Core Rule)
   - Create schema with various number types (general, integer, specific)
   - Tests: z.number() vs z.int() vs z.int32()

5. **Object Type Variations** (Core Rule)
   - Create config schema that needs strict validation
   - Tests: z.object() vs z.strictObject() vs z.looseObject()

6. **Custom Validation with .check()** (Core Rule)
   - Create complex validation with multiple constraints
   - Tests: Using .check() instead of .superRefine()

7. **Function Schema Definition** (Core Rule)
   - Create API endpoint validation function
   - Tests: Function schema with input/output types

8. **ISO Date/Time Handling** (Core Rule)
   - Create event schema with timestamps
   - Tests: z.iso.datetime() vs z.iso.date()

9. **Advanced Features** (Core Rule)
   - Create file upload schema with arrays and optional fields
   - Tests: File validation, arrays, optional/nullable

10. **Complete Real-World Example** (Integration Test)
    - Create comprehensive API request/response schemas
    - Tests: All rules together in realistic scenario

### 3. Subagent Template

For each test case, use this exact template with the Task tool:

```
Create Zod schemas for the following requirements:

[INSERT TEST CASE DESCRIPTION]

Write your complete schema to: /Users/jh/src/workers-monorepo-template/.cursor/rules/test-zod/[test-name].ts
```

### 4. Specific Test Descriptions

**Test 1: Basic Schema**
```
Create a User schema with:
- email (must be valid email)
- name (string, minimum 2 characters)
- age (number, minimum 18)

Focus on proper imports and type inference patterns.
```

**Test 2: String Validation**
```
Create a SocialProfile schema with:
- email (email validation)
- website (URL validation)
- userId (UUID validation)
- profileUrl (URL validation)

Use the correct Zod v4 string validation methods.
```

**Test 3: Error Messages**
```
Create a Password schema with:
- Must be at least 8 characters
- Must contain uppercase letter
- Must contain number
- Must contain special character

Only use custom error messages where Zod's defaults aren't sufficient.
```

**Test 4: Number Types**
```
Create a GameStats schema with:
- score (general number)
- lives (integer only)
- precision (32-bit integer)
- accuracy (64-bit float)

Use appropriate number type methods for each field.
```

**Test 5: Object Validation**
```
Create a Configuration schema that:
- Accepts only known properties
- Has apiKey, timeout, retries fields
- Should reject any extra properties

Choose the correct object validation method.
```

**Test 6: Custom Validation**
```
Create a ProductCode schema that validates:
- Must start with 'PROD-'
- Must be exactly 12 characters
- Must contain only uppercase letters and numbers after prefix

Use modern Zod v4 validation methods.
```

**Test 7: Function Schema**
```
Create a validation schema for a function that:
- Takes a user ID (string) and options object as input
- Returns a user profile object with id, name, email
- Use proper Zod v4 function schema syntax
```

**Test 8: Date/Time**
```
Create an Event schema with:
- startDate (ISO date only)
- createdAt (full ISO datetime)
- updatedAt (full ISO datetime, optional)

Use correct Zod v4 ISO format methods.
```

**Test 9: Advanced Features**
```
Create a FileUpload schema with:
- files (array of file objects with size/type validation)
- metadata (optional object)
- tags (array of strings, nullable)
- Use .default() for some fields

Include file size limits and MIME type restrictions.
```

**Test 10: Real-World API**
```
Create complete API schemas for a blog post endpoint:
- CreatePostRequest (title, content, tags, publishAt)
- PostResponse (id, title, content, author, createdAt, updatedAt)
- Include proper type inference for both schemas
- Use appropriate validation for each field type
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

### 6. Success Metrics

- **90%+ Critical Rule Compliance**: All imports, type inference, naming correct
- **80%+ Core Rule Compliance**: Proper method usage across all rule categories
- **0 Redundant Error Messages**: No custom errors where defaults suffice
- **Consistent Patterns**: Similar approaches across all test schemas

### 7. Common Issues to Watch For

- Using 'zod' import instead of 'zod/v4'
- Missing type inference or placing it below schema
- Using z.string().email() instead of z.email()
- Adding unnecessary custom error messages
- Using .superRefine() instead of .check()
- Incorrect function schema syntax
- Using "Schema" suffix in names

### 8. Running the Test

1. Clean test directory
2. Launch 10 Task subagents in parallel with the template above
3. Review all generated files
4. Score against evaluation criteria
5. Identify patterns in rule violations
6. Use results to improve Zod v4 guidelines if needed

### 9. Analysis Template

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

This comprehensive test will reveal how well LLMs follow the Zod v4 guidelines and where improvements are needed.
