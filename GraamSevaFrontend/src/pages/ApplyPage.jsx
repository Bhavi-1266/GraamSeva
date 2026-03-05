export default function ApplyPage({
  uiLanguage,
  applicationMode,
  setApplicationMode,
  applyVoiceAutofill,
  applicationForm,
  setApplicationForm,
  submitApplication,
}) {
  const copy = {
    title: uiLanguage === 'hi' ? '???? ?? ??? ?????' : 'Apply for Service',
    typing: uiLanguage === 'hi' ? '???????' : 'Typing',
    voice: uiLanguage === 'hi' ? '????' : 'Voice',
    call: uiLanguage === 'hi' ? '???' : 'Call',
    callText: uiLanguage === 'hi' ? '?????? ?????? ?? ??? ????:' : 'Call assisted center:',
    callSub: uiLanguage === 'hi' ? '?????? ??? ?? ??? ????? ???? ??? ??? ??????' : 'An operator can complete the same form over phone.',
    fullName: uiLanguage === 'hi' ? '???? ???' : 'Full Name',
    village: uiLanguage === 'hi' ? '????' : 'Village',
    service: uiLanguage === 'hi' ? '?????? ????' : 'Service Needed',
    notes: uiLanguage === 'hi' ? '???????' : 'Notes',
    submit: uiLanguage === 'hi' ? '????? ??? ????' : 'Submit Application',
  }

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{copy.title}</span>

        <div className="mode-row">
          <button className={`btn-small ${applicationMode === 'typing' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={() => setApplicationMode('typing')}>
            {copy.typing}
          </button>
          <button className={`btn-small ${applicationMode === 'voice' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={applyVoiceAutofill}>
            {copy.voice}
          </button>
          <button className={`btn-small ${applicationMode === 'call' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={() => setApplicationMode('call')}>
            {copy.call}
          </button>
        </div>

        {applicationMode === 'call' ? (
          <div className="call-box">
            <p>{copy.callText} <strong>1800-120-4455</strong></p>
            <p>{copy.callSub}</p>
          </div>
        ) : (
          <form onSubmit={submitApplication} className="top-gap">
            <div className="input-field">
              <input id="fullName" value={applicationForm.fullName} onChange={(e) => setApplicationForm((prev) => ({ ...prev, fullName: e.target.value }))} />
              <label className="active" htmlFor="fullName">{copy.fullName}</label>
            </div>
            <div className="input-field">
              <input id="village" value={applicationForm.village} onChange={(e) => setApplicationForm((prev) => ({ ...prev, village: e.target.value }))} />
              <label className="active" htmlFor="village">{copy.village}</label>
            </div>
            <div className="input-field">
              <input id="serviceNeeded" value={applicationForm.serviceNeeded} onChange={(e) => setApplicationForm((prev) => ({ ...prev, serviceNeeded: e.target.value }))} />
              <label className="active" htmlFor="serviceNeeded">{copy.service}</label>
            </div>
            <div className="input-field">
              <textarea id="notes" className="materialize-textarea" value={applicationForm.notes} onChange={(e) => setApplicationForm((prev) => ({ ...prev, notes: e.target.value }))} />
              <label className="active" htmlFor="notes">{copy.notes}</label>
            </div>
            <button type="submit" className="btn waves-effect amber darken-3">{copy.submit}</button>
          </form>
        )}
      </div>
    </div>
  )
}