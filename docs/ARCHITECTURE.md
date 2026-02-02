# System Architecture - Simple Scheduling Agent

## Overview

The Simple Scheduling Agent is a multi-part project demonstrating AI agent capabilities with an LLM. Part 2 adds a tool system where the LLM can decide when to execute functions vs. provide direct answers.

**System Flow:**
```
User Input → Agent → LLM → Decision → Action
                              ├── Answer (respond directly)
                              └── Tool (execute function)
```

## Component Breakdown

### 1. **agent.js** - Main Agent Loop
- **Responsibility**: Orchestrates the conversation flow
- **Key Tasks**:
  - Initializes tools and system prompt at startup
  - Accepts user input from terminal (cli-io.js)
  - Sends messages to LLM with context (llmService.js)
  - Detects response type (answer vs. tool)
  - Executes tools if needed (toolRegistry.js)
  - Maintains conversation history in memory

**Key Variables:**
- `messages`: Array of conversation history (user and model messages)
- `toolsPrompt`: System prompt describing available tools
- `response`: LLM response containing action and data

### 2. **cli-io.js** - Terminal Interface
- **Responsibility**: Handles user input/output from terminal
- **Exports**: `getUserInput(question)` function
- **Function**: Prompts user and returns their text input
- **Used by**: agent.js

### 3. **llmService.js** - LLM Communication
- **Responsibility**: Communicates with Google Gemini API
- **Key Functions**:
  - `askGeminiWithMessages(messages)`: Sends conversation to LLM
  - `parseJSONFromString(result, type)`: Extracts JSON from LLM response
- **Input**: Array of message objects with role and content
- **Output**: Parsed JSON object (response or tool call)
- **Error Handling**: Logs JSON parsing errors with context

### 4. **tools/toolRegistry.js** - Tool Management
- **Responsibility**: Central tool system orchestrator
- **Key Functions**:
  - `loadTools()`: Cache and initialize all tools
  - `generateToolsPrompt()`: Create system prompt describing tools
  - `executeTool(name, params)`: Run tool by name with parameters
  - `getToolDefinition(name)`: Retrieve tool metadata
  - `listTools()`: Get array of available tool names

**Architecture**: Tools loaded at module import time and cached in memory.

### 5. **tools/checkAvailability.js, scheduleAppointment.js, deleteAppointment.js**
- **Responsibility**: Individual tool implementations
- **Exports**:
  - `toolDefinition`: Metadata (name, description, parameters, returns)
  - `execute(date)`: Function that performs the action
- **Output**: Logs to console + returns result object
- **Pattern**: All tools follow identical structure for consistency

## Data Flow

### User Input → LLM → Response

**Step 1: User Input**
```javascript
User types: "check availability for tomorrow at 10AM"
agent.js receives input string
```

**Step 2: Message Formatting**
```javascript
Message object created:
{
  role: 'user',
  parts: [{ text: 'check availability for tomorrow at 10AM' }]
}
```

**Step 3: System Prompt (First Turn Only)**
```javascript
First message includes system prompt:
{
  role: 'user',
  parts: [{ text: '[tool descriptions...]\n\n[user message]' }]
}
```

**Step 4: LLM Call**
```javascript
messages array passed to llmService.askGeminiWithMessages()
LLM reads system prompt + conversation history
LLM generates JSON response
```

**Step 5: LLM Response**
```javascript
LLM returns:
{
  action: 'tool',
  tool: 'checkAvailability',
  parameters: {
    date: '2024-04-03T10:00:00'
  }
}
```

**Step 6: Response Type Detection**
```javascript
agent.js checks response.action:
- If 'tool' → execute tool
- If 'answer' → display Gemini response
```

**Step 7: Tool Execution**
```javascript
toolRegistry.executeTool('checkAvailability', { date: '2024-04-03T10:00:00' })
checkAvailability.execute() runs
Logs: "Checking availability for date: 2024-04-03T10:00:00"
Returns: { available: true }
```

**Step 8: History Update**
```javascript
Full response added to messages:
{
  role: 'model',
  parts: [{ text: '{"action":"tool",...}' }]
}
```

## Message History Format

Each message object in the `messages` array:
```javascript
{
  role: 'user' | 'model',
  parts: [
    { text: 'message content' }
  ]
}
```

