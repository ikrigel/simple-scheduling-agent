# Test Scenario - Interactive Testing Guide

## Overview

This guide provides a complete test scenario you can follow to thoroughly test Part 2 of the Simple Scheduling Agent. The scenario simulates a realistic appointment scheduling workflow.

## Before You Start

1. **Start the agent:**
   ```bash
   node agent.js
   ```

2. **Expected startup output:**
   ```
   Loading tools...

   === Simple Scheduling Agent with Tools ===

   Type your message and press Enter. Type "exit" to quit.

   You:
   ```

3. **Follow each step below** and verify the output matches expectations

---

## Test Scenario: Weekly Appointment Scheduling

**Scenario**: You're trying to schedule 3 appointments next week and need to check availability first.

---

## Step 1: Greeting and Discovery

**What to Type:**
```
Hello! What can you help me with today?
```

**Expected Output:**
```
You: Hello! What can you help me with today?
Gemini: I can help you check availability, schedule appointments, and delete appointments. How can I assist you today?
```

**What's Happening:**
- LLM responds in "answer" action mode
- Shows understanding of available capabilities
- Ready for appointment requests
- No tool is executed

**✓ Check**: Greeting was understood and responded to appropriately

---

## Step 2: Check Availability - First Slot

**What to Type:**
```
Is Monday at 10:00 AM available?
```

**Expected Output:**
```
You: Is Monday at 10:00 AM available?
Checking availability for date: 2024-04-08T10:00:00
```

**What's Happening:**
- LLM detects "check availability" intent
- Converts "Monday at 10:00 AM" to ISO format (2024-04-08T10:00:00)
- Executes checkAvailability tool
- Tool logs to console directly
- No "Gemini:" response shown (tool execution only)
- Loop returns to prompt for next input

**✓ Check**: Tool was executed and logged to console

---

## Step 3: Schedule First Appointment

**What to Type:**
```
Great! Schedule me for Monday at 10:00 AM
```

**Expected Output:**
```
You: Great! Schedule me for Monday at 10:00 AM
Scheduling appointment for date: 2024-04-08T10:00:00
```

**What's Happening:**
- LLM understands scheduling request
- Uses scheduleAppointment tool
- Correctly interprets the date/time
- Tool executes and logs
- Appointment scheduled (simulated)

**✓ Check**: Appointment scheduling worked correctly

---

## Step 4: Check Availability - Second Slot

**What to Type:**
```
How about Wednesday at 2:30 PM?
```

**Expected Output:**
```
You: How about Wednesday at 2:30 PM?
Checking availability for date: 2024-04-10T14:30:00
```

**What's Happening:**
- LLM uses conversation context ("How about")
- Understands you're still checking availability
- Converts "Wednesday at 2:30 PM" to ISO format
- Executes checkAvailability again

**✓ Check**: Context from previous conversation is retained

---

## Step 5: Schedule Second Appointment

**What to Type:**
```
Perfect! Let's book that one too
```

**Expected Output:**
```
You: Perfect! Let's book that one too
Scheduling appointment for date: 2024-04-10T14:30:00
```

**What's Happening:**
- LLM uses context ("that one" = Wednesday 2:30 PM)
- Remembers the date from previous check
- Schedules without needing you to repeat the time
- Shows LLM's understanding of conversation flow

**✓ Check**: LLM remembers conversation context correctly

---

## Step 6: Query About Tools

**What to Type:**
```
Can you explain what each tool does?
```

**Expected Output:**
```
You: Can you explain what each tool does?
Gemini: I have three tools available:
1. checkAvailability - verifies if a time slot is open
2. scheduleAppointment - books an appointment for a specific date and time
3. deleteAppointment - removes an existing appointment
```

**What's Happening:**
- LLM responds in "answer" mode (not a tool call)
- Explains the available tools
- Shows it understands its own capabilities
- Provides useful information to user

**✓ Check**: LLM can explain its tools in answer mode

---

## Step 7: Check Availability - Third Slot

**What to Type:**
```
Let me check Friday at 9 AM
```

**Expected Output:**
```
You: Let me check Friday at 9 AM
Checking availability for date: 2024-04-12T09:00:00
```

**What's Happening:**
- Third availability check
- Friday is correctly converted to 2024-04-12
- 9 AM converted to 09:00:00 in ISO format

**✓ Check**: Consistent date/time parsing

---

## Step 8: Schedule Third Appointment

**What to Type:**
```
Okay, book Friday at 9 AM
```

**Expected Output:**
```
You: Okay, book Friday at 9 AM
Scheduling appointment for date: 2024-04-12T09:00:00
```

**What's Happening:**
- Third appointment scheduled
- All three appointments now in the system
- Demonstrates multiple tool executions in sequence

**✓ Check**: Multiple scheduling operations work

---

## Step 9: Delete an Appointment (Reschedule)

**What to Type:**
```
Actually, I need to cancel the Wednesday appointment
```

**Expected Output:**
```
You: Actually, I need to cancel the Wednesday appointment
Deleting appointment for date: 2024-04-10T14:30:00
```

**What's Happening:**
- LLM recognizes "cancel" intent
- Uses context to identify which appointment (Wednesday 2:30 PM)
- Executes deleteAppointment tool
- Shows context awareness (no need to repeat the time)

**✓ Check**: LLM remembers specific appointments from earlier

---

## Step 10: Reschedule with New Time

**What to Type:**
```
Can I schedule that for Thursday at 3 PM instead?
```

**Expected Output:**
```
You: Can I schedule that for Thursday at 3 PM instead?
Scheduling appointment for date: 2024-04-11T15:00:00
```

