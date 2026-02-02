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
