# Development Rules & Coding Standards

## 1. Language Standards
- **English Only**: All UI text, button labels, modal titles, placeholders, toasts, alert messages, table headers, and error descriptions must strictly be in **English**.
- Do not use Vietnamese or any other language in user-facing copy or application code.

## 2. Iconography & Symbols
- **No Raw Emojis or Unicode Symbols**: Never use raw Unicode emojis or character symbols directly in strings, titles, toasts, buttons, or JSX (e.g., avoid `✅`, `❌`, `⚠️`, `👥`, `⏱️`, `🔗`, `📋`, `✕`, `●`).
- **Use Icon Libraries**: Always use SVG icon components from established icon packages (primarily `lucide-react`, such as `<Check />`, `<X />`, `<AlertTriangle />`, `<Users />`, `<Clock />`, `<Link2 />`, `<FileText />`, etc.).
- **Status Indicators**: For status dots, indicators, and badges, use HTML elements with CSS styling (e.g., `<span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />`) instead of bullet characters like `●`.
