This is a [Next.js](https://nextjs.org/) project.

## Getting Started

Copy ENV file

```bash
cp .env.example .env
```

Install dependencies

```bash
pnpm install
```

Generate GraphQL types

```bash
pnpm codgen
```

Build app

```bash
pnpm build
```

<!-- page creation structure -->

- /<name of page>
  |
  -- /components
  |
  --- /index.tsx
  -- /page.tsx

<!-- page.tsx pattern -->

/<page>/page.tsx
const <Name>Page = async () => {
.
.
.
}

export default <Name>Page

<!-- index.tsx pattern -->

/<page>/components/index.tsx
const <Name>Index = async () => {
.
.
.
}

export default <Name>Index

<!-- default spacing classes -->

gap => 2xl
p, m, rounded => base

<!-- withMobileHeader -->

for wrapping page with header use withMobileHeader-HOC inside layout of each page you want
