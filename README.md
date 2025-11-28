<div align="center">
  <img src="public/icons/logo.svg" alt="AutoWeave Logo" width="120" height="120" />
  
  # AutoWeave
  
  **A Modern AI-Powered Workflow Automation Platform**
  
  Build, automate, and execute complex workflows with AI integration, webhook triggers, and HTTP requests.
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge)](https://orm.drizzle.team)
  
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Workflow Nodes](#workflow-nodes)
  - [Trigger Nodes](#trigger-nodes)
  - [Execution Nodes](#execution-nodes)
  - [AI Nodes](#ai-nodes)
- [API Reference](#api-reference)
- [Webhooks](#webhooks)
- [Authentication & Authorization](#authentication--authorization)
- [Billing & Subscriptions](#billing--subscriptions)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**AutoWeave** is a powerful, visual workflow automation platform that enables users to create complex automation pipelines using a drag-and-drop interface. It combines the simplicity of visual programming with the power of AI, allowing users to:

- Design workflows visually using a node-based editor
- Trigger workflows via webhooks (Google Forms, Stripe events, etc.)
- Execute HTTP requests with dynamic data
- Integrate AI models (OpenAI GPT, Anthropic Claude, Google Gemini, DeepSeek)
- Monitor workflow executions in real-time
- Scale with a subscription-based pricing model

---

## Features

### Visual Workflow Editor

- **Drag-and-drop interface** powered by React Flow
- **Node-based workflow design** with visual connections
- **Real-time node status indicators** during execution
- **Auto-save functionality** for workflow changes

### Multiple Trigger Types

- **Manual Trigger** - Execute workflows on demand
- **Google Forms Trigger** - Automatically run workflows when forms are submitted
- **Stripe Trigger** - React to payment events, subscriptions, and more

### AI Integration

- **OpenAI GPT** - GPT-4o, GPT-4, GPT-3.5-Turbo, o1, o3, o4-mini
- **Anthropic Claude** - Claude Sonnet 4, Claude Opus 4, Claude 3.5/3.7
- **Google Gemini** - Gemini 2.0/2.5 Flash & Pro
- **DeepSeek** - DeepSeek Chat & Reasoner

### HTTP Requests

- Support for **GET, POST, PUT, PATCH, DELETE** methods
- **Dynamic URL and body templates** using Handlebars
- **JSON response parsing** and variable extraction

### Real-Time Execution

- **Inngest-powered** background job processing
- **Real-time status updates** via WebSocket
- **Execution history** and logging

### Authentication & Billing

- **Better Auth** with email/password and OAuth (GitHub, Google)
- **Polar.sh integration** for subscription billing
- **Tiered pricing** (Plus, Pro plans)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Auth UI   │  │  Workflow   │  │     Dashboard           │  │
│  │  (Login/    │  │   Editor    │  │  (Workflows, Executions │  │
│  │   Signup)   │  │ (React Flow)│  │   Credentials, Billing) │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Layer (tRPC)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Workflows  │  │    Auth     │  │       Webhooks          │  │
│  │   Router    │  │   Router    │  │  (Google Forms, Stripe) │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Background Jobs (Inngest)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Workflow Executor                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │
│  │  │ Trigger  │→│   HTTP   │→│    AI    │→│  Output  │   │    │
│  │  │ Executor │ │ Executor │ │ Executor │ │          │   │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐            ┌─────────────────────────┐     │
│  │   PostgreSQL    │            │      AI Providers       │     │
│  │   (Drizzle ORM) │            │ (OpenAI, Anthropic,     │     │
│  │                 │            │  Gemini, DeepSeek)      │     │
│  └─────────────────┘            └─────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend

| Technology                                       | Purpose                         |
| ------------------------------------------------ | ------------------------------- |
| [Next.js 15](https://nextjs.org)                 | React framework with App Router |
| [React 19](https://react.dev)                    | UI library                      |
| [TypeScript 5.9](https://www.typescriptlang.org) | Type safety                     |
| [Tailwind CSS 4](https://tailwindcss.com)        | Utility-first styling           |
| [React Flow](https://reactflow.dev)              | Visual workflow editor          |
| [Radix UI](https://www.radix-ui.com)             | Accessible UI primitives        |
| [Jotai](https://jotai.org)                       | Atomic state management         |
| [React Hook Form](https://react-hook-form.com)   | Form handling                   |
| [nuqs](https://nuqs.47ng.com)                    | URL state management            |

### Backend

| Technology                                 | Purpose                   |
| ------------------------------------------ | ------------------------- |
| [tRPC](https://trpc.io)                    | End-to-end typesafe APIs  |
| [Drizzle ORM](https://orm.drizzle.team)    | TypeScript ORM            |
| [PostgreSQL](https://www.postgresql.org)   | Database                  |
| [Inngest](https://www.inngest.com)         | Background job processing |
| [Better Auth](https://www.better-auth.com) | Authentication            |
| [Polar.sh](https://polar.sh)               | Subscription billing      |

### AI Providers

| Provider                               | SDK                 |
| -------------------------------------- | ------------------- |
| [OpenAI](https://openai.com)           | `@ai-sdk/openai`    |
| [Anthropic](https://anthropic.com)     | `@ai-sdk/anthropic` |
| [Google Gemini](https://ai.google.dev) | `@ai-sdk/google`    |
| [DeepSeek](https://deepseek.com)       | `@ai-sdk/deepseek`  |

### DevOps & Monitoring

| Technology                                 | Purpose                 |
| ------------------------------------------ | ----------------------- |
| [Sentry](https://sentry.io)                | Error tracking          |
| [Biome](https://biomejs.dev)               | Linting & formatting    |
| [mprocs](https://github.com/pvolok/mprocs) | Process manager for dev |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 10.x (recommended) or npm/yarn
- **PostgreSQL** >= 14.x
- **Inngest CLI** (for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/KrishKoria/AutoWeave.git
   cd AutoWeave
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/autoweave"

# Next.js
NODE_ENV="development"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Providers
GOOGLE_GENRATIVE_AI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
DEEPSEEK_API_KEY="your-deepseek-api-key"

# Billing (Polar.sh)
POLAR_ACCESS_TOKEN="your-polar-access-token"
POLAR_SUCCESS_URL="http://localhost:3000/workflows"

# Monitoring (Sentry)
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

### Database Setup

1. **Start PostgreSQL** (or use the provided script)

   ```bash
   ./start-database.sh
   ```

2. **Generate database schema**

   ```bash
   pnpm db:generate
   ```

3. **Push schema to database**

   ```bash
   pnpm db:push
   ```

4. **Open Drizzle Studio** (optional, for database inspection)
   ```bash
   pnpm db:studio
   ```

### Running the Application

**Development mode with all services:**

```bash
pnpm dev:all
```

This starts:

- Next.js development server (port 3000)
- Inngest dev server (for background jobs)

**Or run individually:**

```bash
# Next.js only
pnpm dev

# With ngrok tunnel (for webhooks)
pnpm dev:ngrok
```

---

## Project Structure

```
AutoWeave/
├── drizzle/                    # Database migrations
├── public/
│   └── icons/                  # Node and app icons
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (dashboard)/       # Main application
│   │   │   ├── (editor)/      # Workflow editor
│   │   │   │   ├── workflows/[id]/
│   │   │   │   └── _components/
│   │   │   │       └── nodes/
│   │   │   │           ├── executions/    # HTTP, AI nodes
│   │   │   │           └── triggers/      # Trigger nodes
│   │   │   └── (others)/      # Dashboard pages
│   │   │       ├── credentials/
│   │   │       ├── executions/
│   │   │       └── workflows/
│   │   └── api/
│   │       ├── auth/          # Better Auth handler
│   │       ├── inngest/       # Inngest webhook
│   │       ├── trpc/          # tRPC handler
│   │       └── webhooks/      # External webhooks
│   │           ├── google-form/
│   │           └── stripe/
│   ├── components/            # Shared UI components
│   │   └── ui/               # Radix-based components
│   ├── config/               # App configuration
│   ├── hooks/                # Custom React hooks
│   ├── inngest/              # Background job definitions
│   │   ├── channels.ts       # Real-time channels
│   │   ├── executor-registry.ts
│   │   ├── functions.ts      # Workflow executor
│   │   └── types.ts
│   ├── lib/                  # Utilities
│   │   ├── auth.ts           # Better Auth config
│   │   ├── auth-client.ts    # Client-side auth
│   │   └── polar.ts          # Polar.sh client
│   ├── server/
│   │   ├── api/
│   │   │   ├── routers/      # tRPC routers
│   │   │   └── trpc.ts       # tRPC context
│   │   └── db/
│   │       ├── index.ts      # Database client
│   │       └── schema.ts     # Drizzle schema
│   ├── store/                # Jotai atoms
│   ├── styles/               # Global styles
│   └── trpc/                 # tRPC client setup
├── biome.jsonc               # Linter config
├── drizzle.config.ts         # Drizzle config
├── mprocs.yaml               # Process manager config
├── next.config.js            # Next.js config
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Workflow Nodes

### Trigger Nodes

Trigger nodes start workflow execution. Each workflow must begin with a trigger.

#### Manual Trigger

Executes the workflow manually via the UI or API.

```typescript
// No configuration required
// Context: Empty object {}
```

#### Google Forms Trigger

Triggered when a Google Form is submitted.

```typescript
// Webhook URL: /api/webhooks/google-form?workflowId={id}
// Context:
{
  googleFormData: {
    formId: string,
    formTitle: string,
    responseId: string,
    responses: object,
    timestamp: string,
    respondentEmail: string,
    raw: object
  }
}
```

#### Stripe Trigger

Triggered by Stripe webhook events.

```typescript
// Webhook URL: /api/webhooks/stripe?workflowId={id}
// Context:
{
  stripe: {
    eventId: string,
    eventType: string,
    livemode: boolean,
    timestamp: number,
    raw: object
  }
}
```

### Execution Nodes

#### HTTP Request Node

Makes HTTP requests to external APIs.

| Field      | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `variable` | string | Variable name for response     |
| `method`   | enum   | GET, POST, PUT, PATCH, DELETE  |
| `endpoint` | string | URL with template support      |
| `body`     | string | JSON body (for POST/PUT/PATCH) |

**Template Variables:**

```handlebars
# Access previous node data
{{previousNode.data}}

# Stringify objects
{{json previousNode.data}}
```

**Response Format:**

```typescript
{
  [variable]: {
    httpResponse: {
      status: number,
      statusText: string,
      body: any
    }
  }
}
```

### AI Nodes

All AI nodes share a similar interface:

| Field          | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| `variable`     | string | Variable name for response     |
| `model`        | enum   | AI model to use                |
| `systemPrompt` | string | System instructions (optional) |
| `userPrompt`   | string | User message with templates    |

**Response Format:**

```typescript
{
  [variable]: {
    aiResponse: string
  }
}
```

#### OpenAI Node

**Available Models:**

- `gpt-4o`, `gpt-4o-mini`
- `gpt-4-turbo`, `gpt-4`
- `gpt-3.5-turbo`
- `o1`, `o1-mini`, `o1-preview`
- `o3`, `o3-mini`, `o4-mini`

#### Anthropic Node

**Available Models:**

- `claude-sonnet-4-20250514`
- `claude-opus-4-20250514`
- `claude-3-7-sonnet-20250219`
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku-20241022`

#### Gemini Node

**Available Models:**

- `gemini-2.0-flash`, `gemini-2.0-pro`
- `gemini-2.5-flash`, `gemini-2.5-pro`

#### DeepSeek Node

**Available Models:**

- `deepseek-chat`
- `deepseek-reasoner`

---

## API Reference

AutoWeave uses tRPC for type-safe API calls. All procedures are defined in `src/server/api/routers/`.

### Workflows Router

| Procedure                       | Type     | Description                   |
| ------------------------------- | -------- | ----------------------------- |
| `workflows.create`              | Mutation | Create a new workflow         |
| `workflows.remove`              | Mutation | Delete a workflow             |
| `workflows.updateName`          | Mutation | Rename a workflow             |
| `workflows.getOne`              | Query    | Get workflow with nodes/edges |
| `workflows.getMany`             | Query    | List workflows (paginated)    |
| `workflows.execute`             | Mutation | Trigger workflow execution    |
| `workflows.updateNodesAndEdges` | Mutation | Save workflow changes         |

### Example Usage

```typescript
import { api } from "@/trpc/react";

// Create workflow
const createWorkflow = api.workflows.create.useMutation();
await createWorkflow.mutateAsync({ description: "My workflow" });

// Execute workflow
const executeWorkflow = api.workflows.execute.useMutation();
await executeWorkflow.mutateAsync({ id: "workflow-id" });

// List workflows
const { data } = api.workflows.getMany.useQuery({
  page: 1,
  pageSize: 10,
  search: "",
});
```

---

## Webhooks

### Google Forms Integration

1. Create a workflow with a **Google Forms Trigger**
2. Copy the webhook URL:
   ```
   https://your-domain.com/api/webhooks/google-form?workflowId={id}
   ```
3. In Google Forms, add an Apps Script:

   ```javascript
   function onFormSubmit(e) {
     var response = e.response;
     var payload = {
       formid: e.source.getId(),
       formTitle: e.source.getTitle(),
       responseid: response.getId(),
       responses: response.getItemResponses().map(function (item) {
         return {
           question: item.getItem().getTitle(),
           answer: item.getResponse(),
         };
       }),
       timestamp: response.getTimestamp(),
       respondentEmail: response.getRespondentEmail(),
     };

     UrlFetchApp.fetch("YOUR_WEBHOOK_URL", {
       method: "post",
       contentType: "application/json",
       payload: JSON.stringify(payload),
     });
   }
   ```

### Stripe Integration

1. Create a workflow with a **Stripe Trigger**
2. Copy the webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe?workflowId={id}
   ```
3. Configure in Stripe Dashboard → Developers → Webhooks

---

## Authentication & Authorization

AutoWeave uses **Better Auth** for authentication with support for:

- **Email/Password** registration and login
- **OAuth providers:** GitHub, Google
- **Session management** with secure cookies
- **Protected routes** via middleware

### Protected vs Premium Procedures

```typescript
// Available to all authenticated users
protectedProcedure;

// Requires active subscription
premiumProcedure;
```

---

## Billing & Subscriptions

AutoWeave integrates with **Polar.sh** for subscription management.

### Plans

| Plan     | Features                                 |
| -------- | ---------------------------------------- |
| **Free** | Limited workflows, manual execution only |
| **Plus** | Unlimited workflows, webhook triggers    |
| **Pro**  | Everything in Plus + priority support    |

### Integration

```typescript
// Trigger checkout
authClient.checkout({ slug: "AutoWeave Plus" });

// Open billing portal
authClient.customer.portal();
```

---

## Development

### Available Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `pnpm dev`         | Start Next.js in development mode      |
| `pnpm dev:all`     | Start all services (Next.js + Inngest) |
| `pnpm build`       | Build for production                   |
| `pnpm start`       | Start production server                |
| `pnpm typecheck`   | Run TypeScript type checking           |
| `pnpm check`       | Run Biome linter                       |
| `pnpm check:write` | Fix lint issues                        |
| `pnpm db:generate` | Generate Drizzle migrations            |
| `pnpm db:push`     | Push schema to database                |
| `pnpm db:studio`   | Open Drizzle Studio                    |

### Code Quality

The project uses **Biome** for linting and formatting:

```bash
# Check for issues
pnpm check

# Auto-fix issues
pnpm check:write

# Fix with unsafe changes
pnpm check:unsafe
```

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/KrishKoria">Krish Koria</a></p>
</div>
