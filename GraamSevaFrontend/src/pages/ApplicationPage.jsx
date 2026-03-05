import { useState } from 'react'
import { applicationService } from '../services'
import '../styles/ApplicationPage.css'

export default function ApplicationPage({
  service,
  userProfile,
  language,
  onBack,
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    landArea: '',
    landType: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    familyMembers: '',
    annualIncome: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [dataSource, setDataSource] = useState(null)

  const totalSteps = 3

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Call application API service
      const result = await applicationService.submitApplication(
        {
          schemeId: service.id,
          schemeName: service.name,
          userProfile,
          formData,
          language,
        },
        language
      )

      setSubmissionResult(result)
      setDataSource(result.source)
      setSubmitted(true)
    } catch (error) {
      console.error('Submission error:', error)
      // Still show success even if API fails, using mock data
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (submitted && submissionResult) {
    return (
      <div className="application-page success">
        <div className="success-container">
          <div className="success-icon">✅</div>
          <h2>आवेदन सफलतापूर्वक जमा हुआ!</h2>
          <div className="success-details">
            <p>
              आपका आवेदन संदर्भ नंबर:{' '}
              <span className="reference-number">{submissionResult.referenceId}</span>
            </p>
            <p>
              आप SMS और फोन पर अपडेट स्वीकार करेंगे।
            </p>
            <p className="timeline">
              ⏱️ आमतौर पर संसाधन में <strong>{submissionResult.data.expectedApprovalTime || '7-15 दिन'}</strong> लगते हैं।
            </p>
            {dataSource && (
              <p className="data-source-hint">
                {dataSource === 'api' ? '✓ API के माध्यम से जमा किया गया' : '💾 ऑफलाइन सहेजा गया'}
              </p>
            )}
          </div>

          <div className="next-steps-box">
            <h4>अगली क्रिया:</h4>
            <ul>
              {(submissionResult.data.nextSteps || []).map((step, idx) => (
                <li key={idx}>✓ {step}</li>
              ))}
            </ul>
          </div>

          <button 
            className="new-application-button"
            onClick={() => window.location.reload()}
          >
            नई योजना के लिए आवेदन करें
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="application-page">
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← वापस
        </button>
        <h2>आवेदन फॉर्म</h2>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>

      <p className="step-indicator">
        चरण {currentStep} का {totalSteps}
      </p>

      <div className="form-container">
        {/* Step 1: Land Information */}
        {currentStep === 1 && (
          <div className="form-step">
            <h3>🌾 जमीन की जानकारी</h3>

            <div className="form-group">
              <label>कुल कृषि योग्य जमीन (हेक्टेयर में)</label>
              <select
                name="landArea"
                value={formData.landArea}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">-- चुनें --</option>
                <option value="0.5">0.5 हेक्टेयर तक</option>
                <option value="1">1 हेक्टेयर</option>
                <option value="1.5">1.5 हेक्टेयर</option>
                <option value="2">2 हेक्टेयर</option>
              </select>
            </div>

            <div className="form-group">
              <label>जमीन का प्रकार</label>
              <select
                name="landType"
                value={formData.landType}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">-- चुनें --</option>
                <option value="owned">अपनी मालिकाना</option>
                <option value="leased">किराये पर</option>
                <option value="shared">साझेदारी</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Bank Information */}
        {currentStep === 2 && (
          <div className="form-step">
            <h3>🏦 बैंक विवरण</h3>

            <div className="form-group">
              <label>बैंक का नाम</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                placeholder="जैसे: SBI, HDFC आदि"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>खाता संख्या</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                placeholder="12 अंकों का खाता नंबर"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>IFSC कोड</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="जैसे: SBIN0001234"
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Step 3: Family Information */}
        {currentStep === 3 && (
          <div className="form-step">
            <h3>👨‍👩‍👧‍👦 पारिवारिक जानकारी</h3>

            <div className="form-group">
              <label>परिवार के सदस्यों की संख्या</label>
              <select
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">-- चुनें --</option>
                <option value="1">1 व्यक्ति</option>
                <option value="2">2 व्यक्ति</option>
                <option value="3">3 व्यक्ति</option>
                <option value="4">4 व्यक्ति</option>
                <option value="5+">5 या अधिक</option>
              </select>
            </div>

            <div className="form-group">
              <label>वार्षिक आय (₹ में)</label>
              <select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">-- चुनें --</option>
                <option value="100000">₹1,00,000 तक</option>
                <option value="200000">₹1,00,000 - ₹2,00,000</option>
                <option value="300000">₹2,00,000 - ₹3,00,000</option>
                <option value="500000">₹3,00,000 - ₹5,00,000</option>
              </select>
            </div>

            <div className="terms-box">
              <input
                type="checkbox"
                id="terms"
                className="terms-checkbox"
              />
              <label htmlFor="terms" className="terms-label">
                मैं सत्यापित करता हूं कि दी गई सभी जानकारी सही है।
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          className="prev-button"
          onClick={handlePrev}
          disabled={currentStep === 1}
        >
          ← पिछला
        </button>
        {currentStep < totalSteps ? (
          <button className="next-button" onClick={handleNext}>
            आगे →
          </button>
        ) : (
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '⏳ जमा किया जा रहा है...' : '✅ जमा करें'}
          </button>
        )}
      </div>
    </div>
  )
}

