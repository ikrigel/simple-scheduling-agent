# Tools API Reference - Creating and Using Tools

## Tool File Structure

Every tool is a standalone JavaScript module (ES6) with two main exports:

```javascript
// tools/myTool.js

export const toolDefinition = { /* metadata */ };
export const execute = (date) => { /* implementation */ };
```

## Tool Definition Schema

The `toolDefinition` object must contain:

```javascript
{
  name: string,           // Unique tool identifier (used by LLM)
  description: string,    // Human-readable description
  parameters: {           // Input parameters
    date: {
      type: 'string',
      description: 'Parameter explanation',
      required: true
    }
  },
  returns: {             // Output specification
    type: 'object',
    properties: {
      fieldName: { type: 'boolean' | 'string' | 'object' }
    }
  }
}
```

## Complete Tool Example

### checkAvailability.js
```javascript
/**
 * Check availability for a specific date and time
 * @module tools/checkAvailability
 */

export const toolDefinition = {
    name: 'checkAvailability',
    description: 'Checks if a time slot is available for scheduling',
    parameters: {
        date: {
            type: 'string',
            description: 'Date and time in ISO format (e.g., "2024-04-03T10:00:00")',
            required: true
        }
    },
    returns: {
        type: 'object',
        properties: {
            available: { type: 'boolean' }
        }
    }
};

/**
 * Execute the checkAvailability tool
 * @param {string} date - Date and time in ISO format
 * @returns {Object} Result with availability status
 */
export const execute = (date) => {
    console.log("Checking availability for date:", date);
    return { available: true };
};
```

## Creating a New Tool - Step by Step

### Step 1: Create the File
Create a new file in `tools/` folder:
```bash
touch tools/myNewTool.js
```

### Step 2: Export Tool Definition
```javascript
export const toolDefinition = {
    name: 'myNewTool',
    description: 'What this tool does',
    parameters: {
        date: {
            type: 'string',
            description: 'Date in ISO format',
            required: true
        }
    },
    returns: {
        type: 'object',
        properties: {
            success: { type: 'boolean' }
        }
    }
};
```

### Step 3: Implement Execute Function
```javascript
export const execute = (date) => {
    console.log("Doing something with:", date);
    return { success: true };
};
```

### Step 4: Register Tool in toolRegistry.js
Add to imports:
```javascript
import * as myNewTool from './myNewTool.js';
```

Add to toolModules array:
```javascript
const toolModules = [
    checkAvailability,
    scheduleAppointment,
    deleteAppointment,
    myNewTool  // Add here
];
```

### Step 5: Test the Tool
```bash
node -e "import('./tools/toolRegistry.js').then(m => console.log(m.listTools()))"
# Should output: ['checkAvailability', 'scheduleAppointment', 'deleteAppointment', 'myNewTool']
```

## Parameter Types and Validation

All Part 2 tools use `date` parameter with ISO 8601 format:
```
"2024-04-03T10:00:00"
```

**Supported Parameter Types:**
- `string`: Text data (dates, names, descriptions)
- `number`: Numeric values
- `boolean`: True/false flags
- `array`: Lists of values
- `object`: Complex structured data

**Note**: Part 2 only uses `string` for date parameters. Add more parameter types as needed for future tools.

## Return Value Conventions

### Simple Boolean Return
```javascript
return { success: true };
return { available: true };
return { completed: false };
```

### Status with Message
```javascript
return {
  success: true,
  message: "Appointment scheduled for April 3rd at 10:00 AM"
};
```

### Complex Data Return
```javascript
return {
  success: true,
  data: {
    appointmentId: '12345',
    dateTime: '2024-04-03T10:00:00',
    confirmed: true
  }
};
```

## Console Logging Best Practices

Log information that helps users understand what happened:

```javascript
// Good: Clear, informative
console.log("Checking availability for date:", date);
console.log("Scheduling appointment for date:", date);
console.log("Deleting appointment for date:", date);

// Avoid: Too verbose
console.log("Entered checkAvailability with param:", date);
console.log("About to execute database query...");

// Avoid: Unclear
console.log("Processing...");
console.log("Done");
```

