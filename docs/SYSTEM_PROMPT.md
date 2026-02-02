# System Prompt Engineering Guide

## Overview

The system prompt tells the LLM how to behave. It includes:
1. Role description (scheduling assistant)
2. Response format rules (JSON with action type)
3. Available tools and their descriptions
4. Examples of correct responses

This document explains how prompts are structured and generated.

## System Prompt Structure

### Part A: Role and Behavior
```
You are a helpful scheduling assistant. You can respond in two ways:

1. ANSWER USER: When the user is asking a question or making conversation, respond with:
   {"action": "answer", "response": "your response text here"}

2. USE TOOL: When the user wants to check availability, schedule, or delete appointments, respond with:
   {"action": "tool", "tool": "toolName", "parameters": {"date": "ISO date string"}}
```

**Purpose**: Tells LLM its role and explains the two response types

### Part B: Available Tools
```
AVAILABLE TOOLS:

1. checkAvailability(date)
   - Checks if a time slot is available for scheduling
   - Parameters: date (required) - ISO format like "2024-04-03T10:00:00"
   - Returns: {"available": boolean}

2. scheduleAppointment(date)
   - Schedules an appointment for a specific date and time
   - Parameters: date (required) - ISO format like "2024-04-03T10:00:00"
   - Returns: {"success": boolean}

3. deleteAppointment(date)
   - Deletes an appointment for a specific date and time
   - Parameters: date (required) - ISO format like "2024-04-03T10:00:00"
   - Returns: {"success": boolean}

When user requests scheduling actions that match a tool, use the "tool" action type with correct tool name and parameters.
```

**Purpose**: Lists all available tools so LLM knows what it can do

## Prompt Generation Process

### How toolRegistry.generateToolsPrompt() Works

1. **Start with base text**: Role definition and response format
2. **Iterate tool definitions**: Read from toolsCache
3. **Format each tool**: Name, description, parameters, returns
4. **Combine**: Part A (role) + Part B (tools) + usage instructions
5. **Return**: Complete system prompt string

**Code Example:**
```javascript
export const generateToolsPrompt = () => {
    let prompt = `You are a helpful scheduling assistant...`;

    // Add each tool from cache
    Object.values(toolsCache).forEach((tool, index) => {
        const def = tool.definition;
        prompt += `\n${index + 1}. ${def.name}(date)
   - ${def.description}
   - Parameters: date (required) - ISO format like "2024-04-03T10:00:00"
   - Returns: ${JSON.stringify(def.returns)}`;
    });

    prompt += `\nWhen user requests scheduling actions...`;
    return prompt;
};
```

## Response Format Specification

### Action Type: "answer"
When user asks a question or makes conversation, respond with:

```json
{
  "action": "answer",
  "response": "Your direct response to the user's question"
}
```

**Examples:**
```json
{
  "action": "answer",
  "response": "Yes, I can help you with scheduling."
}

{
  "action": "answer",
  "response": "I can check availability, schedule appointments, and delete appointments for you."
}
```

### Action Type: "tool"
When user wants to perform a scheduling action, respond with:

```json
{
  "action": "tool",
  "tool": "checkAvailability",
  "parameters": {
    "date": "2024-04-03T10:00:00"
  }
}
```

**Examples:**
```json
{
  "action": "tool",
  "tool": "scheduleAppointment",
  "parameters": {
    "date": "2024-04-03T10:00:00"
  }
}

{
  "action": "tool",
  "tool": "deleteAppointment",
  "parameters": {
    "date": "2024-04-03T10:00:00"
  }
}
```

## Examples of Good Responses

### Example 1: Answer Action
**User says**: "What can you do?"

**Good response:**
```json
{
  "action": "answer",
  "response": "I can help you check availability, schedule appointments, and delete appointments."
}
```

**Why it's good:**
- Correct action type (answer)
- Clear, concise response
- Useful information
- Valid JSON format

### Example 2: Tool Action
**User says**: "Check if tomorrow at 10AM is available"

**Good response:**
```json
{
  "action": "tool",
  "tool": "checkAvailability",
  "parameters": {
    "date": "2024-04-04T10:00:00"
  }
}
```

**Why it's good:**
- Correct action type (tool)
- Exact tool name
- ISO format date
- Proper parameter structure

### Example 3: Context-Aware
**User says**: "Schedule an appointment for tomorrow at 2PM"

**Good response:**
```json
{
  "action": "tool",
  "tool": "scheduleAppointment",
  "parameters": {
    "date": "2024-04-04T14:00:00"
  }
}
```

**Why it's good:**
- Interprets "tomorrow at 2PM" correctly
- Converts to ISO 8601 format
- Uses appropriate tool
- Complete and valid

## Examples of Bad Responses

### Example 1: Wrong Action Format
**User says**: "Check availability for tomorrow"

**Bad response:**
```json
{
  "response": "Let me check that for you.",
  "available": true
}
```

**Problems:**
- Missing `action` field
- Not valid JSON format expected
- Mixes formats (not answer or tool)

