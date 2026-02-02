# Quick Test Guide - 5 Minute Test

## Start Here

```bash
node agent.js
```

Wait for: `You:` prompt with agents ready

---

## Quick Test Sequence

Copy and paste these one at a time, pressing Enter after each:

### Test 1: Basic Greeting (Answer Mode)
```
Hello! What can you help me with?
```
✅ Should respond with "Gemini: I can help you..." in green

---

### Test 2: Check Availability (Tool Mode)
```
Is tomorrow at 10 AM available?
```
✅ Should log: `Checking availability for date: 2024-04-04T10:00:00`

---

### Test 3: Schedule Appointment (Tool Mode)
```
Great! Schedule me for tomorrow at 10 AM
```
✅ Should log: `Scheduling appointment for date: 2024-04-04T10:00:00`

---

### Test 4: Another Check (Tool Mode)
```
How about tomorrow at 2 PM?
```
✅ Should log: `Checking availability for date: 2024-04-04T14:00:00`

---

### Test 5: Another Schedule (Tool Mode)
```
Book that one too
```
✅ Should log: `Scheduling appointment for date: 2024-04-04T14:00:00`

---

### Test 6: Context Query (Answer Mode)
```
What appointments do I have?
```
✅ Should respond with summary in green

---

### Test 7: Delete (Tool Mode)
```
Cancel the 2 PM appointment
```
✅ Should log: `Deleting appointment for date: 2024-04-04T14:00:00`

---

### Test 8: Exit
```
exit
```
✅ Should show `Goodbye!` and close

---

## What to Look For

| Output | What it Means |
|--------|---------------|
| `Checking availability for date:` | ✅ Tool executed (checkAvailability) |
| `Scheduling appointment for date:` | ✅ Tool executed (scheduleAppointment) |
| `Deleting appointment for date:` | ✅ Tool executed (deleteAppointment) |
| `Gemini: [response]` | ✅ Answer mode (tool not needed) |
| `Tool error:` | ❌ Tool failed (check parameters) |
| `Error:` | ❌ System error (check logs) |

---

## Expected Console Output

```
[dotenv@17.2.3] injecting env (1) from .env
Loading tools...

=== Simple Scheduling Agent with Tools ===

Type your message and press Enter. Type "exit" to quit.

You: Hello! What can you help me with?
Gemini: I can help you check availability, schedule appointments, and delete appointments.

You: Is tomorrow at 10 AM available?
Checking availability for date: 2024-04-04T10:00:00

You: Great! Schedule me for tomorrow at 10 AM
Scheduling appointment for date: 2024-04-04T10:00:00

You: exit

Goodbye!
```

---

## Pass/Fail Checklist

After running the quick test:

- [ ] Agent started without errors
- [ ] Greeting was responded to in green
- [ ] `Checking availability` logged
- [ ] `Scheduling appointment` logged
- [ ] `Deleting appointment` logged
- [ ] Summary was provided in green
- [ ] Agent exited cleanly with "Goodbye!"

✅ **If all checked**: Part 2 is working perfectly!
❌ **If any failed**: Check TROUBLESHOOTING.md

---

## Want More Detail?

Read the full test scenario: `docs/TEST_SCENARIO.md`

It includes:
- 12-step detailed scenario
- Expected outputs for each step
- Alternative test scenarios
- Debugging tips
- Performance notes

---

## Time Required

- Quick test: **5 minutes**
- Full scenario: **15-20 minutes**
- All alternatives: **30+ minutes**

Choose what works for you! 🚀
