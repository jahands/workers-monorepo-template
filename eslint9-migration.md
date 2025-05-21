# LLM-Guided ESLint 8 to ESLint 9 Monorepo Migration

## 1. Introduction & Goals

    - **Purpose of this guide:** This document serves as a comprehensive, step-by-step guide for a Large Language Model (LLM) to automate the migration of a TypeScript-based monorepo from ESLint version 8 to ESLint version 9. It focuses exclusively on projects using `eslint.config.ts` for their ESLint configuration (the "flat config" model).

    - **Overview of ESLint 9 changes (focus on flat config):** The most significant change in ESLint 9 is the full adoption of the "flat config" system, using an `eslint.config.ts` (or `.js`/`.mjs`, though this guide standardizes on `.ts`) file that exports an array of configuration objects. This replaces the legacy `.eslintrc.*` file formats and the `eslintConfig` key in `package.json`. Key aspects include explicit plugin imports, a different way of handling `extends`, and more granular control over configuration application through `files` and `ignores` properties within config objects.

    - **Goals of the automated migration:** The primary goal is for the LLM to successfully and accurately perform the following actions:
        1.  **Prerequisite Checks:** Verify necessary tools and assess the initial ESLint setup.
        2.  **Dependency Management:** Update ESLint, its core plugins (`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`), other ESLint-related plugins, and configuration packages (e.g., `eslint-config-prettier`) to their latest ESLint 9 compatible versions across the monorepo, primarily focusing on the shared ESLint configuration package and the root `package.json`.
        3.  **Flat Config Migration:** Convert all existing ESLint configurations (root and per-package `.eslintrc.*` or `package.json#eslintConfig`) to the new `eslint.config.ts` flat configuration format.
        4.  **Shared Configuration Handling:** Ensure that the dedicated shared ESLint configuration package (e.g., `packages/eslint-config`) is migrated correctly to export flat configurations, typically as functions returning `defineConfig([...])` arrays, for consumption by other packages in the monorepo using `eslint.config.ts`.
        5.  **Rule Updates & Deprecations:** Identify and address rules that have been deprecated, removed, or had their options changed in ESLint 9 or updated plugins, making necessary modifications to the `eslint.config.ts` files.
        6.  **Verification:** Execute ESLint with the new configuration to ensure it runs without errors (config errors, not linting violations) and apply auto-fixes where appropriate.
        7.  **Maintainability:** Produce a clean, maintainable, and type-safe ESLint setup using `eslint.config.ts` and `defineConfig` from `eslint/config`.
        8.  **TypeScript Focus:** The migration process outlined in this guide is specifically tailored for monorepos where TypeScript is the primary language and `eslint.config.ts` is the desired configuration file format.

## 2. Prerequisites & Setup

    - **2.1. Pre-migration Checks:**
        - **LLM Action:** Verify the user has a clean git working tree before starting the migration.
            - Run `git status` to ensure no uncommitted changes.
            - If there are uncommitted changes, instruct the user to commit or stash them before proceeding.
            - Recommend creating a backup branch: `git checkout -b eslint9-migration`
    - **2.2. Required tools (Node.js, pnpm/yarn/npm, jq for JSON processing, etc.)**
        - **LLM Action:** Verify these tools are available or guide the user on how to install them.
        - Node.js: v18.18.0, v20.9.0 or later (required by ESLint v9).
        - Package manager: pnpm, yarn, or npm (commands in this guide may assume pnpm, adjust as needed).
        - `jq`: Useful for parsing `package.json` files from the command line if needed (optional, direct file reads are preferred).
    - **2.3. Initial workspace assessment commands (e.g., `eslint --version` globally and per package)**
        - **LLM Action:** Determine the primary ESLint version currently used in the monorepo.
            - 1. **Check at Monorepo Root:** Execute `pnpm exec eslint --version` (or equivalent for yarn/npm) in the root of the monorepo. This is the primary indicator of the ESLint version being used for development and CLI tasks.
            - 2. **(Optional) Check Shared ESLint Config Package:** If a dedicated shared ESLint configuration package is identified (e.g., `packages/eslint-config`, `shared/eslint-config`), examine its `package.json` to see which version of `eslint` it declares as a dependency or peerDependency. This can provide further context but the root execution is generally the most direct measure of the active version.
            - *Note:* Avoid running `eslint --version` in every individual package, as this is usually unnecessary in a monorepo aiming for consistent tooling versions.
        - **LLM Action:** Store this primary ESLint version for later comparison.
        - **LLM Action:** Identify the monorepo's package manager (pnpm, yarn, npm) by checking for lock files (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`) or workspace configuration files.
        - **LLM Action:** If workspace detection fails or returns unexpected results, provide error handling guidance and ask user to manually specify workspace packages.

## 3. Phase 1: Discovery and Planning

    - 3.1. Identifying all packages in the monorepo
        - **LLM Action:** Parse workspace configuration to find all member packages.
            - For `pnpm`: Read `pnpm-workspace.yaml` (e.g., `packages:` list).
            - For `yarn`/`npm`: Read `workspaces` array in the root `package.json`.
            - For `lerna`: Read `packages` array in `lerna.json`.
        - **LLM Action:** Create a list of absolute or relative paths to each package directory.
    - 3.2. Locating ESLint configurations
        - **LLM Action:** For each identified package and for the monorepo root, search for existing ESLint configuration files:
            - `.eslintrc.js`
            - `.eslintrc.cjs`
            - `.eslintrc.yaml`
            - `.eslintrc.yml`
            - `.eslintrc.json`
            - `eslintConfig` key in `package.json`
        - **LLM Action:** Record the path and format of each found configuration file.
        - **LLM Action:** Determine if any of these configurations belong to a package that serves as a dedicated shared ESLint configuration hub for the monorepo (e.g., a package named `eslint-config`, `@repo/eslint-config`, `shared/eslint-config`, etc., often located in a `packages` or `tools` directory).
            - *Heuristic for LLM:* Look for packages whose primary purpose seems to be exporting ESLint configurations, and which are extended or imported by other packages in the monorepo.
    - 3.3. Identifying ESLint-related dependencies
        - **LLM Action:**
            1.  **Primary Location (Shared ESLint Config Package):**
                -   If a dedicated shared ESLint configuration package was identified in step 3.2 (e.g., `packages/eslint-config`):
                    -   Read its `package.json` file.
                    -   Extract all dependencies and devDependencies starting with the prefixes listed below.
            2.  **Secondary Location (Monorepo Root):**
                -   Read the root `package.json` file of the monorepo.
                -   Extract all dependencies and devDependencies starting with the prefixes listed below.
            3.  **Common Prefixes for ESLint-related packages:**
                -   `eslint` (the core library)
                -   `eslint-plugin-`
                -   `eslint-config-`
                -   `@eslint/`
                -   `@typescript-eslint/` (parser and plugin)
                -   Other known ESLint-related packages (e.g., `eslint-import-resolver-typescript`, `eslint-plugin-react`, etc. This list might need to be expanded based on common setups or user input).
        - **LLM Action:** Compile a comprehensive list of all *unique* ESLint-related packages and their current versions by combining the findings from the shared config package's `package.json` (if applicable) and the root `package.json`. This list will be crucial for the update phase.
        - **LLM Rationale:** ESLint dependencies are typically centralized in a shared `eslint-config` package or at the monorepo root. Focusing on these locations is more efficient for identifying the core set of ESLint dependencies to manage and update. Individual application packages typically consume these shared configurations rather than declaring their own primary ESLint dependencies.
    - 3.4. Creating a Migration Plan (conceptual for LLM)
        - **LLM Thought Process:**
            - **Shared Configs First:** Prioritize migrating shared ESLint configurations (e.g., in `packages/eslint-config`) before migrating the individual package configs that consume them.
            - **Dependency Updates Next:** Update ESLint and its plugins/configs across all packages.
            - **Flat Config Conversion:** Convert each ESLint configuration file to the new `eslint.config.ts` format.
            - **Order of Operations:**
                1. Update shared ESLint config packages' dependencies.
                2. Migrate shared ESLint configs to flat format.
                3. Update consuming packages' dependencies.
                4. Migrate consuming packages' ESLint configs to flat format, importing the new shared flat configs.
                5. Address root monorepo ESLint configuration.
            - *LLM Guidance Note:* This "Order of Operations" is the master plan. The LLM will apply the dependency update techniques described in Phase 4 and the configuration migration techniques from Phase 5 according to this sequence and to the relevant packages (shared package first, then consuming packages).
        - **LLM Critical Checkpoint:**
            - **After steps 3.1, 3.2, and 3.3, verify if a dedicated shared ESLint configuration package was identified.**
            - **If NO dedicated shared ESLint configuration package is found:**
                - **LLM Action: ABORT MIGRATION.**
                - Inform the user: "Migration aborted. This automated process is designed for monorepos that include a dedicated package for shared ESLint configurations (e.g., `@repo/eslint-config`). No such package was identified in this monorepo."
            - **If YES, proceed with the migration plan.**

