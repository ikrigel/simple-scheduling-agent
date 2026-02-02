# Usage Examples - Real Scheduling Agent Interactions

## Example 1: Basic Greeting

**User**: "Hello"

**LLM Response**:
```json
{"action": "answer", "response": "Hello! I'm a scheduling assistant. I can help you check availability, schedule appointments, and delete appointments."}
```

**Terminal Output**:
```
You: Hello
Gemini: Hello! I'm a scheduling assistant. I can help you check availability, schedule appointments, and delete appointments.
```

**What Happened**:
- User entered text
- LLM chose "answer" action
- Agent displayed response in green
- Loop continues

---

## Example 2: Check Availability

**User**: "check availability for tomorrow at 10AM"

**LLM Response**:
```json
{"action": "tool", "tool": "checkAvailability", "parameters": {"date": "2024-04-04T10:00:00"}}
```

**Terminal Output**:
```
You: check availability for tomorrow at 10AM
Checking availability for date: 2024-04-04T10:00:00
```

**What Happened**:
- User asked to check availability
- LLM generated tool action
- Tool executed and logged to console
- No "Gemini: " response shown
- Loop continues

---

## Example 3: Schedule Appointment

**User**: "schedule an appointment for tomorrow at 2PM"

**LLM Response**:
```json
{"action": "tool", "tool": "scheduleAppointment", "parameters": {"date": "2024-04-04T14:00:00"}}
```

**Terminal Output**:
```
You: schedule an appointment for tomorrow at 2PM
Scheduling appointment for date: 2024-04-04T14:00:00
```

**What Happened**:
- User requested appointment scheduling
- LLM decided to use scheduleAppointment tool
- Tool logged the action
- Agent continued to next input

---

## Example 4: Delete Appointment

**User**: "delete the appointment for tomorrow at 2PM"

**LLM Response**:
```json
{"action": "tool", "tool": "deleteAppointment", "parameters": {"date": "2024-04-04T14:00:00"}}
```

**Terminal Output**:
```
You: delete the appointment for tomorrow at 2PM
Deleting appointment for date: 2024-04-04T14:00:00
```

**What Happened**:
- User requested deletion
- LLM parsed "tomorrow at 2PM" to ISO format
- Tool executed successfully
- Loop ready for next command

---

## Example 5: Mixed Interaction

**Complete conversation** showing answer and tool modes:

**User**: "What tools do you have?"

**LLM Response**:
```json
{"action": "answer", "response": "I have three tools: checkAvailability to check if a time slot is free, scheduleAppointment to schedule a new appointment, and deleteAppointment to remove an existing appointment."}
```

**Terminal Output**:
```
You: What tools do you have?
Gemini: I have three tools: checkAvailability to check if a time slot is free, scheduleAppointment to schedule a new appointment, and deleteAppointment to remove an existing appointment.
```

**User**: "Is 3PM tomorrow available?"

**LLM Response**:
```json
{"action": "tool", "tool": "checkAvailability", "parameters": {"date": "2024-04-04T15:00:00"}}
```

**Terminal Output**:
```
You: Is 3PM tomorrow available?
Checking availability for date: 2024-04-04T15:00:00
```

**User**: "Schedule me for that time"

**LLM Response**:
```json
{"action": "tool", "tool": "scheduleAppointment", "parameters": {"date": "2024-04-04T15:00:00"}}
```

**Terminal Output**:
```
You: Schedule me for that time
Scheduling appointment for date: 2024-04-04T15:00:00
```

---

## Example 6: Natural Language Parsing

**User**: "Can you check if April 20th at 9:30am is free?"

**LLM Response**:
```json
{"action": "tool", "tool": "checkAvailability", "parameters": {"date": "2024-04-20T09:30:00"}}
```

**Terminal Output**:
```
You: Can you check if April 20th at 9:30am is free?
Checking availability for date: 2024-04-20T09:30:00
```

**What Happened**:
- User provided natural language date
- LLM parsed to ISO format
- Tool executed with correct parameters
- Shows LLM's date interpretation ability

---

## Example 7: Follow-up Without Re-context

**User**: "What time is it now?"

**LLM Response**:
```json
{"action": "answer", "response": "I don't have real-time capabilities, but I can help you manage appointments!"}
```

**Terminal Output**:
```
You: What time is it now?
Gemini: I don't have real-time capabilities, but I can help you manage appointments!
```

**User**: "OK, check availability for next Monday at 9AM"

**LLM Response**:
```json
{"action": "tool", "tool": "checkAvailability", "parameters": {"date": "2024-04-08T09:00:00"}}
```

**Terminal Output**:
```
You: OK, check availability for next Monday at 9AM
Checking availability for date: 2024-04-08T09:00:00
```

**What Happened**:
- LLM used conversation history
- Understood context from previous exchange
- Seamlessly switched between answer and tool modes

---

## Example 8: Multiple Sequential Operations

**User**: "I need to reschedule my appointment from 2PM to 4PM tomorrow"

**LLM Response 1**:
```json
{"action": "tool", "tool": "deleteAppointment", "parameters": {"date": "2024-04-04T14:00:00"}}
```

**Terminal Output**:
```
You: I need to reschedule my appointment from 2PM to 4PM tomorrow
Deleting appointment for date: 2024-04-04T14:00:00
```

**User**: "Now schedule me for 4PM tomorrow"

**LLM Response 2**:
```json
{"action": "tool", "tool": "scheduleAppointment", "parameters": {"date": "2024-04-04T16:00:00"}}
```

**Terminal Output**:
```
You: Now schedule me for 4PM tomorrow
Scheduling appointment for date: 2024-04-04T16:00:00
```

