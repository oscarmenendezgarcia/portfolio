@AGENTS.md

## Design Skills (MANDATORY — must use the Skill tool, not just read)

### Developer Agent — UI implementation

You MUST call the `Skill` tool for each of these before writing any component or making any visual decision. Reading this file is not enough — you must actually invoke them:

```
Skill({ skill: "minimalist-ui" })         // Step 1 — minimalismo como principio rector
Skill({ skill: "design-taste-frontend" }) // Step 2 — layout, tipografía, motion, spacing premium
Skill({ skill: "emil-design-eng" })       // Step 3 — polish, micro-interacciones, invisible details
Skill({ skill: "impeccable" })            // Step 4 — anti-pattern detection (29 reglas)
Skill({ skill: "high-end-visual-design"}) // Step 5 — calidad visual premium
```

After editing TSX components, also invoke:
```
Skill({ skill: "vercel-plugin:react-best-practices" })
```

Zero inline styles. Tailwind tokens only.

### UX/API Designer — Diseño de pantallas

You MUST call the `Skill` tool before designing any screen or wireframe:

```
Skill({ skill: "ui-ux-pro-max:ui-ux-pro-max" }) // Step 1 — paletas, tipografía, layout, WCAG
Skill({ skill: "stitch-design-taste" })          // Step 2 — tipografía estricta, color calibrado
Skill({ skill: "minimalist-ui" })                // Step 3 — constraint de minimalismo
```

### AI Chatbot (task: AI Assistant)

You MUST invoke before any AI SDK decision:
```
Skill({ skill: "vercel-plugin:ai-sdk" })
```
