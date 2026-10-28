---
name: Garçon
tagline: A plain-language assistant for my applications — one chat, and one MCP server, in front of every application's API.
stack: [Rust, axum, PostgreSQL, Leptos, WebAssembly, MCP, LLM]
order: 2
---
Each of my applications has its own screens and its own REST API. Garçon puts one
conversation in front of all of them. I say what I want in plain words, and it
works out which application should handle it, which endpoint to call, and what to send.
A garçon takes your order and brings it to the right kitchen.

## What it does

- **Chat.** Ask in plain words: record a charge in Conrad, add milk to the
  shopping list, find where something is stored. The reply says what was
  done, and an "actions" list under it shows each call made: the tool, the
  arguments and the result.
- **MCP server.** The same tools are offered over the Model Context Protocol,
  one endpoint per application, so an assistant such as Claude can use them directly.
- **The applications it serves.** Conrad (accounting), Les Magasins (what's stored
  where), the product catalog, Rusty Skillet (recipes and meal plans) and the
  shopping list.
- **Names it learns.** Aliases map my words to the right record ("visa" to a
  particular account), and a memory service recalls context from earlier
  conversations.

## How it's built

- **Tools are data, not code.** Each endpoint Garçon can call is a row in
  PostgreSQL: its application, HTTP method and URL template, and one row per
  parameter with its type, description and whether it's required. Adding an
  application's endpoint is an insert, not a release.
- **Two steps per message.** First a short LLM call reads the message and
  picks the applications it concerns. Then only those applications' tools are offered, and the
  model fills each request from the tools' descriptions. Garçon builds the
  HTTP call from the row (path parameters into the URL template, the rest
  into the query string or the JSON body) and runs it, for up to ten rounds.
- **Your token, your permissions.** Calls go to each application with the user's own
  bearer token, so every application still applies its own authorization. Garçon
  can do only what the signed-in user could do.
- **Any model.** The LLM is configuration: Claude, OpenAI, or a local model
  through Ollama.
- **Rust throughout.** axum services for the chat API and the MCP server
  (rmcp, streamable HTTP), sqlx on PostgreSQL, and Leptos compiled to
  WebAssembly for the chat component and the admin screens. The chat is a
  library, so other applications' screens can embed it.

The source is private. The posts below show it working.
