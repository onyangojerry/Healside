# Algorithm Research

## Agent Orchestration Patterns

- **Planner/Worker/Critic**: Orchestrator plans subtasks, assigns to workers, critic reviews outputs.
- **Tool Calling**: Agents invoke predefined tools (e.g., FHIR query) with contracts.
- **Guardrails**: Input sanitization, output filtering, refusal policies.

## Retrieval + Citation Strategy

- **RAG**: Retrieve relevant FHIR/docs, cite in summaries.
- **Grounding**: All claims linked to sources; "Unknown" if not.

## Deterministic Validators

- **Schema Validation**: JSON schemas for inputs/outputs.
- **Policy Checks**: Regex for no advice, completeness metrics.
- **Run Outside LLM**: For reliability.

## Scheduling Optimization

- **Approach**: Constraint-based (availability, priority).
- **Future**: Bandit algorithms for learning preferences.

## Human-in-the-Loop Design

- **Gates**: Pre-approval for critical actions.
- **Feedback Loop**: Human edits improve agents.

## Evaluation Methodology

- **Metrics**: Citation coverage, hallucination rate, escalation accuracy.
- **Benchmarks**: Synthetic cases, expert review.