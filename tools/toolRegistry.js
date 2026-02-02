/**
 * Tool Registry - Manages tool loading, registration, and execution
 * @module tools/toolRegistry
 */

import * as checkAvailability from './checkAvailability.js';
import * as scheduleAppointment from './scheduleAppointment.js';
import * as deleteAppointment from './deleteAppointment.js';

// Cache for loaded tools
const toolsCache = {};

// Load tools immediately
const toolModules = [checkAvailability, scheduleAppointment, deleteAppointment];

toolModules.forEach((module) => {
    const { toolDefinition, execute } = module;
    toolsCache[toolDefinition.name] = {
        definition: toolDefinition,
        execute: execute
    };
});

/**
 * Load all tools (already cached on import)
 * @returns {Object} Cached tools object
 */
export const loadTools = () => {
    return toolsCache;
};

/**
 * Generate system prompt with tool descriptions
 * @returns {string} System prompt with tool information
 */
export const generateToolsPrompt = () => {
    let prompt = `You are a helpful scheduling assistant. You can respond in three ways:

1. ANSWER USER (for conversation only): When the user is asking a question or making conversation, respond with:
   {"action": "answer", "response": "your response text here"}

2. USE TOOL (to take an action): When you need to check availability, schedule, or delete appointments, respond with:
   {"action": "tool", "tool": "toolName", "parameters": {"date": "ISO date string"}}

3. FINISHED (when task is complete): When you have completed all necessary tool calls and are ready to give the final response to the user, respond with:
   {"action": "finished", "response": "your final response text here. I'm finished."}

IMPORTANT GUIDELINES:
- You can call multiple tools in sequence. After each tool call, you will receive the result and can decide the next action.
- Tool results are provided to you in this format: {"toolResult": {...}, "toolName": "toolName"}
- Use "tool" action to continue working, use "finished" action when done.
- Always check availability before scheduling an appointment.
- When rescheduling/moving appointments, delete the old one first, check availability, then schedule the new one.

AVAILABLE TOOLS:
`;

    // Add tool descriptions from definitions
    Object.values(toolsCache).forEach((tool, index) => {
        const def = tool.definition;
        prompt += `\n${index + 1}. ${def.name}(date)
   - ${def.description}
   - Parameters: date (required) - ISO format like "2024-04-03T10:00:00"
   - Returns: ${JSON.stringify(def.returns)}`;
    });

    prompt += `\n\nRemember: Use "tool" to execute actions, "finished" when the task is complete and you're ready to respond to the user.`;

    return prompt;
};

/**
 * Execute a tool by name with parameters
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} params - Parameters object with date field
 * @returns {*} Result from tool execution
 * @throws {Error} If tool not found
 */
export const executeTool = (toolName, params) => {
    if (!toolsCache[toolName]) {
        throw new Error(`Tool not found: ${toolName}`);
    }

    const tool = toolsCache[toolName];
    return tool.execute(params.date);
};

/**
 * Get tool definition by name
 * @param {string} toolName - Name of the tool
 * @returns {Object} Tool definition object
 */
export const getToolDefinition = (toolName) => {
    if (!toolsCache[toolName]) {
        throw new Error(`Tool not found: ${toolName}`);
    }
    return toolsCache[toolName].definition;
};

/**
 * List all available tool names
 * @returns {Array<string>} Array of tool names
 */
export const listTools = () => {
    return Object.keys(toolsCache);
};