**Fixed:**
```json
{
  "action": "tool",
  "tool": "checkAvailability",
  "parameters": {
    "date": "2024-04-04T00:00:00"
  }
}
```

### Example 2: Wrong Tool Name
**User says**: "Delete the appointment for tomorrow"

**Bad response:**
```json
{
  "action": "tool",
  "tool": "removeAppointment",
  "parameters": {
    "date": "2024-04-04T00:00:00"
  }
}
```

**Problems:**
- Tool name doesn't match (should be `deleteAppointment`)
- Will cause "Tool not found" error

**Fixed:**
```json
{
  "action": "tool",
  "tool": "deleteAppointment",
  "parameters": {
    "date": "2024-04-04T00:00:00"
  }
}
```

### Example 3: Missing or Invalid Date
**User says**: "Schedule an appointment"

**Bad response:**
```json
{
  "action": "tool",
  "tool": "scheduleAppointment",
  "parameters": {
    "date": ""
  }
}
```

**Problems:**
- Empty date parameter
- Tool will be called with empty string
- User request was incomplete

**Better:**
```json
{
  "action": "answer",
  "response": "I'd be happy to schedule an appointment. When would you like it to be?"
}
```

### Example 4: Wrong Parameter Format
**User says**: "Schedule for April 3rd at 10:30"

**Bad response:**
```json
{
  "action": "tool",
  "tool": "scheduleAppointment",
  "parameters": {
    "date": "April 3rd at 10:30"
  }
}
```

**Problems:**
- Date not in ISO format
- Human-readable but not ISO 8601
- Tool expects "2024-04-03T10:30:00"

**Fixed:**
```json
{
  "action": "tool",
  "tool": "scheduleAppointment",
  "parameters": {
    "date": "2024-04-03T10:30:00"
  }
}
```

## Prompt Engineering Tips

### Tip 1: Clear Tool Descriptions
**Bad**: "Does thing"
**Good**: "Checks if a time slot is available for scheduling"

Clear descriptions help LLM choose correct tool.

### Tip 2: Specific Parameter Instructions
**Bad**: Date parameter
**Good**: "Date and time in ISO format (e.g., "2024-04-03T10:00:00")"

Examples guide LLM behavior.

### Tip 3: Use Consistent Terminology
**Bad**: Mix "delete" and "remove" in descriptions
**Good**: Always use same verbs

Consistency reduces confusion.

### Tip 4: Add Usage Context
**Bad**: Just list tools
**Good**: "When user requests scheduling actions, use the appropriate tool"

Context helps LLM make good decisions.

### Tip 5: Be Explicit About When to Avoid Tools
**Missing**: Don't specify when NOT to use tools
**Good**: "ANSWER USER: When the user is asking a question or making conversation"

Explicit boundaries prevent misuse.

## Customizing Prompts

### Approach 1: Modify Generate Function
Edit `toolRegistry.js` `generateToolsPrompt()`:

```javascript
export const generateToolsPrompt = () => {
    let prompt = `Your custom base prompt here...`;
    // ... rest of generation
    return prompt;
};
```

**Pros**: Automatic, scales with new tools
**Cons**: Changes apply to all users

### Approach 2: Add Prefix/Suffix
In `agent.js`, modify prompt before first message:

```javascript
let systemPrompt = toolsPrompt;
systemPrompt = "Custom instruction... " + systemPrompt;
systemPrompt += " Additional instruction...";
```

**Pros**: Flexible, easy to experiment
**Cons**: Manual adjustments needed

### Approach 3: Per-Conversation Customization
Before first message, modify system prompt:

```javascript
if (messages.length === 0) {
    let customPrompt = toolsPrompt;
    // Add custom instructions based on context
    customPrompt += "\nSpecial instruction: ...";

    messages.push({
        role: 'user',
        parts: [{ text: customPrompt + '\n\n' + userInput }]
    });
}
```

**Pros**: Per-conversation customization
**Cons**: More complex implementation

## Debugging Prompt Issues

### Issue: LLM Ignores Tools
**Diagnosis**:
1. Check if tool names in prompt match response
2. Verify tool descriptions are clear
3. Test with explicit request: "Use the checkAvailability tool"

**Solution**: Make prompt clearer, add examples

### Issue: LLM Uses Wrong Tool
**Diagnosis**:
1. Tool descriptions might be similar
2. Tool names might be confusing
3. User request was ambiguous

**Solution**: Clarify tool descriptions, rename tools if needed

### Issue: LLM Returns Wrong Date Format
**Diagnosis**:
1. Example date format not clear enough
2. LLM may misinterpret natural language

**Solution**: Add more ISO format examples in prompt

### Issue: Responses Don't Match JSON Format
**Diagnosis**:
1. Prompt not clear about required fields
2. LLM hallucinating extra fields

**Solution**: Add complete JSON examples, emphasize required fields

## Future Considerations

- **Dynamic Prompt Generation**: Regenerate on tool changes
- **Prompt Versioning**: Track prompt changes over time
- **A/B Testing**: Test different prompts' effectiveness
- **Prompt Caching**: Cache prompt with LLM for faster responses
- **Multi-Language**: Support prompts in multiple languages
