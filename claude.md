# Simple Scheduling Agent

## Overview

This project implements a simple scheduling agent that demonstrates the core concepts of building an AI-powered agent. The agent communicates with Google's Gemini LLM through a terminal CLI interface, maintaining conversation context across multiple turns.

## Prerequisites

- Node.js 16+
- npm or yarn package manager
- Google Gemini API key (free tier available)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd simple-scheduling-agent-main
npm install
```

### 2. Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Google API key to `.env`:
```
GOOGLE_API_KEY=your_actual_api_key_here
```

To get a free API key:
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy and paste it into your `.env` file

## Running the Project

Start the agent:
```bash
node agent.js
```

You'll see a prompt to start typing. Have a conversation with the Gemini LLM!

### Example Interaction

```
You: Is the sky blue?
Gemini: The sky can appear blue during the day when the sun is shining and there are no clouds blocking it. This is because of the way light scatters in Earth's atmosphere.

You: Usually?
Gemini: Yes, usually the sky appears blue during the day. The brightness and shade of blue can vary depending on cloud cover and atmospheric conditions.
```

Notice how the LLM maintains context from your first message when you ask "Usually?" - this is the **Memory Loop** in action!

## Project Structure

- **agent.js** - Main conversation loop. Handles user input, sends it to the LLM, displays responses, and maintains conversation history.

- **cli-io.js** - Terminal input/output utilities. Provides the `getUserInput()` function for prompting the user in the terminal.

- **llmService.js** - LLM communication layer. Contains `askGeminiWithMessages()` which sends messages to Google Gemini API with conversation history.

- **.env** - Environment configuration file (ignored by git). Store your API key here.

- **.env.example** - Template for environment configuration. Copy this to `.env` and add your API key.

## Part 1: The Memory Loop

This project currently implements Part 1: **The Memory Loop**.

The memory loop enables a stateful conversation with the LLM:

1. Initialize an empty message history array
2. Enter an infinite loop:
   - Get user input from the terminal
   - Add the user message to the history array
   - Send the complete message history to the LLM
   - Display the LLM's response in the terminal
   - Add the LLM response to the history array
   - Repeat

The key insight: by maintaining and sending the entire message history with each request, the LLM can understand context from previous messages.

## Features

- **Colored Terminal Output** - Uses chalk library for easy-to-read colored prompts and responses
- **Context Awareness** - Conversation history is maintained in memory
- **Simple and Extensible** - Clean code structure ready for additional features

## Future Parts (from README)

- **Part 2: The Tools** - Add functions the LLM can call (e.g., `checkAvailability`, `scheduleAppointment`)
- **Part 3: Agent Finalization** - Implement automatic tool execution and multi-turn goal completion

## Troubleshooting

### "Cannot find module '@google/genai'"
Run `npm install` to ensure all dependencies are installed.

### "Error: Unable to locate JSON (object)"
This typically means the LLM returned a response that isn't valid JSON. Check your API key is valid and the LLM service is responding correctly.

### "GOOGLE_API_KEY is not defined"
1. Verify `.env` file exists in the project root
2. Verify `GOOGLE_API_KEY=` is set with your actual key (not empty)
3. Make sure you're running `node agent.js` from the project directory

### "readline is not defined"
Ensure you're using Node.js 16+ and that you have the correct imports in cli-io.js

## Dependencies

- `@google/genai` - Google Gemini API client
- `chalk` - Colorful terminal output
- `dotenv` - Environment variable management
- `json5` - JSON parsing with more flexible syntax

## License

ISC
