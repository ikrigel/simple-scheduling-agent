import { askGeminiWithMessages } from './llmService.js';
import { getUserInput } from './cli-io.js';
import chalk from 'chalk';
import { loadTools, generateToolsPrompt, executeTool } from './tools/toolRegistry.js';

async function main() {
    const messages = [];
    const MAX_AGENT_ITERATIONS = 10;

    // Initialize tools and generate system prompt
    console.log(chalk.gray('Loading tools...\n'));
    loadTools();
    const toolsPrompt = generateToolsPrompt();

    console.log(chalk.blue.bold('\n=== Simple Scheduling Agent - Part 3 ===\n'));
    console.log(chalk.gray('Type your message and press Enter. Type "exit" to quit.\n'));

    while (true) {
        try {
            // Get user input
            const userInput = await getUserInput(chalk.cyan('You: '));

            // Exit command
            if (userInput.toLowerCase() === 'exit') {
                console.log(chalk.yellow('\nGoodbye!\n'));
                process.exit(0);
            }

            // Skip empty input
            if (!userInput.trim()) {
                continue;
            }

            // Add user message to history (include system prompt on first turn)
            if (messages.length === 0) {
                messages.push({
                    role: 'user',
                    parts: [{ text: toolsPrompt + '\n\n' + userInput }]
                });
            } else {
                messages.push({
                    role: 'user',
                    parts: [{ text: userInput }]
                });
            }

            // Inner agent loop - execute tools until task is complete
            let agentIterations = 0;

            while (agentIterations < MAX_AGENT_ITERATIONS) {
                agentIterations++;

                // Get response from LLM
                const response = await askGeminiWithMessages(messages);

                // Handle response based on action type
                if (response.action === 'tool') {
                    // Tool execution path
                    try {
                        const toolResult = executeTool(response.tool, response.parameters);
                        // Tool already logged to console via its execute function

                        // Add model's tool request to messages
                        messages.push({
                            role: 'model',
                            parts: [{ text: JSON.stringify(response) }]
                        });

                        // Add tool result to messages (as user message for LLM to see)
                        messages.push({
                            role: 'user',
                            parts: [{ text: JSON.stringify({
                                toolResult: toolResult,
                                toolName: response.tool
                            })}]
                        });

                        // Continue inner loop to let LLM decide next action
                    } catch (error) {
                        console.error(chalk.red(`Tool error: ${error.message}\n`));

                        // Send error to LLM for handling
                        messages.push({
                            role: 'model',
                            parts: [{ text: JSON.stringify(response) }]
                        });
                        messages.push({
                            role: 'user',
                            parts: [{ text: JSON.stringify({
                                error: error.message,
                                toolName: response.tool
                            })}]
                        });
                    }

                } else if (response.action === 'finished') {
                    // Task complete - display final response and exit agent loop
                    const responseText = response.response || 'Task completed';
                    console.log(chalk.green(`Gemini: ${responseText}\n`));

                    // Add to message history
                    messages.push({
                        role: 'model',
                        parts: [{ text: JSON.stringify(response) }]
                    });

                    break; // Exit inner agent loop

                } else if (response.action === 'answer') {
                    // Simple conversation - display and exit agent loop
                    const responseText = response.response || 'No response';
                    console.log(chalk.green(`Gemini: ${responseText}\n`));

                    // Add to message history
                    messages.push({
                        role: 'model',
                        parts: [{ text: JSON.stringify(response) }]
                    });

                    break; // Exit inner agent loop
                }

                // Safety check - prevent infinite loops
                if (agentIterations === MAX_AGENT_ITERATIONS) {
                    console.error(chalk.red('Agent reached maximum iterations. Stopping.\n'));
                    break;
                }
            }

        } catch (error) {
            console.error(chalk.red(`Error: ${error.message}\n`));
        }
    }
}

main();
