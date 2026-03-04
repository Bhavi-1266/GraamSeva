import '../styles/ServicesPage.css'

const SERVICES = [
  {
    id: 1,
    name: 'PM-KISAN',
    icon: '🌾',
    desc: 'किसान सम्मान निधि योजना',
    details: '₹6,000 वार्षिक सहायता',
    eligible: true,
  },
  {
    id: 2,
    name: 'Crop Insurance',
    icon: '🛡️',
    desc: 'प्रधानमंत्री फसल बीमा योजना',
    details: 'फसल नुकसान की सुरक्षा',
    eligible: true,
  },
  {
    id: 3,
    name: 'MGNREGA',
    icon: '💼',
    desc: 'महात्मा गांधी रोजगार गारंटी',
    details: '100 दिन की गारंटीशुदा कार्य',
    eligible: true,
  },
  {
    id: 4,
    name: 'Soil Health Card',
    icon: '🌱',
    desc: 'मिट्टी स्वास्थ्य कार्ड योजना',
    details: 'मिट्टी परीक्षण और सहायता',
    eligible: false,
  },
  {
    id: 5,
    name: 'Dairy Subsidy',
    icon: '🐄',
    desc: 'पशुपालन और डेयरी सहयोग',
    details: '₹10,000 तक की सहायता',
    eligible: true,
  },
  {
    id: 6,
    name: 'Farmer Credit',
    icon: '🏦',
    desc: 'किसान क्रेडिट कार्ड योजना',
    details: 'आसान ब्याज दरों पर ऋण',
    eligible: true,
  },
]

export default function ServicesPage({
  userProfile,
  language,
  onServiceSelect,
  onBack,
}) {
  return (
    <div className="services-page">
      <div className="services-header">
        <button className="back-button" onClick={onBack}>
          ← वापस
        </button>
        <div className="user-greeting">
          <h2>नमस्ते, {userProfile.name}! 👋</h2>
          <p className="subtitle">उपलब्ध सरकारी योजनाएं:</p>
        </div>
      </div>

      <div className="services-content">
        <div className="services-list">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={`service-card ${
                !service.eligible ? 'not-eligible' : ''
              }`}
            >
              <div className="service-icon">{service.icon}</div>
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-desc">{service.desc}</p>
                <p className="service-details">{service.details}</p>
              </div>
              <div className="service-status">
                {service.eligible ? (
                  <span className="badge eligible">
                    ✓ पात्र हो सकते हैं
                  </span>
                ) : (
                  <span className="badge not-eligible">
                    ✗ पात्र नहीं
                  </span>
                )}
              </div>
              <button
                className={`service-action ${
                  !service.eligible ? 'disabled' : ''
                }`}
                onClick={() => service.eligible && onServiceSelect(service)}
                disabled={!service.eligible}
              >
                जानकारी लें →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="services-footer">
        <p>
          💡 तुरंत सहायता के लिए: <strong>1234-567-8900</strong> पर कॉल करें
        </p>
      </div>
    </div>
  )
}
