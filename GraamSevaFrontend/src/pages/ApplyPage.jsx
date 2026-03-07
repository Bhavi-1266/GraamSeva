import { useState } from "react"
import applicationService from "../services/applicationService"

export default function ApplyPage({ tr, uiLanguage, profile }) {
  const [applicationMode, setApplicationMode] = useState('typing')
  const [applicationForm, setApplicationForm] = useState({
    fullName: profile?.name || '',
    village: '',
    serviceNeeded: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const copy = {
    title: uiLanguage === 'hi' ? 'सेवा के लिए आवेदन' : 'Apply for Service',
    typing: uiLanguage === 'hi' ? 'टाइपिंग' : 'Typing',
    voice: uiLanguage === 'hi' ? 'वॉइस' : 'Voice',
    call: uiLanguage === 'hi' ? 'कॉल' : 'Call',
    callText: uiLanguage === 'hi' ? 'सहायता केंद्र पर कॉल करें:' : 'Call assisted center:',
    callSub: uiLanguage === 'hi' ? 'ऑपरेटर फोन पर यही फॉर्म भरने में मदद करेगा।' : 'An operator can complete the same form over phone.',
    fullName: uiLanguage === 'hi' ? 'पूरा नाम' : 'Full Name',
    village: uiLanguage === 'hi' ? 'गांव' : 'Village',
    service: uiLanguage === 'hi' ? 'आवश्यक सेवा' : 'Service Needed',
    notes: uiLanguage === 'hi' ? 'टिप्पणी' : 'Notes',
    submit: uiLanguage === 'hi' ? 'आवेदन जमा करें' : 'Submit Application',
    submitting: uiLanguage === 'hi' ? 'जमा हो रहा है...' : 'Submitting...',
  }

  const submitApplication = async (event) => {
    event.preventDefault()

    if (!applicationForm.fullName || !applicationForm.village || !applicationForm.serviceNeeded) {
      window.alert(
        uiLanguage === 'hi'
          ? 'कृपया जमा करने से पहले जरूरी जानकारी भरें।'
          : 'Please fill required fields before submit.'
      )
      return
    }

    try {
      setSubmitting(true)
      
      const result = await applicationService.submitApplication({
        ...applicationForm,
        language: uiLanguage,
        mobile: profile?.mobile,
      })

      console.log(`Application submitted from ${result.source}:`, result.data)
      
      window.alert(
        uiLanguage === 'hi'
          ? `आवेदन सफलतापूर्वक जमा हो गया! संदर्भ संख्या: ${result.data.referenceId || 'N/A'}`
          : `Application submitted successfully! Reference: ${result.data.referenceId || 'N/A'}`
      )

      // Reset form
      setApplicationForm({
        fullName: profile?.name || '',
        village: '',
        serviceNeeded: '',
        notes: '',
      })
    } catch (err) {
      console.error("Failed to submit application:", err)
      window.alert(
        uiLanguage === 'hi'
          ? 'आवेदन जमा करने में त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Error submitting application. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{copy.title}</span>

        <div className="mode-row">
          <button 
            className={`btn-small ${applicationMode === 'typing' ? 'amber darken-3' : 'brown lighten-1'}`} 
            onClick={() => setApplicationMode('typing')}
          >
            {copy.typing}
          </button>
          <button 
            className={`btn-small ${applicationMode === 'call' ? 'amber darken-3' : 'brown lighten-1'}`} 
            onClick={() => setApplicationMode('call')}
          >
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
              <input 
                id="fullName" 
                value={applicationForm.fullName} 
                onChange={(e) => setApplicationForm((prev) => ({ ...prev, fullName: e.target.value }))} 
              />
              <label className="active" htmlFor="fullName">{copy.fullName}</label>
            </div>
            <div className="input-field">
              <input 
                id="village" 
                value={applicationForm.village} 
                onChange={(e) => setApplicationForm((prev) => ({ ...prev, village: e.target.value }))} 
              />
              <label className="active" htmlFor="village">{copy.village}</label>
            </div>
            <div className="input-field">
              <input 
                id="serviceNeeded" 
                value={applicationForm.serviceNeeded} 
                onChange={(e) => setApplicationForm((prev) => ({ ...prev, serviceNeeded: e.target.value }))} 
              />
              <label className="active" htmlFor="serviceNeeded">{copy.service}</label>
            </div>
            <div className="input-field">
              <textarea 
                id="notes" 
                className="materialize-textarea" 
                value={applicationForm.notes} 
                onChange={(e) => setApplicationForm((prev) => ({ ...prev, notes: e.target.value }))} 
              />
              <label className="active" htmlFor="notes">{copy.notes}</label>
            </div>
            <button 
              type="submit" 
              className="btn waves-effect amber darken-3"
              disabled={submitting}
            >
              {submitting ? copy.submitting : copy.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}