**History Example After 2 Turns:**
```javascript
messages = [
  {
    role: 'user',
    parts: [{ text: '[system prompt]\n\nHello' }]
  },
  {
    role: 'model',
    parts: [{ text: '{"action":"answer","response":"Hi there!"}' }]
  },
  {
    role: 'user',
    parts: [{ text: 'check availability tomorrow at 10AM' }]
  },
  {
    role: 'model',
    parts: [{ text: '{"action":"tool","tool":"checkAvailability","parameters":{"date":"2024-04-03T10:00:00"}}' }]
  }
]
```

## Response Format Specification

### Answer Response
```json
{
  "action": "answer",
  "response": "This is what Gemini wants to say"
}
```

### Tool Response
```json
{
  "action": "tool",
  "tool": "checkAvailability",
  "parameters": {
    "date": "2024-04-03T10:00:00"
  }
}
```

## Tool System Architecture

### Tool Loading Process

1. **Module Import** (toolRegistry.js)
   - Imports all tool files with `import * as`
   - Tools cached immediately at load time

2. **Tool Registration**
   ```javascript
   toolsCache = {
     'checkAvailability': { definition: {...}, execute: function },
     'scheduleAppointment': { definition: {...}, execute: function },
     'deleteAppointment': { definition: {...}, execute: function }
   }
   ```

3. **Prompt Generation**
   - `generateToolsPrompt()` reads all tool definitions
   - Creates human-readable tool descriptions
   - Includes examples of response format

### Tool Execution Process

1. LLM responds with tool action
2. `agent.js` calls `toolRegistry.executeTool(toolName, params)`
3. Registry looks up tool in cache
4. Tool's `execute()` function runs
5. Tool logs to console + returns result
6. Response stored in history

## Error Handling Strategy

### Tool Execution Errors
```javascript
try {
  executeTool(response.tool, response.parameters);
} catch (error) {
  console.error(chalk.red(`Tool error: ${error.message}`));
}
```

**Errors handled:**
- Tool not found → `"Tool not found: [name]"`
- Missing parameters → Tool's execute() handles
- Tool function errors → Caught and logged

### LLM Response Errors
```javascript
catch (error) {
  console.error(chalk.red(`Error: ${error.message}`));
}
```

**Errors handled:**
- JSON parsing failures (llmService.js)
- API connection errors
- Malformed responses

## Design Decisions

### 1. Synchronous Tool Execution
**Decision**: Tools execute synchronously in Part 2
**Rationale**: Simple tools that log and return (no async operations)
**Future**: Part 3 may handle async tools

### 2. Tool Result Handling
**Decision**: Tool results logged directly, not shown via LLM
**Rationale**: Part 2 focuses on tool detection/execution, not result synthesis
**Future**: Part 3 will send results back to LLM

### 3. System Prompt Generation
**Decision**: Prompt auto-generated from tool definitions
**Rationale**: Single source of truth, easier to add tools
**Trade-off**: Can't manually customize prompt per turn

### 4. Message History Storage
**Decision**: Full JSON responses stored as strings in history
**Rationale**: LLM can see exact format, helps with context
**Future**: Could optimize by storing structured data

### 5. Tool Registry Caching
**Decision**: Tools imported once at module load, cached forever
**Rationale**: Tools don't change during conversation
**Trade-off**: Can't dynamically add tools after startup

## Module Dependencies

```
agent.js
├── llmService.js (LLM communication)
├── cli-io.js (user input)
├── chalk (colors)
└── tools/toolRegistry.js
    ├── tools/checkAvailability.js
    ├── tools/scheduleAppointment.js
    └── tools/deleteAppointment.js
```

## Future Extensibility - Preparing for Part 3

**Tool Result Feedback Loop:**
- Response format already structured for tool results
- Can add `"result"` field to response objects
- LLM can synthesize final answer from tool outputs

**Sub-Agent Loop:**
- Response format supports adding `"finished"` action
- Agent can detect completion and return to user input
- Supports multi-turn tool execution

**Enhanced State Management:**
- Tool results stored in message history
- Conversation context preserved across loops
- Ready for complex multi-step tasks

## Potential Improvements

1. **Date Parsing**: Add date parser utility for better error handling
2. **Tool Validation**: Add schema validation for tool parameters
3. **Tool Results**: Include result in response for synthesis
4. **Async Support**: Update to support async tool execution
5. **Tool State**: Add ability to modify tool behavior dynamically
6. **Telemetry**: Log tool calls and execution times
7. **Caching**: Cache LLM responses for identical queries
