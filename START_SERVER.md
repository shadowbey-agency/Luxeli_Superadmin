# How to Start the Server

## Starting the Development Server

```bash
npm run dev
```

This runs `tsx server.ts` which starts:
- Next.js server
- Custom HTTP server

## Alternative: Using Next.js Dev Server

You can also use the standard Next.js dev server:

```bash
npm run dev:next
# or
next dev
```

## What You Should See

When you run `npm run dev`, you should see in the terminal:

```
> Ready on http://localhost:3000
> MongoDB URI loaded: ✅
```

## Troubleshooting

### If port 3000 is already in use:

1. **Kill all processes and restart:**
   ```bash
   # Windows
   taskkill /F /IM node.exe
   
   # Then restart
   npm run dev
   ```

2. **Check for errors in terminal:**
   - Look for error messages
   - Verify MongoDB connection string in `.env.local`

3. **Verify package.json:**
   ```json
   "scripts": {
     "dev": "tsx server.ts"
   }
   ```