**What Happened**:
- First interaction deleted appointment
- Second interaction scheduled new one
- User had to provide commands separately (Part 3 will automate this)

---

## Example 9: Ambiguous Request

**User**: "Schedule an appointment"

**LLM Response**:
```json
{"action": "answer", "response": "I'd be happy to schedule an appointment for you! Could you please provide the date and time you'd like?"}
```

**Terminal Output**:
```
You: Schedule an appointment
Gemini: I'd be happy to schedule an appointment for you! Could you please provide the date and time you'd like?
```

**What Happened**:
- User request was incomplete
- LLM recognized missing information
- Responded with answer mode, not tool
- Prompted user for clarification

---

## Example 10: Error Handling - Exit Command

**User**: "exit"

**Terminal Output**:
```
You: exit

Goodbye!
```

**What Happened**:
- Agent detected exit command
- Printed goodbye message
- Process terminated cleanly
- Exit code 0

---

## Example 11: Empty Input Handling

**User**: (presses Enter with no text)

**Terminal Output**:
```
You:
(no response, waits for next input)
```

**What Happened**:
- Agent detected empty input
- Skipped processing (no message sent to LLM)
- Loop continued immediately

---

## Example 12: Multiple Dates in One Request

**User**: "Check 10AM tomorrow, 2PM tomorrow, and 4PM tomorrow"

**LLM Response** (note: depends on LLM interpretation):
```json
{"action": "tool", "tool": "checkAvailability", "parameters": {"date": "2024-04-04T10:00:00"}}
```

**Terminal Output**:
```
You: Check 10AM tomorrow, 2PM tomorrow, and 4PM tomorrow
Checking availability for date: 2024-04-04T10:00:00
```

**What Happened**:
- LLM picked first date
- Didn't use multiple tools in single response (Part 3 feature)
- User would need to ask about other times separately

---

## Example 13: Question About Tools

**User**: "How do I use the scheduleAppointment tool?"

**LLM Response**:
```json
{"action": "answer", "response": "The scheduleAppointment tool creates a new appointment for a specific date and time. Just tell me when you want to schedule it, like 'Schedule me for tomorrow at 3PM' and I'll create the appointment for you."}
```

**Terminal Output**:
```
You: How do I use the scheduleAppointment tool?
Gemini: The scheduleAppointment tool creates a new appointment for a specific date and time. Just tell me when you want to schedule it, like 'Schedule me for tomorrow at 3PM' and I'll create the appointment for you.
```

---

## Troubleshooting Scenarios

### Scenario 1: Tool Returns Error

**User**: "Schedule for tomorrow at infinity o'clock"

**What Happens**:
1. LLM tries to parse "infinity o'clock"
2. May generate invalid date or ask for clarification
3. If invalid date sent to tool, tool logs it anyway
4. Agent catches any errors

**Terminal Output**:
```
You: Schedule for tomorrow at infinity o'clock
(either tool executes with weird date, or LLM asks for clarification)
```

### Scenario 2: LLM Misunderstands

**User**: "Schedule an appointment for the time I usually wake up"

**Possible Responses**:
1. LLM asks for clarification
2. LLM makes a guess (e.g., 8AM)
3. LLM responds with answer about needing more info

**Terminal Output**:
```
You: Schedule an appointment for the time I usually wake up
Gemini: I don't have information about when you usually wake up. Could you tell me a specific time?
```

**What to Do**: Provide specific time next message

### Scenario 3: Very Long Conversation

After many exchanges, conversation history grows. This is fine for Part 2 (in-memory only). Token usage will increase with LLM API.

**Performance**: Remains fast until conversation is very long (100+ turns)

### Scenario 4: Special Characters in Input

**User**: "Schedule @#$%"

**What Happens**:
- Input accepted as-is
- Sent to LLM
- LLM likely responds with answer (not tool call)
- No special handling needed

### Scenario 5: Very Long Input

**User**: (pastes 10,000 word essay)

**What Happens**:
- Input accepted
- Sent to LLM
- LLM processes (may truncate internally)
- Response generated

---

## Common Patterns

### Pattern 1: Check Then Schedule
```
You: Is 2PM tomorrow available?
Checking availability for date: 2024-04-04T14:00:00

You: Schedule me for that time
Scheduling appointment for date: 2024-04-04T14:00:00
```

### Pattern 2: Reschedule
```
You: Delete tomorrow at 10AM
Deleting appointment for date: 2024-04-04T10:00:00

You: Schedule me for tomorrow at 2PM instead
Scheduling appointment for date: 2024-04-04T14:00:00
```

### Pattern 3: Conversation Plus Action
```
You: What can I do with appointments?
Gemini: I can check availability, schedule, and delete appointments.

You: Check for tomorrow at 3PM
Checking availability for date: 2024-04-04T15:00:00
```

---

## Tips for Best Results

1. **Be Specific with Dates**: "tomorrow at 2PM" works better than "later today"
2. **Clear Requests**: "Schedule an appointment" needs date; "Schedule for tomorrow at 3PM" is complete
3. **Natural Language**: You can use informal language; LLM handles conversion
4. **One Action at a Time**: "Schedule and delete" in one message might only execute one
5. **Verify Success**: Check console output to confirm tool executed

---

## Summary

The Simple Scheduling Agent with Part 2 tools successfully:
- ✅ Accepts natural language scheduling requests
- ✅ Understands context from conversation history
- ✅ Switches between answering and executing tools
- ✅ Logs tool execution clearly
- ✅ Maintains conversation context
- ✅ Handles errors gracefully

Part 3 will add automatic multi-turn execution and result synthesis.
