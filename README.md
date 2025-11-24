# ✅ What the CI Does (Strict Checks)

# 1. Install dependencies
npm ci

# 2. Check filename casing (PascalCase for components, camelCase for utils)
find . -type f \( -name "*[A-Z]*.js" -o -name "*[A-Z]*.jsx" -o -name "*[A-Z]*.ts" -o -name "*[A-Z]*.tsx" \) | grep -v "components"

# 3. Check for duplicate filenames across folders
find . -type f -printf '%f\n' | sort | uniq -d

# 4. Run ESLint for code quality
npm run lint

# 5. TypeScript type checking (fails if there are type errors)
npm run type-check

# 6. Build Next.js project (fails if build errors)
npm run build

# 7. Run security audit on dependencies
npm audit --production
