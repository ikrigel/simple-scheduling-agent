/**
 * Delete an appointment for a specific date and time
 * @module tools/deleteAppointment
 */

export const toolDefinition = {
    name: 'deleteAppointment',
    description: 'Deletes an appointment for a specific date and time',
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
            success: { type: 'boolean' }
        }
    }
};

/**
 * Execute the deleteAppointment tool
 * @param {string} date - Date and time in ISO format
 * @returns {Object} Result with success status
 */
export const execute = (date) => {
    console.log("Deleting appointment for date:", date);
    return { success: true };
};
