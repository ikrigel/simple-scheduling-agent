# Quick Test Guide - Part 3 (5 Minute Test)

## Part 3 Features to Test

Part 3 adds **multi-turn agent execution** - the agent automatically calls multiple tools in sequence from a single user request.

## Start Here

```bash
node agent.js
```

Wait for: `=== Simple Scheduling Agent - Part 3 ===` and `You:` prompt

---

## Quick Test Sequence

Copy and paste these commands one at a time, pressing Enter after each:

### Test 1: Simple Greeting (Answer Mode)
```
Hello! Can you help me with scheduling?
```
✅ **Expected**:
- Responds in green: `Gemini: ...`
- Inner loop exits immediately (no tools called)
- Returns to user prompt

---

### Test 2: Single Tool Call (Tool Mode)
```
Is tomorrow at 10 AM available?
```
✅ **Expected**:
- Logs: `Checking availability for date: 2024-04-XX...`
- Responds: `Gemini: ...`
- Returns to user prompt
- **KEY**: LLM sees tool result and decides to respond with "finished"

---

### Test 3: Multi-Tool Sequence (Part 3 Magic!) ⭐
```
Schedule me for tomorrow at 9 AM
```
✅ **Expected Output**:
```
You: Schedule me for tomorrow at 9 AM
Checking availability for date: 2024-04-XX...
Scheduling appointment for date: 2024-04-XX...
Gemini: Your appointment has been scheduled for tomorrow at 9 AM.
```

✅ **What's Happening** (Part 3):
- **Iteration 1**: LLM calls `checkAvailability` → tool executes → result sent back to LLM
- **Iteration 2**: LLM calls `scheduleAppointment` → tool executes → result sent back to LLM
- **Iteration 3**: LLM responds with "finished" action → inner loop exits
- **Total**: 3 LLM calls automatically (check → schedule → finish)
- **No user input** needed between tool calls!

---

### Test 4: Rescheduling (Complex Workflow) ⭐⭐
```
Actually, move it to 3 PM instead
```
✅ **Expected Output**:
```
You: Actually, move it to 3 PM instead
Deleting appointment for date: 2024-04-XX...
Checking availability for date: 2024-04-XX...
Scheduling appointment for date: 2024-04-XX...
Gemini: Your appointment has been moved to 3 PM.
```

✅ **What's Happening** (Part 3 Multi-Step):
- **Iteration 1**: LLM deletes old appointment
- **Iteration 2**: LLM checks new time is available
- **Iteration 3**: LLM schedules new appointment
- **Iteration 4**: LLM responds with "finished"
- **Total**: 4 automatic LLM calls

---

### Test 5: Exit
```
exit
```
✅ Should show: `Goodbye!` and close

---

## What Makes This Part 3? 🎯

### Part 2 Behavior (Old):
```
User: "Schedule me for tomorrow at 9 AM"
→ LLM: {"action": "tool", "tool": "scheduleAppointment"}
→ Tool executes
→ Back to user prompt
❌ Problem: Skipped checking availability first!
```

### Part 3 Behavior (New):
```
User: "Schedule me for tomorrow at 9 AM"
→ Iteration 1: LLM → {"action": "tool", "tool": "checkAvailability"}
→ Tool executes, result sent to LLM
→ Iteration 2: LLM → {"action": "tool", "tool": "scheduleAppointment"}
→ Tool executes, result sent to LLM
→ Iteration 3: LLM → {"action": "finished"}
→ Display final response
→ Back to user prompt
✅ Perfect: Agent completed the task automatically!
```

---

## Quick Reference: Three Action Types

| Action | When Used | What Happens |
|--------|-----------|--------------|
| `"answer"` | Simple conversation | Display response, exit inner loop |
| `"tool"` | Need to execute function | Execute tool, send result to LLM, continue loop |
| `"finished"` | Task complete | Display final response, exit inner loop |

---

## What to Look For

### ✅ Correct Part 3 Behavior:
- Multiple tools execute from single user request
- Tool logs appear in console
- No "Gemini:" response between tool calls
- Only final "Gemini:" response shown
- Inner loop runs 2-4 iterations for complex tasks
- Smooth, autonomous execution

### ❌ Problems to Watch For:
- Only one tool executes (Part 2 behavior)
- Tool results shown as `{available: true}` (shouldn't be visible)
- LLM doesn't recognize "finished" action
- Agent gets stuck (hitting 10-iteration limit)

---

## Expected Console Output (Full Example)

```
[dotenv@17.2.3] injecting env (1) from .env
Loading tools...

=== Simple Scheduling Agent - Part 3 ===

Type your message and press Enter. Type "exit" to quit.

You: Hello
Gemini: Hello! I can help you schedule appointments.

You: Schedule me for tomorrow at 9 AM
Checking availability for date: 2024-04-05T09:00:00
Scheduling appointment for date: 2024-04-05T09:00:00
Gemini: Your appointment has been scheduled for tomorrow at 9 AM.

You: Move it to 3 PM
Deleting appointment for date: 2024-04-05T09:00:00
Checking availability for date: 2024-04-05T15:00:00
Scheduling appointment for date: 2024-04-05T15:00:00
Gemini: Your appointment has been rescheduled to 3 PM.

You: exit

Goodbye!
```

---

## Time Required

- Quick test: **5-10 minutes**
- Full scenario: **15-20 minutes**
- All variations: **30+ minutes**

---

## Pass/Fail Checklist

After running the quick test:

- [ ] Agent started without errors
- [ ] Simple greeting worked (answer mode)
- [ ] Single tool call worked
- [ ] **Multi-tool sequence worked** (2+ tools in one request) ⭐
- [ ] Multiple tools showed in console output
- [ ] Only one "Gemini:" response shown (the final one)
- [ ] LLM used "finished" action to signal completion
- [ ] Agent returned to user prompt smoothly
- [ ] No visible tool result objects `{...}`
- [ ] Rescheduling worked (delete → check → schedule)

✅ **If all checked**: Part 3 is working perfectly!
❌ **If multi-tool failed**: Part 3 not working yet

---

## Key Differences from Part 2

| Feature | Part 2 | Part 3 |
|---------|--------|--------|
| Tool calls per input | 1 | Multiple |
| LLM sees tool results | No | ✅ Yes |
| Automatic sequencing | No | ✅ Yes |
| User input between tools | Yes | ✅ No |
| Task completion signal | N/A | ✅ "finished" action |
| Complexity of workflows | Single-step | ✅ Multi-step |

---

## Next Steps

### If Tests Pass:
- ✅ Part 3 implementation successful
- Part 1, 2, & 3 complete and working
- Project ready for real-world use

### If Tests Fail:
- Check if inner loop is being entered
- Verify LLM is responding with "finished" action
- Review system prompt in toolRegistry.js
- Check message history format

---

## Tips for Success

1. **Wait for API response** - Gemini API takes 2-5 seconds per call
2. **Use clear requests** - "Schedule me for tomorrow at 9 AM" works better than vague requests
3. **Watch the console** - Tool logs show what's happening under the hood
4. **Try the rescheduling test** - Best way to see multi-tool power

---

**Happy Testing! 🚀**

The agent should now autonomously complete multi-step scheduling tasks!
