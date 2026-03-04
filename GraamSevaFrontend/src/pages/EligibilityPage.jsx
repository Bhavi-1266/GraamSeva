import { useState } from 'react'
import '../styles/EligibilityPage.css'

const ELIGIBILITY_CRITERIA = {
  1: {
    // PM-KISAN
    title: 'PM-KISAN - किसान सम्मान निधि योजना',
    description:
      'खेती में लगे सभी भारतीय किसानों के लिए आर्थिक सहायता योजना',
    benefits: ['₹2,000 हर चार महीने में', '₹6,000 प्रति वर्ष', 'सीधे बैंक में'],
    requirements: [
      { item: 'भारतीय नागरिक होना चाहिए', status: 'verified' },
      { item: 'खेती योग्य जमीन होनी चाहिए', status: 'verified' },
      { item: '2 हेक्टेयर तक की जमीन', status: 'verified' },
      { item: 'आधार निर्भर बैंक खाता', status: 'pending' },
    ],
    documents: [
      'आधार कार्ड',
      'जमीन के कागजात',
      'बैंक खाते की जानकारी',
      'मोबाइल नंबर',
    ],
    nextSteps: 'फॉर्म भरने के बाद 30 दिन में ₹2,000 खाते में आएंगे',
  },
  2: {
    // Crop Insurance
    title: 'PMFBY - प्रधानमंत्री फसल बीमा योजना',
    description: 'फसल नुकसान की स्थिति में आर्थिक सुरक्षा',
    benefits: [
      'फसल नुकसान की भरपाई',
      'न्यूनतम प्रीमियम',
      'दस्तावेज़ मुक्त क्लेम',
    ],
    requirements: [
      { item: 'खेती योग्य जमीन का मालिक', status: 'verified' },
      { item: 'बीजाई का समय निर्धारित सीमा में', status: 'pending' },
      { item: 'जिले में पंजीकृत फसल', status: 'verified' },
    ],
    documents: ['दुर्घटना का प्रमाण', 'फसल का विवरण', 'बैंक विवरण'],
    nextSteps: 'नुकसान रिपोर्ट के 72 घंटों में पंचायत को सूचित करें',
  },
  3: {
    // MGNREGA
    title: 'MGNREGA - महात्मा गांधी रोजगार गारंटी योजना',
    description: 'ग्रामीण क्षेत्रों में 100 दिन का गारंटीशुदा कार्य',
    benefits: [
      'न्यूनतम ₹309 दैनिक मजदूरी',
      '100 दिन का काम गारंटीशुदा',
      'बीमा कवर शामिल',
    ],
    requirements: [
      { item: '18 वर्ष या अधिक उम्र', status: 'verified' },
      { item: 'ग्रामीण निवासी', status: 'verified' },
      { item: 'आधार से जुड़ा बैंक खाता', status: 'pending' },
    ],
    documents: ['आधार कार्ड', 'बैंक खाता', 'ग्राम पंचायत से पत्र'],
    nextSteps: 'पंचायत को आवेदन दीजिए, 15 दिन में काम शुरू होगा',
  },
}

export default function EligibilityPage({
  service,
  userProfile,
  language,
  onApplyNow,
  onBack,
}) {
  const [isEligible, setIsEligible] = useState(null)
  const [expandedSection, setExpandedSection] = useState(null)

  if (!service) return null

  const info = ELIGIBILITY_CRITERIA[service.id]
  if (!info) return null

  const calculateEligibility = () => {
    const verifiedCount = info.requirements.filter(
      (r) => r.status === 'verified'
    ).length
    const isElig = verifiedCount >= 2
    setIsEligible(isElig)
  }

  return (
    <div className="eligibility-page">
      <div className="eligibility-header">
        <button className="back-button" onClick={onBack}>
          ← वापस
        </button>
        <div className="service-banner">
          <h2>{info.title}</h2>
          <p>{info.description}</p>
        </div>
      </div>

      <div className="eligibility-content">
        {/* Benefits Section */}
        <div className="info-section">
          <button
            className="section-header"
            onClick={() =>
              setExpandedSection(expandedSection === 'benefits' ? null : 'benefits')
            }
          >
            <span className="section-icon">💰</span>
            <span>लाभ</span>
            <span className="expand-icon">
              {expandedSection === 'benefits' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'benefits' && (
            <div className="section-content">
              {info.benefits.map((benefit, idx) => (
                <div key={idx} className="benefit-item">
                  <span className="check-mark">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div className="info-section">
          <button
            className="section-header"
            onClick={() =>
              setExpandedSection(expandedSection === 'requirements' ? null : 'requirements')
            }
          >
            <span className="section-icon">✅</span>
            <span>योग्यता जांच</span>
            <span className="expand-icon">
              {expandedSection === 'requirements' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'requirements' && (
            <div className="section-content">
              <button className="check-button" onClick={calculateEligibility}>
                🔍 मेरी योग्यता जांचें
              </button>
              <div className="requirements-list">
                {info.requirements.map((req, idx) => (
                  <div key={idx} className={`requirement-item ${req.status}`}>
                    <span className="status-icon">
                      {req.status === 'verified' ? '✓' : '?'}
                    </span>
                    <span>{req.item}</span>
                    <span className="status-label">
                      {req.status === 'verified' ? 'सत्यापित' : 'लंबित'}
                    </span>
                  </div>
                ))}
              </div>
              {isEligible !== null && (
                <div className={`eligibility-result ${isEligible ? 'eligible' : 'ineligible'}`}>
                  {isEligible ? (
                    <>
                      <h4>🎉 आप पात्र हैं!</h4>
                      <p>आप इस योजना के लिए आवेदन कर सकते हैं</p>
                    </>
                  ) : (
                    <>
                      <h4>ℹ️ कुछ शर्तें पूरी नहीं हैं</h4>
                      <p>अधिक जानकारी के लिए पंचायत से संपर्क करें</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="info-section">
          <button
            className="section-header"
            onClick={() =>
              setExpandedSection(expandedSection === 'documents' ? null : 'documents')
            }
          >
            <span className="section-icon">📄</span>
            <span>आवश्यक दस्तावेज़</span>
            <span className="expand-icon">
              {expandedSection === 'documents' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'documents' && (
            <div className="section-content">
              {info.documents.map((doc, idx) => (
                <div key={idx} className="document-item">
                  <span>📋</span> {doc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Steps Section */}
        <div className="info-section">
          <button
            className="section-header"
            onClick={() =>
              setExpandedSection(expandedSection === 'steps' ? null : 'steps')
            }
          >
            <span className="section-icon">👣</span>
            <span>अगले कदम</span>
            <span className="expand-icon">
              {expandedSection === 'steps' ? '▼' : '▶'}
            </span>
          </button>
          {expandedSection === 'steps' && (
            <div className="section-content">
              <p className="next-steps">{info.nextSteps}</p>
            </div>
          )}
        </div>
      </div>

      <div className="eligibility-footer">
        <button className="apply-button" onClick={onApplyNow}>
          आवेदन शुरू करें →
        </button>
        <p className="footer-text">
          सभी क्षेत्र विकास अधिकारी से मुक्त सहायता प्राप्त करें
        </p>
      </div>
    </div>
  )
}
