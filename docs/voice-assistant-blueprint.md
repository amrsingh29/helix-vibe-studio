# Helix Voice Assistant — Architecture & Implementation Blueprint

> **Version**: 2.0 | **Date**: 2026-03-14  
> **Platform**: BMC Helix Innovation Studio 25.4.00  
> **Target**: Voice Interface Layer for Existing ITSM AI Agents  
> **Key Assumption**: AI Agents for incident queries, ticket creation, knowledge search, and ITSM tool execution **already exist** with streaming support. This blueprint focuses exclusively on adding a **voice layer** on top of that existing agent infrastructure.

---

## Table of Contents

1. [Impact Analysis — What Changes](#impact-analysis)
2. [Revised Architecture](#revised-architecture)
3. [Technology Selection](#technology-selection)
4. [Conversational Design](#conversational-design)
5. [Agent Integration Pattern](#agent-integration-pattern)
6. [Implementation Plan](#implementation-plan)
7. [Innovation Studio Implementation](#innovation-studio-implementation)
8. [User Experience Design](#user-experience-design)
9. [Demo Scenarios](#demo-scenarios)
10. [Future Enhancements](#future-enhancements)

---

## Impact Analysis

### What We Already Have (Existing Infrastructure)

| Capability | Status | Impact on Voice Assistant |
|---|---|---|
| AI Agents (query incidents, create tickets, etc.) | **Exists** | Voice Assistant does NOT need its own LLM orchestration |
| ITSM Tool execution (API calls) | **Exists** | No need to build RecordService wrappers, incident/change/knowledge services |
| Streaming responses | **Exists** | Can pipe streamed agent text directly into TTS for low-latency spoken responses |
| Intent detection & entity extraction | **Exists** (handled by agents) | No need for custom NLU, system prompts, or function-calling schemas |
| Conversation context & memory | **Exists** (managed by agents) | Voice layer just passes session context; doesn't manage its own memory |

### What We Still Need to Build

| Component | Why It's Needed |
|---|---|
| **Voice UI Component** | The visual interface — agent visualizer, chat panel, controls bar |
| **Speech-to-Text (STT) Service** | Convert user's spoken words into text to feed the existing agent |
| **Text-to-Speech (TTS) Service** | Convert the agent's text response into spoken audio |
| **Audio Capture / Playback** | Browser-level microphone recording and speaker output |
| **Voice-Agent Bridge** | Thin adapter that connects STT output → existing agent input, and agent output → TTS input |

### What We Can Remove from the Original Blueprint

| Removed Component | Reason |
|---|---|
| ~~LlmOrchestratorService.java~~ | Existing agents handle LLM reasoning |
| ~~ItsmToolExecutor.java~~ | Existing agents execute ITSM tools |
| ~~IncidentService.java / ChangeService.java / KnowledgeService.java~~ | Existing agents already call these APIs |
| ~~System prompt design~~ | Agents have their own prompts and personas |
| ~~Function/tool schema definitions~~ | Agents already have tool definitions |
| ~~VoiceSessionManager.java (full version)~~ | Agents manage conversation state; we just need a lightweight voice session wrapper |
| ~~Phase 3 (LLM Engine) and Phase 4 (ITSM Integration)~~ | Entire phases eliminated |

### Net Effect

```
Original blueprint:  8 phases, ~12 weeks, 9 Java classes, 4 Angular services
Revised blueprint:   5 phases, ~5-6 weeks, 3 Java classes, 3 Angular services

Complexity reduction: ~55%
```

The Voice Assistant is now a **thin interface layer**:

```
🎤 Microphone → STT → [text] → Existing AI Agent → [text stream] → TTS → 🔊 Speaker
                                       ↕
                              Existing ITSM Tools
```

---

## Revised Architecture

### High-Level Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                  BMC HELIX INNOVATION STUDIO                      │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              ANGULAR FRONTEND (Voice View Component)         │ │
│  │                                                              │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  │ │
│  │  │ Agent        │ │ Live Journey │ │ Voice Controls     │  │ │
│  │  │ Visualizer   │ │ (Chat Panel) │ │ (Mic/Kbd/Speaker)  │  │ │
│  │  └──────┬───────┘ └──────┬───────┘ └────────┬───────────┘  │ │
│  │         │                │                   │              │ │
│  │  ┌──────▼────────────────▼───────────────────▼───────────┐  │ │
│  │  │              Voice Orchestrator Service                │  │ │
│  │  │                                                        │  │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │ │
│  │  │  │ STT Service  │  │ TTS Service  │  │ Audio       │ │  │ │
│  │  │  │ (Web Speech  │  │ (Browser or  │  │ Capture &   │ │  │ │
│  │  │  │  or Whisper) │  │  OpenAI TTS) │  │ Playback    │ │  │ │
│  │  │  └──────────────┘  └──────────────┘  └─────────────┘ │  │ │
│  │  └────────────────────────┬───────────────────────────────┘  │ │
│  └───────────────────────────┼──────────────────────────────────┘ │
│                              │                                    │
│              ┌───────────────▼────────────────┐                  │
│              │     VOICE-AGENT BRIDGE          │                  │
│              │                                 │                  │
│              │   Translates between:           │                  │
│              │   STT text ──► Agent input      │                  │
│              │   Agent stream ──► TTS text     │                  │
│              │   Agent events ──► UI states    │                  │
│              └───────────────┬────────────────┘                  │
│                              │                                    │
│              ┌───────────────▼────────────────┐                  │
│              │     EXISTING AI AGENTS          │                  │
│              │     (Already Built)             │                  │
│              │                                 │                  │
│              │  • Query incidents              │                  │
│              │  • Create tickets               │                  │
│              │  • Search knowledge             │                  │
│              │  • Change management            │                  │
│              │  • Tool execution               │                  │
│              │  • Streaming responses          │                  │
│              │  • Conversation memory          │                  │
│              └────────────────────────────────┘                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  JAVA BACKEND (Minimal — only if TTS needs server proxy)    │ │
│  │                                                              │ │
│  │  /voice/tts  ── Proxy to OpenAI TTS (keeps API key safe)   │ │
│  │  /voice/stt  ── Proxy to OpenAI Whisper (optional Phase 2) │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                    (only for TTS/STT API calls)
                              │
              ┌───────────────▼────────────────┐
              │     EXTERNAL AI SERVICES        │
              │                                 │
              │  OpenAI Whisper (STT - Phase 2) │
              │  OpenAI TTS (Speech Synthesis)  │
              └────────────────────────────────┘
```

### What Each Layer Does Now

| Layer | Role | Complexity |
|---|---|---|
| **Voice UI** | Visual shell — orb, chat, controls | Medium (Angular component) |
| **STT Service** | Mic → text | Low (Web Speech API is ~50 lines) |
| **TTS Service** | Text → speaker | Low (Browser SpeechSynthesis) or Medium (OpenAI TTS via Java proxy) |
| **Voice-Agent Bridge** | The glue — takes STT text, calls existing agent API, feeds response to TTS and UI | **This is the key new piece** |
| **Existing Agents** | All ITSM reasoning, tool calling, streaming | **Already done — zero work** |
| **Java Backend** | Only needed for TTS/STT API key proxying | Minimal (1-2 endpoints) |

### The Voice-Agent Bridge (Core New Logic)

This is the only piece of real orchestration logic we need. It sits in Angular and does:

```
1. User clicks mic → STT starts
2. STT produces transcript → Bridge sends to existing agent API
3. Agent streams response tokens → Bridge does two things simultaneously:
   a. Appends tokens to chat UI (live typing effect)
   b. Buffers complete sentences → feeds each sentence to TTS queue
4. TTS plays sentences sequentially → Orb shows "Speaking" state
5. When TTS finishes → Orb returns to "Idle" (or "Listening" if auto-listen on)
```

The bridge needs to understand the existing agent's API contract — specifically:
- How to send a user message (HTTP POST? WebSocket?)
- How to receive streaming responses (SSE? chunked HTTP? WebSocket frames?)
- How to pass/receive session context
- How to detect when the agent is "thinking" vs "responding"

---

## Technology Selection

Since the reasoning layer is handled by existing agents, our technology choices narrow to just voice I/O.

### Speech-to-Text

| Option | Phase | Pros | Cons |
|---|---|---|---|
| **Web Speech API** (browser-native) | Phase 1 | Zero cost, zero latency, no API key, works offline partially | Chrome-only reliable, poor ITSM jargon, no audio blob |
| **OpenAI Whisper** (via Java proxy) | Phase 2 | Excellent accuracy, handles ITSM terms with prompting | ~1-3s latency, $0.006/min, needs Java proxy for API key |

**Recommendation**: Start with Web Speech API — it's literally free and instant. Upgrade to Whisper later only if accuracy is a problem for ITSM-specific vocabulary.

### Text-to-Speech

| Option | Phase | Pros | Cons |
|---|---|---|---|
| **Browser SpeechSynthesis** | Phase 1 | Free, instant, no network needed | Robotic voice, limited control |
| **OpenAI TTS** (`tts-1`, `nova` voice) | Phase 2 | Very natural voice, 6 voice options | ~1s latency per chunk, $15/1M chars, needs Java proxy |

**Recommendation**: Browser SpeechSynthesis for Phase 1 (instant results). OpenAI TTS for demos and production (the quality difference is dramatic).

### Why We Don't Need to Choose an LLM

We don't. The existing agents already have their LLM, tools, and prompts. The voice layer is LLM-agnostic — it just sends text in and receives text out.

---

## Conversational Design

### How Voice Changes the Agent Interaction

The existing agents are presumably text-based (chat UI, typed input). Voice adds these considerations:

| Concern | How Voice Differs from Text Chat |
|---|---|
| **Response length** | Spoken responses must be shorter — 2-3 sentences max per turn. Long text responses are painful to listen to. |
| **Confirmation before action** | Even more critical in voice — user can't "undo" a heard response. Always confirm mutations. |
| **Disambiguation** | Voice transcription errors are common ("INC000123" might come through as "ink 123"). Need fuzzy matching. |
| **Streaming + TTS interaction** | Agent streams tokens, but TTS needs complete sentences. Need a sentence-boundary buffer. |
| **Silence = end of turn** | Unlike text (where Enter = submit), voice needs voice activity detection (VAD) to know when user stopped talking. |
| **Fallback to typing** | User should always be able to switch to keyboard mid-conversation. |

### Adapting Agent Responses for Voice

If the existing agents produce responses optimized for text (long, detailed, with links/formatting), the Voice-Agent Bridge may need a **voice summarizer** layer:

**Option A — Agent-side adaptation**: Tell the agent that this is a voice session (pass a flag), so it naturally produces shorter, spoken-friendly responses.

**Option B — Bridge-side post-processing**: Strip markdown, truncate to first 3 sentences, convert ticket IDs to spoken form ("incident one two three" instead of "INC000123").

**Recommendation**: Option A is cleaner. Add a `channel: "voice"` parameter to the agent API call so the agent adapts its tone and length.

### Sentence Buffering for Streaming TTS

```
Agent streams:  "Incident INC" → "000123 is " → "currently In" → " Progress." → " It was" → " last updated" → " 2 hours ago."
                                                        ↑                                              ↑
                                                  Sentence 1 complete                           Sentence 2 complete
                                                  → Send to TTS                                 → Queue for TTS

TTS plays:  [Sentence 1 audio]  ──then──►  [Sentence 2 audio]
```

This gives the perception of near-instant speech while the agent is still generating.

---

## Agent Integration Pattern

### Integration Contract

The Voice-Agent Bridge needs to implement against whatever API your existing agents expose. Here are the common patterns:

**Pattern A — HTTP POST with SSE streaming response**
```
POST /api/agent/chat
Headers: { Authorization: Bearer <session>, Content-Type: application/json }
Body: { "message": "What's the status of INC000123?", "sessionId": "...", "channel": "voice" }

Response: Server-Sent Events stream
  data: {"type": "thinking", "content": ""}
  data: {"type": "token", "content": "Incident"}
  data: {"type": "token", "content": " INC000123"}
  data: {"type": "token", "content": " is currently"}
  data: {"type": "tool_call", "tool": "query_incident", "status": "executing"}
  data: {"type": "token", "content": " In Progress"}
  data: {"type": "done", "content": ""}
```

**Pattern B — WebSocket bidirectional**
```
ws://server/api/agent/stream
Send: { "type": "message", "text": "Show me high priority incidents", "channel": "voice" }
Receive: { "type": "chunk", "text": "There are 3 critical..." }
Receive: { "type": "chunk", "text": " incidents open..." }
Receive: { "type": "complete" }
```

**Pattern C — Simple request/response (no streaming)**
```
POST /api/agent/chat
Body: { "message": "...", "channel": "voice" }
Response: { "reply": "Full response text here.", "actions_taken": [...] }
```

The Bridge adapts to whichever pattern exists. Streaming (A or B) is preferred because it enables the sentence-buffering TTS trick described above.

### Agent Event → UI State Mapping

| Agent Event | Voice UI State | Orb Animation |
|---|---|---|
| User message sent | User bubble appears | Orb → Thinking |
| `thinking` / `tool_call` executing | "Agent is looking up..." status | Orb → Thinking (spinning) |
| First `token` arrives | Agent bubble starts appearing | Orb → Speaking |
| `done` + TTS finishes | Complete message shown | Orb → Idle (or Listening) |
| Error from agent | Error toast + "Sorry, I ran into an issue" | Orb → Error (red pulse) |

---

## Implementation Plan (Revised — 5 Phases)

```
Phase 1 ────► Phase 2 ────► Phase 3 ────► Phase 4 ────► Phase 5
Voice UI       Browser STT    Agent Bridge   TTS            Polish &
Prototype      & Audio        Integration    & Streaming    Production

Week 1-2       Week 3         Week 3-4       Week 5         Week 5-6
```

### Phase 1 — Voice UI Shell (Week 1-2)

Build the visual component with mock data.

| Task | Deliverable |
|---|---|
| Generate `voice-assistant` view component scaffold | 10 standard files |
| Build Agent Visualizer (animated orb with 5 states) | Standalone sub-component with CSS animations |
| Build Live Journey panel (scrollable chat) | Message list with agent/user/system bubble styles |
| Build Voice Controls bar | Adapt buttons: mic, keyboard toggle, speaker toggle, end session |
| Build text input fallback | Adapt text field + send button |
| Wire up with mock data | Hardcoded conversation to validate layout and animations |
| Register in IS | Component appears in View Designer palette |

### Phase 2 — Browser STT & Audio (Week 3)

User speaks, text appears.

| Task | Deliverable |
|---|---|
| Implement `SpeechRecognitionService` | Web Speech API wrapper — start, stop, interim results, final transcript |
| Implement `AudioCaptureService` | MediaRecorder wrapper (needed later for Whisper upgrade path) |
| Connect mic button → STT → user message in chat | Real voice flowing into conversation |
| Handle permission prompt + denial fallback | If denied, disable mic button, show "Use keyboard" |
| Voice Activity Detection (VAD) | Auto-stop on 1.5s silence |
| Interim transcript display | Gray preview text updating in real-time while user speaks |

### Phase 3 — Agent Bridge Integration (Week 3-4)

Connect voice to existing agents.

| Task | Deliverable |
|---|---|
| Implement `VoiceAgentBridgeService` | Adapter between STT output and existing agent API |
| Handle agent streaming (SSE/WebSocket/HTTP) | Parse agent response stream into UI events |
| Map agent events → orb states | thinking → Thinking, tokens → Speaking, done → Idle |
| Pass `channel: "voice"` flag | Agents can adapt response length for voice |
| Handle errors from agent | Graceful spoken error messages |
| Session lifecycle management | Create session on mount, end on destroy/button |

### Phase 4 — Text-to-Speech & Streaming (Week 5)

Agent speaks back.

| Task | Deliverable |
|---|---|
| Implement `TextToSpeechService` | Browser SpeechSynthesis wrapper with queue management |
| Sentence boundary detector | Buffers agent stream tokens, emits complete sentences |
| Connect agent response stream → sentence buffer → TTS queue | Sentences play as they arrive |
| Speaker toggle (mute/unmute) | User can silence voice output |
| Auto-listen mode | After TTS finishes, auto-start STT for next turn |
| (Optional) Java TTS proxy for OpenAI TTS | `/voice/tts` endpoint for higher-quality voice |

### Phase 5 — Polish & Production (Week 5-6)

| Task | Deliverable |
|---|---|
| Responsive layout (full-width, medium, narrow, docked) | Works in all IS view configurations |
| Keyboard shortcut (hold Space to talk) | Power-user efficiency |
| Accessibility (ARIA labels, focus management) | Screen reader compatible |
| Loading/error states for all failure modes | Network, permission, timeout |
| Localized strings | All UI text in `localized-strings.json` |
| Performance optimization | Lazy-load voice services, minimize bundle size |
| Build & deploy testing | Full Maven build, verify in IS |

---

## Innovation Studio Implementation

### Artifacts to Create (Revised — Much Smaller)

```
bundle/src/main/webapp/libs/com-amar-helix-vibe-studio/src/lib/
├── view-components/
│   └── voice-assistant/                        ← VIEW COMPONENT
│       ├── voice-assistant.types.ts
│       ├── voice-assistant-registration.module.ts
│       ├── design/
│       │   ├── voice-assistant-design.component.ts/html/scss
│       │   ├── voice-assistant-design.model.ts
│       │   └── voice-assistant-design.types.ts
│       └── runtime/
│           ├── voice-assistant.component.ts/html/scss
│           ├── agent-visualizer/               ← Sub-component (orb)
│           │   └── agent-visualizer.component.ts/html/scss
│           ├── live-journey/                   ← Sub-component (chat)
│           │   └── live-journey.component.ts/html/scss
│           └── voice-controls/                 ← Sub-component (controls bar)
│               └── voice-controls.component.ts/html/scss
├── services/
│   └── voice-assistant/                        ← ANGULAR SERVICES
│       ├── speech-recognition.service.ts       (Web Speech API wrapper)
│       ├── text-to-speech.service.ts           (SpeechSynthesis wrapper)
│       └── voice-agent-bridge.service.ts       (connects to existing agents)

bundle/src/main/java/com/amar/helixvibestudio/bundle/
├── MyApplication.java                          ← UPDATE (register VoiceProxyRest)
├── VoiceProxyRest.java                         ← NEW (minimal — TTS proxy only)
└── TtsRequest.java                             ← NEW (request payload)
```

**Compared to v1 blueprint**: 9 Java classes → 2. 4 Angular services → 3. No ITSM service wrappers. No LLM orchestrator. No session manager.

### Configuration Properties (View Designer)

| Property | Type | Purpose |
|---|---|---|
| `title` | Expression | Header text |
| `agentEndpoint` | Expression | URL of the existing agent API |
| `agentSessionId` | Expression | Pre-existing agent session to connect to |
| `enableVoice` | Boolean | Toggle voice on/off |
| `enableAutoListen` | Boolean | Auto-start mic after agent speaks |
| `voiceChannel` | Expression | Value sent as `channel` param to agent (default: `"voice"`) |
| `ttsProvider` | Select | `"browser"` or `"openai"` |
| `agentName` | Expression | Display name for the orb label |

### How It Connects to Existing Agents

The `agentEndpoint` property is the critical link. It points to whatever URL your existing agents expose. The `VoiceAgentBridgeService` is designed as an **adapter** — it implements one of these integration strategies based on what the agent endpoint returns:

```
agentEndpoint: "/api/agent/chat"   →  Bridge uses HttpClient POST with SSE
agentEndpoint: "ws://server/agent" →  Bridge uses WebSocket
agentEndpoint: "/api/agent/query"  →  Bridge uses simple request/response
```

This makes the Voice Component reusable across different agents — change the endpoint property in View Designer to point at a different agent, and the same voice UI works.

---

## User Experience Design

### UI Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  ┌─ Session Header ─────────────────────────────────────────────┐   │
│  │  Helix Voice Assistant    ● Connected   Duration: 03:42      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──── Agent Panel ─────────┐  ┌──── Live Journey ──────────────┐  │
│  │                          │  │                                 │  │
│  │    ╭──────────────╮      │  │  ┌─ Agent ─────────────────┐   │  │
│  │    │              │      │  │  │ Welcome! I'm Helix.     │   │  │
│  │    │  ◉ Animated  │      │  │  │ How can I help today?   │   │  │
│  │    │    Orb       │      │  │  └──────────────────────────┘   │  │
│  │    │              │      │  │                                 │  │
│  │    ╰──────────────╯      │  │        ┌─ You (voice) ────┐   │  │
│  │                          │  │        │ Show me critical  │   │  │
│  │      ● Listening         │  │        │ incidents         │   │  │
│  │                          │  │        └───────────────────┘   │  │
│  │  ┌────────────────────┐  │  │                                 │  │
│  │  │ AGENT              │  │  │  ┌─ Agent ─────────────────┐   │  │
│  │  │ Helix              │  │  │  │ There are 3 critical    │   │  │
│  │  └────────────────────┘  │  │  │ incidents open...       │   │  │
│  └──────────────────────────┘  │  └──────────────────────────┘   │  │
│                                │                                 │  │
│                                │  Suggestions: [Details] [Export] │  │
│                                │                                 │  │
│                                │  ┌──────────────────────────┐   │  │
│                                │  │ Type a message...     ➤  │   │  │
│                                │  └──────────────────────────┘   │  │
│                                └─────────────────────────────────┘  │
│                                                                     │
│  ┌─ Controls Bar ───────────────────────────────────────────────┐   │
│  │   🎤 Mic    ⌄ Options    ⌨️ Keyboard    🔊 Speaker          │   │
│  │                                              [End Session]   │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

### Agent Visualizer States

| State | Visual | Trigger |
|---|---|---|
| **Idle** | Slowly pulsing soft gradient orb | Default / after TTS completes |
| **Listening** | Ripple rings expanding outward | Mic active, STT receiving audio |
| **Thinking** | Spinning gradient, orbiting dots | Agent processing (tool calls, lookup) |
| **Speaking** | Equalizer-style bouncing bars | TTS playing audio |
| **Error** | Red-tinted pulse | Agent error, network failure |

### Interaction Flow

```
User opens view
  └─► Orb: Idle, Welcome message shown

User clicks 🎤
  └─► Browser permission prompt (first time)
  └─► Orb: Listening
  └─► Interim transcript shown in gray

User speaks, then pauses (1.5s silence)
  └─► STT finalizes transcript → shown as user bubble
  └─► Bridge sends text to existing agent API
  └─► Orb: Thinking

Agent streams response tokens
  └─► Agent bubble appears with live typing effect
  └─► Sentence buffer detects first complete sentence
  └─► Orb: Speaking, TTS starts playing

Agent completes response
  └─► Suggestion chips appear below agent message
  └─► TTS finishes playing
  └─► Orb: Idle (or Listening if auto-listen enabled)
```

### Latency Target: < 2 Seconds Voice-to-Voice

```
STT (Web Speech API):     ~200ms  (browser-native, no network)
Agent Bridge send:         ~50ms  (local HTTP/WS)
Agent first token:        ~500ms  (existing agent latency)
Sentence buffer fill:     ~300ms  (wait for first sentence end)
TTS start (browser):      ~100ms  (SpeechSynthesis is instant)
                          ──────
Total to first spoken word: ~1.2s
```

With OpenAI TTS instead of browser: add ~800ms for API round-trip, bringing total to ~2.0s. Still acceptable.

---

## Demo Scenarios

### Demo 1: "Voice Incident Query" (90 seconds)

1. Open Voice Assistant view
2. Click mic: *"What's happening with incident INC000123?"*
3. Orb thinks → agent queries via existing tools
4. Agent speaks: *"INC000123 is a VPN connectivity issue, currently In Progress. The network team has been working on it for about 2 hours."*
5. Follow-up: *"Can you escalate it?"*
6. Agent confirms and acts via existing escalation tool

**Key message**: Existing AI agent does all the work — we just added voice.

### Demo 2: "Hands-Free Ticket Creation" (90 seconds)

1. *"Create a ticket — user can't access email on their phone since this morning"*
2. Agent (via existing tools) creates the incident
3. Agent speaks back the ticket number
4. User never touches the keyboard

**Key message**: Helpdesk agents can work hands-free during phone calls.

### Demo 3: "Voice Knowledge Lookup" (60 seconds)

1. *"What's the change approval process?"*
2. Agent (via existing knowledge tools) retrieves and summarizes
3. Agent speaks a concise 2-sentence summary
4. *"What about emergency changes?"*
5. Agent follows up with the emergency path

**Key message**: Institutional knowledge is instantly accessible by voice.

---

## Future Enhancements

### Near-Term (builds on voice layer)

| Enhancement | Description |
|---|---|
| **OpenAI Whisper upgrade** | Replace Web Speech API with Whisper for better ITSM jargon accuracy |
| **OpenAI TTS upgrade** | Replace browser SpeechSynthesis with natural `nova` voice |
| **Push-to-talk (Space bar)** | Power users hold Space to talk, release to send |
| **Voice in any view** | Floating microphone button as a view action — voice available everywhere, not just dedicated view |
| **Multi-agent routing** | Voice command routes to correct specialized agent: *"Ask the network agent about..."* |

### Medium-Term

| Enhancement | Description |
|---|---|
| **Multi-language** | Browser STT/TTS natively support 50+ languages; agents respond in detected language |
| **Proactive voice alerts** | Agent pushes P1 notifications with spoken audio: *"Alert: new critical incident just opened"* |
| **Voice authentication** | Speaker verification before sensitive actions (approve change, escalate) |
| **Conversation export** | Export voice session transcript as incident work notes |

### Long-Term

| Enhancement | Description |
|---|---|
| **Meeting assistant** | Voice assistant joins CAB calls, listens, and auto-generates change risk assessment |
| **Ambient NOC mode** | Always-listening mode in the NOC — detects incident discussions and auto-creates tickets |
| **Real-time translation** | User speaks in Japanese, agent responds in Japanese, ITSM records created in English |

---

## Appendix A — Project Constants

| Constant | Value |
|---|---|
| Bundle ID | `com.amar.helix-vibe-studio` |
| Application Name | `com-amar-helix-vibe-studio` |
| Component Type | `com-amar-helix-vibe-studio-com-amar-helix-vibe-studio-voice-assistant` |
| Java Package | `com.amar.helixvibestudio.bundle` |
| Angular Lib Path | `libs/com-amar-helix-vibe-studio/src/lib/` |

## Appendix B — Cost Estimate (Voice Layer Only)

| Service | Usage | Monthly Cost |
|---|---|---|
| Web Speech API (Phase 1) | Unlimited | **$0** |
| Browser SpeechSynthesis (Phase 1) | Unlimited | **$0** |
| OpenAI Whisper (Phase 2) | ~500 hrs/month | ~$180 |
| OpenAI TTS (Phase 2) | ~2M chars/month | ~$30 |
| **Phase 1 Total** | | **$0** |
| **Phase 2 Total** | | **~$210/month** |

Existing agent API costs are not included — those are already being incurred.

## Appendix C — Key Decisions Log

| Decision | Rationale |
|---|---|
| Voice layer only, not full-stack AI | Existing agents handle all ITSM reasoning — no duplication |
| Web Speech API for Phase 1 | Zero cost, zero latency, proves the UX concept instantly |
| `channel: "voice"` flag to agents | Agents adapt response style without changing their core logic |
| Sentence-boundary TTS buffering | Enables speaking to start before full response generates |
| Configurable `agentEndpoint` property | Same voice component works with any agent — just change the URL |
| Minimal Java backend (TTS proxy only) | Only needed when upgrading to OpenAI TTS — Phase 1 is pure frontend |
| Sub-components for Orb/Journey/Controls | Each piece independently testable, replaceable, and reusable |

---

*This revised blueprint assumes existing AI Agent infrastructure and focuses exclusively on adding a voice interaction layer. Total new code is approximately 55% less than a full-stack implementation. Phase 1 can be demonstrated with zero external API costs.*