## Tool Naming Conventions

- **camelCase** for file names and tool names: `checkAvailability`, `scheduleAppointment`
- **Descriptive**: `checkAvailability` not `check` or `availability`
- **Verb-first**: `scheduleAppointment` not `appointmentSchedule`
- **Single word descriptors**: `deleteAppointment` not `removeDeleteAppointment`

## Testing Tools Manually

### Test 1: Tool Registry Loading
```bash
node -e "import('./tools/toolRegistry.js').then(m => {
  console.log('Tools loaded:', m.listTools());
})"
```

Expected output:
```
Tools loaded: [ 'checkAvailability', 'scheduleAppointment', 'deleteAppointment' ]
```

### Test 2: Direct Tool Execution
```bash
node -e "import('./tools/checkAvailability.js').then(m => {
  const result = m.execute('2024-04-03T10:00:00');
  console.log('Result:', result);
})"
```

Expected output:
```
Checking availability for date: 2024-04-03T10:00:00
Result: { available: true }
```

### Test 3: Tool Registry Execution
```bash
node -e "import('./tools/toolRegistry.js').then(m => {
  m.loadTools();
  const result = m.executeTool('checkAvailability', {date: '2024-04-03T10:00:00'});
  console.log('Result:', result);
})"
```

Expected output:
```
Checking availability for date: 2024-04-03T10:00:00
Result: { available: true }
```

### Test 4: Full Agent Integration
```bash
node agent.js
```

Type: "check availability for tomorrow at 10AM"

Expected output:
```
Checking availability for date: 2024-04-03T10:00:00
(console prompt returns)
```

## Common Patterns

### Pattern 1: Simple Status Check
```javascript
export const execute = (date) => {
    console.log("Checking something for:", date);
    return { available: true };
};
```

### Pattern 2: With Conditional Logic
```javascript
export const execute = (date) => {
    const hour = new Date(date).getHours();
    const available = hour >= 9 && hour < 17;

    console.log("Checking availability for date:", date);
    return { available };
};
```

### Pattern 3: Simulated Database Call
```javascript
export const execute = (date) => {
    // In real implementation, would query database
    const appointments = new Map();
    const isBooked = appointments.has(date);

    console.log("Checking availability for date:", date);
    return { available: !isBooked };
};
```

### Pattern 4: With Validation
```javascript
export const execute = (date) => {
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid date format');
        }

        console.log("Scheduling appointment for date:", date);
        return { success: true };
    } catch (error) {
        console.error("Error:", error.message);
        return { success: false, error: error.message };
    }
};
```

## Troubleshooting

### "Tool not found" Error
**Problem**: Tool exists but registry doesn't find it
**Solution**:
1. Check tool is imported in toolRegistry.js
2. Check tool is added to toolModules array
3. Check toolDefinition.name matches LLM's tool call

### Tool Not Appearing in System Prompt
**Problem**: Created tool but prompt doesn't mention it
**Solution**:
1. Verify tool is in toolModules array
2. Call `generateToolsPrompt()` to regenerate
3. Check toolDefinition has required fields

### LLM Not Using Tool
**Problem**: LLM responds with answer instead of calling tool
**Solution**:
1. Tool name in definition must be clear: `name: 'toolName'`
2. Tool description should be specific about when to use it
3. System prompt auto-generated - regenerate after tool changes
4. May need to request tool call explicitly in user message

### Tool Execution Fails
**Problem**: Tool runs but returns error
**Solution**:
1. Check parameters match toolDefinition
2. Verify execute function handles all cases
3. Add error handling try-catch block
4. Log intermediate steps for debugging

## File Size Limits

Each tool file should be:
- **Ideal**: 25-35 lines
- **Maximum**: 250 lines
- Includes: definition + execute + documentation

Keeping tools small makes them:
- Easy to understand and test
- Simple to modify
- Maintainable for team collaboration

## Next Steps

- Create 3-5 new tools following this guide
- Test each with manual tests
- Verify they appear in system prompt
- Use them with the agent via natural language requests
