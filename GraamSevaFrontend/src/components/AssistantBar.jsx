
export default function AssistantBar({
  tr,
  voiceState,
  assistantState,
  query,
  setQuery,
  onMic,
  onRunAssistant,
}) {
  return (
 
    <section className="assistant-box card">
      <div className="card-content">
        <div className="assistant-head">
          <div>
            <strong>{tr.assistantTitle}</strong>
            <p className="voice-state">{tr.state}: {voiceState}</p>
          </div>
          <button className="btn-floating amber darken-3" onClick={onMic}>
            <span className="material-icons">mic</span>
          </button>
        </div>

        <p className="dialog-line"><strong>{tr.you}:</strong> {assistantState.query}</p>
        <p className="dialog-line"><strong>{tr.ai}:</strong> {assistantState.response}</p>

        <div className="suggestion-row">
          {assistantState.suggestions.map((s) => (
            <button key={s} className="chip selectable-chip" onClick={() => onRunAssistant(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="assistant-input-row">
          <input
            className="browser-default"
            placeholder={tr.typeQuestion}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onRunAssistant(query)}
          />
          <button className="btn waves-effect amber darken-3" onClick={() => onRunAssistant(query)}>
            {tr.send}
          </button>
        </div>
      </div>
    </section>
  )
}