## 4. Phase 2: Updating Dependencies

    - **Goal:** Update ESLint, its core plugins, and all other ESLint-related packages to their latest versions to prepare for the flat config migration. `FlatCompat` will be used in Phase 5 for any plugins not yet supporting flat config directly.
    - **LLM Action Guidance:** This Phase describes the *methods* for updating dependencies. The LLM must refer to the "Order of Operations" (defined in Phase 3.4) to determine *which specific* packages (the identified shared ESLint config package first, then consuming packages) these steps should be applied to and *when* in the overall migration sequence. When the Order of Operations indicates it's time to update dependencies for a package or group of packages, apply the following steps (4.1-4.4) to them:
    - **LLM Action:** For each unique ESLint-related package identified in Phase 1 (3.3):
        - **4.1. Determine Target Version:**
            - For `eslint`: Target the latest ESLint v9.x.x.
            - **Essential Dependencies to Install/Update:**
                - `@eslint/eslintrc`: Required for `FlatCompat` utility.
                - `@eslint/compat`: Required for `includeIgnoreFile` and other compatibility utilities.
                - `globals`: Required for environment globals in flat config.
                - `typescript-eslint`: Meta-package for TypeScript ESLint integration.
            - For all other ESLint plugins (`eslint-plugin-*`), shared configs (`eslint-config-*`), parsers (e.g., `@typescript-eslint/parser`), and related tools: Target their `latest` available version. The primary goal is to get the newest code, and compatibility with flat config will be addressed in Phase 5, using `FlatCompat` if necessary.
            - *Rationale*: Attempting to update to the absolute latest version first simplifies the process. If a plugin is not compatible with ESLint 9 even with `FlatCompat`, or if it causes significant issues, it can be flagged for manual review and potentially pinned to an older version or replaced later.
        - **4.2. Update Dependencies via Package Manager:**
            - **LLM Action:** For each package identified in Phase 1 (including the monorepo root) and for each ESLint-related dependency within that package that needs updating (as determined in 4.1):
                - Construct and execute the appropriate command for the detected package manager to update the dependency to its target version/tag (e.g., `eslint@^9.0.0`, `some-plugin@latest`).
                - These commands will modify the respective `package.json` files by resolving tags like `@latest` to specific semantic versions.
                - **Important:** The package manager, not the LLM directly editing the `package.json` text, must be responsible for resolving version tags (like `@latest`) and writing the final semantic version to the `package.json` file.
                - *Example commands (LLM to adapt for detected package manager, specific packages, and dependencies to be updated):*
                    - To update essential dependencies in the shared ESLint config package:
                        - `pnpm add -D eslint@^9.0.0 @eslint/eslintrc@latest @eslint/compat@latest globals@latest typescript-eslint@latest --filter @repo/eslint-config`
                        - `yarn workspace @repo/eslint-config add -D eslint@^9.0.0 @eslint/eslintrc@latest @eslint/compat@latest globals@latest typescript-eslint@latest`
                    - To update `eslint` to `^9.0.0` and `some-plugin` to its latest version in a specific package `my-app`:
                        - `pnpm add -D eslint@^9.0.0 some-plugin@latest --filter my-app`
                        - `yarn workspace my-app add -D eslint@^9.0.0 some-plugin@latest`
                        - (For npm, navigate to the package directory: `cd packages/my-app && npm install -D eslint@^9.0.0 some-plugin@latest && cd -`)
                    - If updating many dependencies within one package, they can often be grouped into a single command:
                        - `pnpm add -D plugin1@latest plugin2@latest another-dep@^specific.version --filter my-app`
                - **LLM Error Handling:** If package manager commands fail:
                    - Check for version conflicts and dependency resolution issues.
                    - Try updating dependencies one at a time to isolate problematic packages.
                    - If a specific plugin version is incompatible with ESLint 9, note it for manual review and continue with other updates.
                - **LLM Task:** Ensure these package manager commands are executed for all packages and all dependencies that require updates according to the plan from step 4.1.
        - **4.3. Install Updated Dependencies (Consolidate & Update Lockfile):**
            - **LLM Action:** After all individual dependencies have been updated in their respective `package.json` files using the package manager commands in step 4.2, run a general install command from the monorepo root. This ensures the lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`) is fully updated and all dependencies are correctly installed according to the modified `package.json` files.
            - **LLM Error Handling:** If installation fails:
                - Check for peer dependency conflicts.
                - Verify all packages can be resolved at their target versions.
                - If conflicts occur, try resolving with package manager specific commands (e.g., `pnpm install --resolution-mode=highest` for pnpm).
        - **4.4. Initial Verification (Optional but Recommended):**
            - **LLM Action:** After installation, try running `eslint --version` in a few key packages or the root to ensure the core ESLint version has been updated as expected.

## 5. Phase 3: Migrating to Flat Config (`eslint.config.ts`)

    - **Goal:** Convert all existing ESLint configurations (root and per-package `.eslintrc.*` files or `package.json#eslintConfig`) to the new `eslint.config.ts` flat configuration format.
    - **LLM Action Guidance:** This Phase describes the *methods* for migrating ESLint configurations. The LLM must refer to the "Order of Operations" (defined in Phase 3.4) to determine *which specific* configurations (for the identified shared ESLint config package first, then for consuming packages) these steps should be applied to and *when* in the overall migration sequence. When the Order of Operations indicates it's time to migrate a configuration, apply the following steps (5.1-5.5) to it:
    - **Core Tooling:**
        - `eslint.config.ts`: The new configuration file name.
        - `@eslint/eslintrc` package: Provides `FlatCompat` utility for using legacy configurations/plugins. (Reference: [https://github.com/eslint/eslintrc#readme](https://github.com/eslint/eslintrc#readme))

    - **5.1. General Principles of Flat Config:**
        - **LLM Understanding:** The new config is an array of configuration objects, exported as the default from `eslint.config.ts`.
        - Each object in the array can specify:
            - `files`: Glob patterns to determine which files the configuration object applies to.
            - `ignores`: Glob patterns for files/directories to exclude.
            - `languageOptions`: Parser, `parserOptions`, `globals`, etc.
            - `plugins`: Plugin objects (e.g., `import pluginName from 'eslint-plugin-name'; ... plugins: { 'plugin-prefix': pluginName }`).
            - `rules`: Rule configurations.
            - `processor`: For processing non-JavaScript files.
            - `settings`: Shared settings for plugins.
        - Configuration is applied by merging objects in the array; later objects can override earlier ones if they apply to the same files.
        - Unlike legacy configs, `extends` is no longer a direct key. Instead, shareable configs are imported and spread into the main array.
        - Plugins are explicitly imported and configured in the `plugins` key.

    - **5.2. Key Steps for Migrating Each Configuration File (`.eslintrc.*` to `eslint.config.ts`):**
        - **LLM Action (Repeat for each config identified in Phase 1.2, starting with shared configs):**
            1.  **Create `eslint.config.ts`:**
                - In the same directory as the old ESLint config file, create a new `eslint.config.ts`.
                - **Exclude from TypeScript compilation:** Add `eslint.config.ts` to the `exclude` array in the relevant `tsconfig.json` files:
                    - For application packages: Add `"eslint.config.ts"` to the package's `tsconfig.json` exclude array.
                    - For the root monorepo: Add `"**/eslint.config.ts"` to the root `tsconfig.json` exclude array.
                    - Example: `"exclude": ["eslint.config.ts", "dist", "node_modules"]`
            2.  **Initialize `FlatCompat` (if needed):**
                - **LLM Action:** If the old config uses plugins or extends configs that might not be flat-config-ready, import `FlatCompat` from `@eslint/eslintrc`.
                - **Use helper functions for path resolution:** Create or import helper functions for consistent path handling:
                    ```typescript
                    import { fileURLToPath } from 'url';
                    import path from 'path';

                    export function getDirname(importMetaUrl: string) {
                        const __filename = fileURLToPath(importMetaUrl);
                        return path.dirname(__filename);
                    }
                    ```
                - Example (`eslint.config.ts`):
                    ```typescript
                    import { FlatCompat } from "@eslint/eslintrc";
                    import js from '@eslint/js'; // Required if using recommendedConfig or allConfig through compat
                    import { getDirname } from './helpers'; // Use helper function

                    const compat = new FlatCompat({
                        baseDirectory: getDirname(import.meta.url), // Use helper for consistent path resolution
                        // recommendedConfig: js.configs.recommended, // Needed if using "eslint:recommended" via compat
                        // allConfig: js.configs.all // Needed if using "eslint:all" via compat
                    });
                    ```
            3.  **Translate Configuration Sections:** (Detailed in 5.3)
            4.  **Delete Old Config File:** After successful migration and verification, delete the old `.eslintrc.*` file and remove `eslintConfig` from `package.json` if present.

    - **5.3. Mapping Legacy Config Keys to Flat Config (using `FlatCompat` where necessary):**
        - **LLM Task:** For each key in the old `.eslintrc.*` file, translate it as follows:

            - **`extends` (Legacy):**
                - **Flat Config Approach:** Import the shareable config directly and spread it into the array. For configurations not yet in flat format, use `compat.extends("config-name" or "./path/to/config.js")`.
                - Example (Direct import of flat config):
                    ```typescript
                    // eslint.config.ts
                    import someSharedFlatConfig from '@repo/eslint-config/flat';
                    import { defineConfig } from 'eslint/config';

                    export default defineConfig([
                        ...someSharedFlatConfig,
                        // ... other configs
                    ]);
                    ```
                - Example (Using `FlatCompat` for legacy extends):
                    ```typescript
                    // eslint.config.ts
                    import { FlatCompat } from "@eslint/eslintrc";
                    import path from "path";
                    import { fileURLToPath } from "url";
                    import js from '@eslint/js'; // Required for recommendedConfig
                    import { defineConfig } from 'eslint/config';

                    const __filename = fileURLToPath(import.meta.url);
                    const __dirname = path.dirname(__filename);
                    const compat = new FlatCompat({
                        baseDirectory: __dirname,
                        recommendedConfig: js.configs.recommended
                    });

                    export default defineConfig([
                        ...compat.extends("eslint:recommended", "plugin:react/recommended"),
                        // ... other configs
                    ]);
                    ```
                - **Note on `eslint:recommended` / `eslint:all`:** If these are extended via `compat.extends()`, ensure `FlatCompat` is initialized with `recommendedConfig: js.configs.recommended` (from `@eslint/js`) and `allConfig: js.configs.all` respectively.

            - **`plugins` (Legacy):**
                - **Flat Config Approach:** Import the plugin and add it to the `plugins` object within a config block. For legacy plugins, `compat.plugins("plugin-name")` can be used.
                - Example (Native flat config plugin):
                    ```typescript
                    // eslint.config.ts
                    import somePlugin from 'eslint-plugin-some-plugin';
                    import { defineConfig } from 'eslint/config';

                    export default defineConfig([
                        {
                            plugins: { 'some-prefix': somePlugin },
                            rules: { 'some-prefix/some-rule': 'error' }
                        }
                    ]);
                    ```
                - Example (Using `FlatCompat` for legacy plugins):
                    ```typescript
                    // eslint.config.ts
                    // (FlatCompat initialized as above, assuming js from '@eslint/js' is imported for compat)
                    import { defineConfig } from 'eslint/config';

                    // Assuming compat is initialized elsewhere with baseDirectory and recommendedConfig if needed
                    // const compat = new FlatCompat({ ... });

                    export default defineConfig([
                        ...compat.plugins("react", "jsx-a11y"),
                        // Rules for these plugins would typically be in configs they provide (via compat.extends)
                        // or defined in a subsequent config object.
                    ]);
                    ```
                - **Special Note for `eslint-plugin-import`:** This plugin currently lacks official TypeScript types. If you are using it in an `eslint.config.ts` file, you may need to use a comment like `// @ts-ignore eslint-plugin-import has no types` and import it using the namespace import syntax:
                    ```typescript
                    // eslint.config.ts
                    // @ts-ignore eslint-plugin-import has no types
                    import * as importPlugin from 'eslint-plugin-import';
                    // ...
                    export default defineConfig([
                        {
                            plugins: { 'import': importPlugin },
                            // Use flat config syntax for modern plugins:
                            ...importPlugin.flatConfigs?.recommended,
                            // ... rules and settings for eslint-plugin-import, e.g.,
                            settings: { 'import/resolver': { typescript: { project: './tsconfig.json' } } },
                        }
                    ]);
                    ```

            - **`rules` (Legacy):**
                - **Flat Config Approach:** Place directly in a config object's `rules` key. This is largely the same.
                - Example:
                    ```typescript
                    // eslint.config.ts
                    export default defineConfig([
                        {
                            files: ["**/*.js"],
                            rules: {
                                semi: ["error", "always"],
                                'no-unused-vars': 'warn'
                            }
                        }
                    ]);
                    ```

            - **`parser` & `parserOptions` (Legacy):**
                - **Flat Config Approach:** Placed under `languageOptions.parser` and `languageOptions.parserOptions`.
                - Example (TypeScript):
                    ```typescript
                    // eslint.config.ts
                    import tsParser from '@typescript-eslint/parser';
                    import { defineConfig } from 'eslint/config';

                    export default defineConfig([
                        {
                            files: ["**/*.ts", "**/*.tsx"],
                            languageOptions: {
                                parser: tsParser,
                                parserOptions: {
                                    project: './tsconfig.json',
                                    sourceType: 'module',
                                    ecmaVersion: 2022
                                }
                            }
                        }
                    ]);
                    ```

            - **`env` & `globals` (Legacy):**
                - **Flat Config Approach:** `env` is mapped to `languageOptions.globals` using helper objects (e.g., from the `globals` package). Direct `globals` are also placed in `languageOptions.globals`.
                - **Note:** Import from `globals/index.js` for compatibility:
                - Example:
                    ```typescript
                    // eslint.config.ts
                    import globals from 'globals/index.js';
                    import { defineConfig } from 'eslint/config';

                    export default defineConfig([
                        {
                            languageOptions: {
                                globals: {
                                    ...globals.browser,
                                    ...globals.node,
                                    myCustomGlobal: 'readonly'
                                }
                            }
                        }
                    ]);
                    ```
                - `FlatCompat` also has a `compat.env()` method for translating legacy `env` settings.

            - **`overrides` (Legacy):**
                - **Flat Config Approach:** Each object in the `overrides` array becomes a separate configuration object in the top-level flat config array. The `files` property from the override block is used as the `files` property in the new config object.
                - Example (Legacy):
                    ```json
                    // .eslintrc.json
                    {
                      "rules": { "default-rule": "error" },
                      "overrides": [
                        {
                          "files": ["*.test.js"],
                          "rules": { "test-specific-rule": "warn" }
                        }
                      ]
                    }
                    ```
                - Example (Flat Config):
                    ```typescript
                    // eslint.config.ts
                    export default defineConfig([
                        { // Default rules
                            rules: { 'default-rule': 'error' }
                        },
                        { // Override for test files
                            files: ["*.test.js"],
                            rules: { 'test-specific-rule': 'warn' }
                        }
                    ]);
                    ```

            - **`ignorePatterns` (Legacy):**
                - **Flat Config Approach:** Placed in an `ignores` array at the top level of a config object, or globally for the entire array.
                - Example:
                    ```typescript
                    // eslint.config.ts
                    export default defineConfig([
                        {
                            ignores: ["dist/", "node_modules/", "**/*.bak"]
                        },
                        // ...other configuration objects
                    ]);
                    ```
                - Global ignores can also be specified: `export default defineConfig([{ ignores: [...] }, ...otherConfigs]);` or `export default defineConfig([ { ...config, ignores: [...] } ]);`

            - **`settings` (Legacy):**
                - **Flat Config Approach:** Placed in a `settings` object within a configuration block, similar to rules. Typically used by plugins.
                - Example:
                    ```typescript
                    // eslint.config.ts
                    export default defineConfig([
                        {
                            settings: {
                                'import/resolver': { typescript: {} }
                            }
                        }
                    ]);
                    ```

    - 5.4. Structuring and Exporting from the Shared ESLint Configuration Package
        - **LLM Guidance:** The identified shared ESLint configuration package (e.g., `packages/eslint-config`, which we'll call `@repo/eslint-config` for examples) *must* be migrated to export its configurations as flat config arrays, typically via exported functions.

        - **Step-by-Step Migration of Shared Config Package:**
            1.  **Install Required Dependencies:** Ensure the shared config package has all necessary dependencies:
                ```bash
                pnpm add -D @eslint/eslintrc @eslint/compat @eslint/js globals typescript-eslint eslint-config-prettier --filter @repo/eslint-config
                ```
            2.  **Create Helper Functions:** Create a `helpers.ts` file with utility functions:
                ```typescript
                // packages/eslint-config/src/helpers.ts
                import { existsSync } from 'node:fs';
                import path from 'node:path';
                import { fileURLToPath } from 'node:url';
                import { includeIgnoreFile } from '@eslint/compat';

                export function getDirname(importMetaUrl: string) {
                    const __filename = fileURLToPath(importMetaUrl);
                    return path.dirname(__filename);
                }

                export function getTsconfigRootDir(importMetaUrl: string) {
                    const tsconfigRootDir = getDirname(importMetaUrl);
                    return existsSync(path.join(tsconfigRootDir, 'tsconfig.json')) ? tsconfigRootDir : undefined;
                }

                export function getGitIgnoreFiles(importMetaUrl: string) {
                    const rootGitignorePath = fileURLToPath(new URL('../../../.gitignore', import.meta.url));
                    const ignoreFiles = [includeIgnoreFile(rootGitignorePath)];

                    const packageDir = getDirname(importMetaUrl);
                    const packageGitignorePath = path.join(packageDir, '.gitignore');
                    if (existsSync(packageGitignorePath)) {
                        ignoreFiles.push(includeIgnoreFile(packageGitignorePath));
                    }

                    return ignoreFiles;
                }
                ```
            3.  **Migrate Main Configuration File:** Update the main config file (e.g., `src/default.config.ts`):
                ```typescript
                // packages/eslint-config/src/default.config.ts
                import { FlatCompat } from '@eslint/eslintrc';
                import eslint from '@eslint/js';
                import tsEslintPlugin from '@typescript-eslint/eslint-plugin';
                import tsEslintParser from '@typescript-eslint/parser';
                import eslintConfigPrettier from 'eslint-config-prettier';
                // @ts-ignore eslint-plugin-import has no types
                import * as importPlugin from 'eslint-plugin-import';
                import unusedImportsPlugin from 'eslint-plugin-unused-imports';
                import { defineConfig } from 'eslint/config';
                import globals from 'globals/index.js';
                import tseslint from 'typescript-eslint';

                import { getDirname, getGitIgnoreFiles, getTsconfigRootDir } from './helpers';

                export { defineConfig };

                const compat = new FlatCompat({
                    baseDirectory: getDirname(import.meta.url),
                });

                export function getConfig(importMetaUrl: string) {
                    return defineConfig([
                        // Global ignores
                        {
                            ignores: [
                                'eslint.config.ts',
                                '**/eslint.config.ts',
                                '**/node_modules/**',
                                '**/dist/**',
                                // Add other common ignore patterns
                            ],
                        },

                        ...getGitIgnoreFiles(importMetaUrl),

                        eslint.configs.recommended,
                        ...tseslint.configs.recommended,
                        importPlugin.flatConfigs?.recommended,

                        // TypeScript Configuration
                        {
                            files: ['**/*.{ts,tsx,mts}'],
                            languageOptions: {
                                parser: tsEslintParser,
                                parserOptions: {
                                    project: true,
                                    tsconfigRootDir: getTsconfigRootDir(importMetaUrl),
                                    sourceType: 'module',
                                },
                            },
                            plugins: {
                                'unused-imports': unusedImportsPlugin,
                            },
                            settings: {
                                'import/resolver': {
                                    typescript: {
                                        project: './tsconfig.json',
                                    },
                                },
                            },
                            rules: {
                                ...tsEslintPlugin.configs.recommended.rules,
                                ...importPlugin.configs?.typescript.rules,
                                '@typescript-eslint/no-unused-vars': ['warn', {
                                    argsIgnorePattern: '^_',
                                    varsIgnorePattern: '^_',
                                }],
                                'unused-imports/no-unused-imports': 'warn',
                                // Add other custom rules
                                ...eslintConfigPrettier.rules,
                            },
                        },

                        // Prettier (should be last)
                        { rules: eslintConfigPrettier.rules },
                    ]);
                }
                ```
            4.  **Update package.json exports:** Ensure the package.json has proper exports:
                ```json
                {
                    "name": "@repo/eslint-config",
                    "exports": {
                        ".": "./src/default.config.ts",
                        "./react": "./src/react.config.ts"
                    }
                }
                ```

        - **Consuming Shared Configurations in Application Packages:**
            - In an application package (e.g., `apps/my-app/eslint.config.ts`), import the desired config function from the shared package and call it, typically passing `import.meta.url` from the *consuming* config file.
            - Example (consuming package's `eslint.config.ts`):
                ```typescript
                import { defineConfig } from '@repo/eslint-config';
                import { getConfig } from '@repo/eslint-config'; // or getReactConfig for React apps

                const config = getConfig(import.meta.url);

                export default defineConfig([
                    ...config,
                    // Add any app-specific overrides here
                    {
                        files: ["src/**/*.ts"],
                        rules: {
                            "my-app-specific-rule": "warn"
                        }
                    }
                ]);
                ```

    - 5.5. Examples:
        - **LLM Task:** Refer to the `workers-monorepo-template` (before) and `workers` (after) project structures as concrete examples for common patterns.
        - Basic TypeScript project (legacy `.eslintrc.js` or `.eslintrc.json` -> `eslint.config.ts` with native TS plugins and `tsParser`)
        - Project with React/Vue/other frameworks (showing how framework-specific plugins are handled in `eslint.config.ts`, potentially with `FlatCompat` if needed).
        - Config with overrides and complex `ignorePatterns` in `eslint.config.ts`.

## 6. Phase 4: Addressing Rule Changes & Deprecations

    - **Goal:** Identify and update any ESLint rules that have been deprecated, removed, or had their options changed due to the upgrade to ESLint v9 and new plugin versions. Ensure the final configuration is valid and reflects the intended linting standards.
    - **Challenge:** This can be complex as direct replacements are not always available. The LLM might need to infer intent or flag rules for manual review.

    - **6.1. Identifying Deprecated/Changed Rules:**
        - **LLM Action (After migrating configs to flat format in Phase 3):**
            1.  **Run ESLint:** Execute `eslint .` (or the equivalent for your package manager, targeting specific packages if necessary) across the codebase with the new `eslint.config.ts` files.
                - *Expected Outcome:* ESLint might report errors or warnings related to:
                    - Unknown rules (if a rule was removed).
                    - Invalid rule options (if a rule's configuration schema changed).
                    - Deprecation warnings for rules that are still functional but will be removed in future versions.
            2.  **Parse ESLint Output:** Capture and analyze the output from the ESLint command.
                - **LLM Task:** Systematically list all reported rule-specific errors and warnings. For each, note the rule name and the error message.
            3.  **Consult Changelogs (Targeted Search):**
                - **LLM Action:** For each problematic rule identified:
                    - Determine if it's a core ESLint rule or from a plugin (e.g., `@typescript-eslint/some-rule`).
                    - Perform a targeted search in the changelog of ESLint core (for core rules) or the specific plugin for information about the rule in versions leading up to and including the newly installed version.
                    - *Search terms for LLM (conceptual):* "ESLint v9 changelog [rule-name]", "[plugin-name] changelog [rule-name] deprecated", "[plugin-name] [rule-name] new options".
                    - Look for sections on "Breaking Changes", "Deprecations", or "New Rules/Features".
                - **Alternative/Complement:** Some plugins or tools might offer migration guides or scripts (e.g., `eslint-plugin-unicorn` sometimes provides fixers for its own breaking changes).

    - **6.2. Common Patterns for Replacing/Updating Rules:**
        - **LLM Action (For each identified problematic rule):**

            - **Rule Renamed/Moved:**
                - *Symptom:* ESLint reports an "unknown rule" but the changelog indicates it was renamed or moved (e.g., to a different plugin or a sub-plugin like `@typescript-eslint/eslint-plugin-tslint`).
                - *Action:* Update the rule name in `eslint.config.ts`. Ensure the new plugin (if any) is installed and configured.

            - **Rule Options Changed:**
                - *Symptom:* ESLint reports "invalid options" for a rule.
                - *Action:* Consult the rule's documentation (via changelog or the plugin's rule documentation page) for the new valid options. Update the rule configuration in `eslint.config.ts` accordingly. This might involve restructuring options, renaming option keys, or changing option values.

            - **Rule Deprecated (with direct replacement):**
                - *Symptom:* ESLint issues a deprecation warning, and the changelog or warning message suggests a direct replacement rule.
                - *Action:* Replace the old rule with the new rule in `eslint.config.ts`. Adjust options as needed for the new rule.

            - **Rule Deprecated (functionality merged into another rule or now default):**
                - *Symptom:* Deprecation warning; changelog indicates its functionality is now part of another (broader) rule or is default ESLint behavior.
                - *Action:* Remove the deprecated rule. If its functionality was merged, ensure the broader rule is configured appropriately if needed.

            - **Rule Deprecated (no direct replacement / functionality removed):**
                - *Symptom:* Deprecation warning or unknown rule; changelog indicates the rule was removed without a direct one-to-one replacement.
                - *Action (Requires more careful handling):**
                    1.  **Understand Intent:** Try to understand *why* the rule was originally enabled. (This is hard for an LLM. It might need to look at comments near the rule in the old config or assume it was for general code quality/style).
                    2.  **Look for Alternatives:** Search ESLint core rules or other installed plugins for rules that achieve a similar stylistic or error-prevention goal.
                    3.  **Flag for Manual Review:** If no clear alternative is found, or if the intent is ambiguous, comment out the rule and add a specific `// TODO-LLM: Rule [old-rule-name] removed/deprecated. Please review and find alternative or confirm removal.` This flags it for human oversight.
                    4.  **Consider Removing:** If the rule was for a very minor stylistic preference and has no obvious modern equivalent, removing it might be the simplest option after flagging.

            - **Plugin Deprecated/Replaced:**
                - *Symptom:* An entire plugin is no longer maintained, or its functionality has been superseded by a new plugin (e.g. tslint -> @typescript-eslint).
                - *Action:*
                    1.  Remove the old plugin from dependencies and ESLint configurations.
                    2.  Install the new plugin (if applicable).
                    3.  Re-evaluate the rules that were provided by the old plugin. Many might need to be re-added using equivalents from the new plugin or ESLint core.

    - **6.3. Iterative Refinement:**
        - **LLM Action:** After attempting fixes, re-run ESLint. Repeat steps 6.1 and 6.2 until ESLint runs without errors or warnings related to rule configurations.
        - It's expected this might take a few iterations.

## 7. Phase 5: Execution and Verification

    - **Goal:** Ensure the new ESLint setup works correctly across the entire monorepo, apply auto-fixable changes, and identify any remaining issues for manual review or further action.

    - **7.1. Running ESLint Across the Monorepo:**
        - **LLM Action:** Execute ESLint comprehensively on all relevant files in all packages.
            - **Command (Monorepo Root):** `pnpm exec eslint . --format stylish` (or equivalent for yarn/npm; use a machine-readable format like `--format json` if parsing the output for specific error counts or types is needed, but `stylish` is good for initial review).
            - **Alternative (Per-Package, if needed for granularity or troubleshooting):** For each package identified in Phase 1.1, `cd` into the package directory and run `pnpm exec eslint . --format stylish`.
        - **LLM Task:**
            - Examine the output for any unexpected errors or a large volume of new warnings not related to rule deprecations (which should have been handled in Phase 4).
            - If there are configuration errors (e.g., ESLint crashes, can't find plugins/parsers despite them being installed), revisit Phase 3 (Flat Config Migration) and Phase 4 (Rule Changes) for the affected packages or the root config.
            - The goal here is a clean ESLint run, showing only actual lint violations in the code, not configuration issues.

    - **7.2. Applying Auto-fixes (`eslint --fix`):**
        - **LLM Action:** Once ESLint runs cleanly (no config errors), apply automatic fixes.
            - **Command (Monorepo Root):** `pnpm exec eslint . --fix`
            - **Caution for LLM:** Inform the user that `--fix` will modify files. It's critical that the codebase is under version control (Git) so changes can be reviewed and reverted if necessary.
            - **LLM Task:** After running `--fix`, re-run `pnpm exec eslint .` (without `--fix`) to see which warnings/errors remain.
        - **Benefit:** This can resolve many stylistic issues and some programmatic errors automatically, saving significant manual effort.

    - **7.3. Strategies for Manual Review of Remaining Errors/Warnings:**
        - **LLM Task:** Analyze the ESLint output after auto-fixes.
            - Categorize remaining issues (e.g., complex logical errors, stylistic choices not auto-fixable, rules that were flagged with `// TODO-LLM` in Phase 4).
            - **LLM Action: Report to User:** Present a summary of remaining ESLint issues. This report should include:
                - File path, line number, rule ID, and message for each issue.
                - Any `// TODO-LLM` comments that were added, indicating areas requiring human decision.
                - A count of remaining critical errors vs. warnings.
            - **Guidance for LLM:** Do not attempt to auto-fix complex issues that require deep semantic understanding beyond ESLint's capabilities. These are for human developers.

    - **7.4. Running Tests to Catch Regressions:**
        - **LLM Action:** Instruct the user (or attempt if given capabilities and permission) to run all automated tests (unit, integration, E2E) for the monorepo.
            - **Command (Conceptual):** `pnpm test` (or the project-specific test command).
        - **LLM Task:**
            - If tests fail, this could indicate that an auto-fix or a rule change (even if ESLint reported no error) has inadvertently altered code behavior.
            - **LLM Action: Report to User:** Clearly report any test failures. Correlating these with specific file changes made by `eslint --fix` might be possible if the number of changes is small, but generally, this requires human debugging.
        - **Importance:** This is a critical safety net to ensure the migration and auto-fixes haven't broken functionality.

    - **7.5. Final Sanity Checks (LLM Suggestions for User):**
        - Suggest that the user manually inspect a few key files, especially those heavily modified by `--fix` or those with complex ESLint configurations.
        - Recommend reviewing the diff of all changes made by the automated process before committing.

## 8. Troubleshooting & Common Issues

    - **Goal:** Provide guidance for common errors and challenges encountered during the ESLint 8 to 9 migration process.

    - **8.1. `FlatCompat` Issues:**
        - **Symptom:** Errors like `TypeError: Missing parameter 'recommendedConfig' in FlatCompat constructor` or `TypeError: Missing parameter 'allConfig' in FlatCompat constructor`.
            - **Cause:** The `FlatCompat` instance is being used to extend `eslint:recommended` or `eslint:all` (directly or indirectly via another extended config), but it wasn't initialized with these base configurations.
            - **LLM Fix Action:** When initializing `FlatCompat` in your `eslint.config.ts`, provide the necessary base configs from `@eslint/js`:
                ```typescript
                import { FlatCompat } from "@eslint/eslintrc";
                import js from "@eslint/js";
                import path from "path";
                import { fileURLToPath } from "url";

                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);

                const compat = new FlatCompat({
                    baseDirectory: __dirname,
                    recommendedConfig: js.configs.recommended, // For "eslint:recommended"
                    allConfig: js.configs.all                  // For "eslint:all"
                });
                ```
            - (Reference: [https://github.com/eslint/eslintrc#troubleshooting](https://github.com/eslint/eslintrc#troubleshooting))

        - **Symptom:** Plugin not found errors when using `compat.extends("plugin:some-plugin/config-name")` or `compat.plugins("some-plugin")`.
            - **Cause 1:** The `baseDirectory` for `FlatCompat` might not be set correctly to the directory containing the `eslint.config.ts` and thus cannot resolve the plugin relative to it.
            - **LLM Fix Action 1:** Ensure `baseDirectory` is correctly set to the directory of the `eslint.config.ts` file where `FlatCompat` is being used. If extending a file from an npm package, use the package name directly (e.g., `compat.extends("eslint-config-some-package")`).
            - **Cause 2:** The plugin itself might not be correctly installed or might have issues with its entry points for `FlatCompat`.
            - **LLM Action 2:** Verify the plugin is listed in the correct `package.json` and has been installed. Double-check the plugin name and config name. If issues persist, the plugin might have deeper incompatibility with `FlatCompat` or ESLint 9.

    - **8.2. TypeScript Configuration Issues (`eslint.config.ts` and `parserOptions.project`):**
        - **Symptom:** Errors related to `parserOptions.project` not finding `tsconfig.json`, or type-aware linting rules failing unexpectedly, especially in monorepos.
            - **Cause 1:** The `tsconfigRootDir` or `project` path in `languageOptions.parserOptions` is not correctly resolving to the `tsconfig.json` relevant to the files being linted.
            - **LLM Fix Action 1:** For per-package `eslint.config.ts` files, ensure `parserOptions.project` is set to a path relative to that package (e.g., `./tsconfig.json` or `['./tsconfig.json', './tsconfig.node.json']`). `tsconfigRootDir` can also be helpful here.
            - Consider using a helper function (like `getTsconfigRootDir` in the `workers` example) to correctly determine `tsconfigRootDir` based on `import.meta.url` of the `eslint.config.ts`.
                ```typescript
                // Example from workers/packages/eslint-config/src/default.config.ts
                languageOptions: {
                    parser: tseslint.parser,
                    parserOptions: {
                        project: true, // or specific paths like ['./tsconfig.json']
                        tsconfigRootDir: getTsconfigRootDir(import.meta.url),
                    },
                },
                ```
            - **Cause 2:** The `eslint.config.ts` itself is being type-checked by a `tsconfig.json` that it's not compatible with (e.g., using Node.js features or different module systems not allowed by the app's `tsconfig.json`).
            - **LLM Fix Action 2:** As detailed in Phase 3 (5.2.1), ensure `eslint.config.ts` is added to the `exclude` array of the main `tsconfig.json` files for your packages/application code. ESLint will process `eslint.config.ts` separately.

    - **8.3. Plugin Incompatibility (Even with `FlatCompat`):**
        - **Symptom:** Some older plugins might throw errors during ESLint execution even when wrapped with `FlatCompat`, or they might not behave as expected.
            - **Cause:** The plugin might have internal workings that are deeply tied to the old ESLint configuration system or APIs that `FlatCompat` cannot fully abstract.
            - **LLM Troubleshooting Steps:**
                1.  **Search for Issues:** Check the plugin's GitHub repository for open issues related to ESLint 9 or flat config support.
                2.  **Try Simpler Config:** Temporarily remove other plugins/configs to isolate if this specific plugin is the cause.
                3.  **Look for Alternatives:** Search for alternative plugins that provide similar functionality and are ESLint 9 / flat config compatible.
                4.  **Flag for Manual Review:** If no solution is found, flag the plugin and its rules for manual review. It might need to be temporarily disabled or replaced.

    - **8.4. Performance Issues:**
        - **Symptom:** ESLint runs significantly slower after migration.
            - **Cause 1 (Type-Aware Rules):** If type-aware linting (`parserOptions.project`) was newly enabled or expanded, it can increase lint times. This is often a necessary trade-off for more powerful linting.
            - **LLM Action 1:** Verify `parserOptions.project` and `tsconfigRootDir` are correctly scoped. Ensure `include` in the relevant `tsconfig.json` isn't overly broad.
            - **Cause 2 (Inefficient Globs or Ignores):** Very complex or inefficient glob patterns in `files` or `ignores`.
            - **LLM Action 2:** Review glob patterns for simplicity and efficiency. Ensure `node_modules`, build output directories (`dist`, `build`), and other non-source directories are globally ignored early in the configuration array.
                ```typescript
                // eslint.config.ts
                import { defineConfig } from 'eslint/config';

                export default defineConfig([
                    { ignores: ["**/node_modules/", "**/dist/"] }, // Global ignores first
                    // ... other configs
                ]);
                ```
            - **Cause 3 (Specific Rules):** Some rules are inherently more performance-intensive than others.
            - **LLM Action 3:** If slowness is extreme, use ESLint's `--debug` flag or tools like `eslint-timed` to identify if specific rules are bottlenecks. This usually requires manual investigation.

    - **8.5. Incorrect `extends` Path Resolution with `FlatCompat`:**
        - **Symptom:** `compat.extends("./relative/path/to/config.js")` fails to find the file.
            - **Cause:** `FlatCompat` resolves relative paths from its `baseDirectory`.
            - **LLM Fix Action:** Ensure `baseDirectory` is correctly set to the directory of the `eslint.config.ts` file where `FlatCompat` is being used. If extending a file from an npm package, use the package name directly (e.g., `compat.extends("eslint-config-some-package")`). If extending a local non-JS file (which is rare for ESLint configs but possible if `FlatCompat` were used for other JSON/YAML-like structures it might support), ensure the path is correct relative to `baseDirectory`. For ESLint legacy configs, they are typically `.js` or `.cjs`.

    - **8.6. Global `ignores` Not Working as Expected:**
        - **Symptom:** Files intended to be ignored are still being linted.
        - **Cause:** The `ignores` property needs to be part of a configuration object. ESLint processes the array of configuration objects, and ignores apply to subsequent objects unless specified otherwise or if an object overrides ignores with `ignores: []`.
        - **LLM Fix Action:** Ensure `ignores` are defined correctly within a configuration object. For truly global ignores, place them in the first object of the configuration array.
            ```typescript
            // eslint.config.ts
            import { defineConfig } from 'eslint/config';

            export default defineConfig([
              { ignores: ["coverage/", ".turbo/", "dist/"] }, // Global ignores for all subsequent configs
              // ... other configurations for specific files and rules
            ]);
            ```

## Appendix

    - **Goal:** Provide supplementary resources, examples, and quick reference materials to aid in the ESLint 9 migration.

    - **9.1. Useful Links & Documentation:**
        - **LLM Resource:** Refer to these links for authoritative information.
        - **ESLint Official Documentation:**
            - **Migrating to v9.x:** [https://eslint.org/docs/latest/use/migrate-to-9.0.0](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
            - **Configure ESLint (New Config File/Flat Config):** [https://eslint.org/docs/latest/use/configure/configuration-files-new](https://eslint.org/docs/latest/use/configure/configuration-files-new)
            - **`FlatCompat` Utility (`@eslint/eslintrc`):** [https://github.com/eslint/eslintrc#readme](https://github.com/eslint/eslintrc#readme)
            - **Core Rule List:** [https://eslint.org/docs/latest/rules/](https://eslint.org/docs/latest/rules/)
        - **TypeScript ESLint Documentation:**
            - **Website & Docs:** [https://typescript-eslint.io/getting-started](https://typescript-eslint.io/getting-started)
            - **Plugin Rules:** [https://typescript-eslint.io/rules/](https://typescript-eslint.io/rules/)
        - **Common Plugins (Examples - LLM should search for specific plugin docs as needed):**
            - `eslint-plugin-import`: [https://github.com/import-js/eslint-plugin-import#readme](https://github.com/import-js/eslint-plugin-import#readme)
            - `eslint-plugin-react`: [https://github.com/jsx-eslint/eslint-plugin-react#readme](https://github.com/jsx-eslint/eslint-plugin-react#readme)
            - `eslint-plugin-jsx-a11y`: [https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme)
            - `eslint-plugin-unused-imports`: [https://github.com/sweepline/eslint-plugin-unused-imports#readme](https://github.com/sweepline/eslint-plugin-unused-imports#readme)
            - `eslint-config-prettier` (for disabling stylistic rules that conflict with Prettier): [https://github.com/prettier/eslint-config-prettier#readme](https://github.com/prettier/eslint-config-prettier#readme)

    - **9.2. Example of a Consuming Package's `eslint.config.ts` (Complex Scenario):**
        - **LLM Task:** This example demonstrates what a *consuming package's* `eslint.config.ts` might look like. It assumes it's importing a configuration function (e.g., `getBaseConfigFromSharedPackage`) from a shared ESLint configuration package (structured as described in Section 5.4) and then composing it with other settings.
        ```typescript
        // eslint.config.ts (Illustrative Example for a CONSUMING package)
        import { defineConfig } from 'eslint/config';
        import tseslint from 'typescript-eslint';
        import js from "@eslint/js";
        import { FlatCompat } from "@eslint/eslintrc";
        import path from "path";
        import { fileURLToPath } from "url";

        // Assume this function is imported from your shared eslint-config package
        // import { getBaseConfigFromSharedPackage } from "@repo/eslint-config";

        // Core TS plugins (can also be part of the shared config)
        // import tsParser from '@typescript-eslint/parser'; // Or individual imports
        // import tsPlugin from '@typescript-eslint/eslint-plugin';

        // Other plugins (can also be part of the shared config, or app-specific)
        import reactPlugin from "eslint-plugin-react";
        import reactHooksPlugin from "eslint-plugin-react-hooks";
        import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
        // @ts-expect-error eslint-plugin-import has no official types yet
        import * as importPlugin from 'eslint-plugin-import';
        import unusedImportsPlugin from 'eslint-plugin-unused-imports';
        import prettierConfig from 'eslint-config-prettier'; // Just the rules object

        import globals from "globals";

        // Setup for FlatCompat (might be needed for app-specific legacy plugins)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const compat = new FlatCompat({
            baseDirectory: __dirname,
            recommendedConfig: js.configs.recommended, // if using compat.extends('eslint:recommended')
        });

        // const baseSharedConfig = getBaseConfigFromSharedPackage(import.meta.url);

        export default defineConfig([ // Using defineConfig from eslint/config
            // Start by spreading the imported shared configuration
            // ...baseSharedConfig,

            // --- The rest of this example shows configurations that *could* be in a shared config
            // --- or could be app-specific additions/overrides.
            // --- If getBaseConfigFromSharedPackage() already provides these, they might not be repeated here.

            // Global ignores (can also be part of shared config)
            { ignores: ["**/dist/", "**/node_modules/", "**/.turbo/", "**/.wrangler/"] },

            // ESLint Recommended (can also be part of shared config)
            js.configs.recommended, // Single config object

            // TypeScript Base Config (can also be part of shared config)
            ...tseslint.configs.recommended,
            {
                files: ["**/*.{ts,tsx,mts}"], // Ensure this matches files covered by tseslint.configs.recommended
                languageOptions: {
                    parser: tseslint.parser, // Often implicitly set by tseslint.configs.recommended
                    parserOptions: {
                        project: true,
                        tsconfigRootDir: __dirname, // For app-specific tsconfig, if not covered by shared config's `importMetaUrl` handling
                    },
                },
                plugins: { // Plugins are often implicitly set by tseslint.configs.recommended
                    // '@typescript-eslint': tseslint.plugin
                },
            },

            // React Specific Config (can also be part of shared config, or app-specific)
            {
                files: ["**/*.{ts,tsx}"], // Focus on TS/TSX for React with TS
                plugins: {
                    react: reactPlugin,
                    'react-hooks': reactHooksPlugin,
                    'jsx-a11y': jsxA11yPlugin,
                },
                languageOptions: {
                    globals: globals.browser,
                },
                settings: {
                    react: { version: "detect" }, // Automatically detect React version
                },
                rules: {
                    ...reactPlugin.configs.recommended.rules,
                    ...reactHooksPlugin.configs.recommended.rules,
                    ...jsxA11yPlugin.configs.recommended.rules,
                    "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
                },
            },

            // Import Plugin (Example - assuming it supports flat config or via FlatCompat)
            {
                files: ["**/*.{ts,tsx,mts,js,jsx}"], // Apply to all relevant file types
                plugins: { 'import': importPlugin, 'unused-imports': unusedImportsPlugin },
                settings: {
                    'import/resolver': {
                        typescript: { project: [`${__dirname}/tsconfig.json`] }, // Ensure path is correct, make it an array
                        node: true,
                    },
                },
                rules: {
                    // ...import plugin rules, e.g., importPlugin.configs.recommended.rules, ...importPlugin.configs.typescript.rules
                    'unused-imports/no-unused-imports': 'warn',
                    'import/order': ['warn', { 'newlines-between': 'always' }],
                },
            },

            // Example of using FlatCompat for a legacy config/plugin
            // ...compat.extends("some-legacy-config-package"),
            // ...compat.plugins("some-legacy-plugin"),

            // Overrides for specific files (e.g., test files)
            {
                files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"], // Focus on TS/TSX test files
                languageOptions: {
                    globals: {
                        ...globals.jest, // or globals.vitest, etc.
                    },
                },
                rules: {
                    // Relax or change rules for test files
                    "@typescript-eslint/no-explicit-any": "off",
                },
            },

            // Node.js specific files (e.g., scripts, eslint.config.ts itself)
            {
                files: ["eslint.config.ts", "scripts/**/*.js"], // Keep .js for actual JS scripts
                languageOptions: {
                    globals: globals.node,
                },
                rules: {
                    // Rules specific to Node.js environment
                },
            },

            // Prettier (must be last to override other formatting rules)
            prettierConfig, // This is just the rules object from eslint-config-prettier
        ]);
        ```

    - **9.3. Quick Mapping: Legacy to Flat Config Concepts:**
        - **LLM Resource:** A quick lookup table.
        | Legacy Key (`.eslintrc`) | Flat Config Concept (`eslint.config.ts`)                                   | Notes                                                                 |
        |--------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------------------|
        | `extends`                | Spread imported configs, or `compat.extends()`                             | No direct `extends` key.                                              |
        | `plugins`                | `plugins: { prefix: pluginObj }`, or `compat.plugins()`                    | Plugins are imported and keyed.                                       |
        | `rules`                  | `rules: { ... }`                                                           | Largely the same, within a config object.                             |
        | `parser`                 | `languageOptions: { parser: parserObj }`                                   |                                                                       |
        | `parserOptions`          | `languageOptions: { parserOptions: { ... } }`                            |                                                                       |
        | `env`                    | `languageOptions: { globals: { ...globals.envName } }`, or `compat.env()` | Use `globals` package.                                                |
        | `globals`                | `languageOptions: { globals: { ... } }`                                    |                                                                       |
        | `overrides`              | Separate objects in the top-level config array, using `files` key.       | Each override block becomes a distinct config object.                 |
        | `ignorePatterns`         | `ignores: [...]`                                                           |                                                                       |