**What's Happening:**
- LLM understands you want to rebook the cancelled slot
- Uses new date/time (Thursday 3 PM)
- Executes scheduling tool
- Part 2 workflow: delete then schedule (2 separate turns)

**✓ Check**: Rescheduling pattern works correctly

---

## Step 11: Verify Schedule Summary

**What to Type:**
```
So what appointments do I have scheduled?
```

**Expected Output:**
```
You: So what appointments do I have scheduled?
Gemini: Based on our conversation, you have three appointments:
1. Monday at 10:00 AM
2. Thursday at 3:00 PM
3. Friday at 9:00 AM
```

**What's Happening:**
- LLM uses conversation history (messages array)
- Reviews all executed tools
- Provides a summary without making new tool calls
- Shows it's tracking the scheduling operations

**✓ Check**: LLM can synthesize information from conversation history

---

## Step 12: Exit the Agent

**What to Type:**
```
exit
```

**Expected Output:**
```
You: exit

Goodbye!
```

**What's Happening:**
- Agent detects exit command
- Prints goodbye message
- Process terminates cleanly
- Exit code 0

**✓ Check**: Graceful shutdown

---

## Verification Checklist

After completing the scenario, verify:

### Tool Execution
- [ ] Availability checks logged to console
- [ ] Appointments scheduled logged to console
- [ ] Appointments deleted logged to console
- [ ] Each tool call showed correct date in ISO format

### Answer Mode
- [ ] Greeting was answered
- [ ] Tool explanations worked
- [ ] Summary was provided
- [ ] All in green "Gemini:" format

### Context & Memory
- [ ] LLM remembered previous appointments
- [ ] "That one" and "the Wednesday one" were understood
- [ ] Context was maintained across 12 turns
- [ ] Summary was accurate

### Conversation Flow
- [ ] Smooth transitions between tool and answer modes
- [ ] No errors were thrown
- [ ] All messages processed correctly
- [ ] Agent remained responsive

---

## Alternative Test Scenarios

### Scenario A: Rapid Tool Calls
**Try these in sequence:**
```
Check Monday at 9 AM
Check Monday at 10 AM
Check Monday at 11 AM
Schedule Monday at 10 AM
```
**Expected**: All tools execute successfully, dates parsed correctly

### Scenario B: Ambiguous Requests
**Try:**
```
Schedule an appointment
```
**Expected**: LLM asks for clarification instead of executing tool

### Scenario C: Complex Natural Language
**Try:**
```
I need to book something for the day after tomorrow at quarter to three in the afternoon
```
**Expected**: Date/time parsed to ISO format and tool executes

### Scenario D: Context-Heavy Conversation
**Try:**
```
Check if 2 PM is free tomorrow
What about 3 PM?
And 4 PM?
Schedule me for the first one
```
**Expected**: LLM remembers previous checks and schedules correctly

### Scenario E: Multi-day Planning
**Try:**
```
I need to schedule 5 meetings next week
Check Monday
Check Tuesday
Check Wednesday
Book Monday at 10
Book Wednesday at 2
```
**Expected**: Multiple checks and bookings work correctly

---

## Debugging Tips

### If a tool doesn't execute:
1. Check the console output - did "Checking availability", "Scheduling", or "Deleting" appear?
2. Look for error messages in red
3. Verify the LLM response format is correct JSON

### If LLM doesn't call expected tool:
1. Try a more explicit command: "Use the checkAvailability tool for tomorrow at 10 AM"
2. Check if your request was ambiguous
3. Verify the tool name is correct (checkAvailability, scheduleAppointment, deleteAppointment)

### If dates are wrong:
1. Check the ISO format in the console output
2. Verify the date math (today + 1 day = tomorrow)
3. Try explicit dates: "April 10 at 3 PM" instead of "Wednesday at 3 PM"

### If context isn't maintained:
1. Check that messages are being added to history
2. Try referencing earlier appointment explicitly: "The Monday 10 AM one"
3. Note: Part 2 has memory but no database persistence

---

## Performance Notes

### Expected Timing
- Tool execution: <1 second (just logs)
- LLM response: 2-5 seconds
- Total per turn: 2-5 seconds

### Token Usage
- System prompt: ~300 tokens
- Each user message: 20-50 tokens
- Each response: 30-100 tokens
- Total scenario: ~2000-3000 tokens

---

## What You'll Learn

By completing this scenario, you'll verify:

1. **Tool System Works** ✓
   - Tools load at startup
   - Tools execute when LLM calls them
   - Each tool logs correctly

2. **LLM Integration Works** ✓
   - Understands when to use tools vs. answer
   - Converts natural language to ISO dates
   - Generates proper JSON responses

3. **Agent Architecture Works** ✓
   - Handles tool and answer modes
   - Maintains conversation history
   - Manages error cases

4. **Context Preservation Works** ✓
   - LLM remembers appointments
   - Can reference earlier messages
   - Understands pronouns and context references

5. **Ready for Part 3** ✓
   - Foundation is solid
   - Tool system is extensible
   - Architecture supports multi-turn loops

---

## Next Steps After Testing

### If Everything Works:
- ✅ Part 2 is complete and functional
- Ready to implement Part 3 (agent finalization with automatic loops)
- Can create additional tools following the TOOLS_API.md pattern

### If You Find Issues:
- Check the ARCHITECTURE.md for design details
- Review SYSTEM_PROMPT.md for LLM behavior
- Check TOOLS_API.md for tool implementation
- Refer to EXAMPLES.md for expected interaction patterns

---

## Recording Your Results

Feel free to:
- Save terminal output for review
- Note any interesting LLM responses
- Identify tools you'd like to add
- Document any unexpected behaviors

Use these observations to inform Part 3 implementation!

---

**Happy Testing! 🎯**
