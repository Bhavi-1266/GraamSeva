import '../styles/DashboardPage.css'

const DASHBOARD_STATS = {
  todaysCalls: 247,
  applicationsProcessed: 1340,
  amountUnlocked: '₹68,50,000',
  changePercent: '+12.5%',
}

const RECENT_ACTIVITIES = [
  {
    id: 1,
    name: 'राम कुमार',
    scheme: 'PM-KISAN',
    status: 'Approved',
    date: '2 घंटे पहले',
    amount: '₹2,000',
  },
  {
    id: 2,
    name: 'रीता देवी',
    scheme: 'Crop Insurance',
    status: 'Processing',
    date: '4 घंटे पहले',
    amount: '₹15,000',
  },
  {
    id: 3,
    name: 'मोहन सिंह',
    scheme: 'MGNREGA',
    status: 'Pending',
    date: '6 घंटे पहले',
    amount: '₹309/day',
  },
  {
    id: 4,
    name: 'दुर्गा वर्मा',
    scheme: 'Soil Health Card',
    status: 'Rejected',
    date: '8 घंटे पहले',
    amount: '-',
  },
]

const LANGUAGE_BREAKDOWN = [
  { lang: 'हिन्दी', calls: 1200, color: '#FF6B6B' },
  { lang: 'भोजपुरी', calls: 850, color: '#4ECDC4' },
  { lang: 'अवधी', calls: 650, color: '#45B7D1' },
  { lang: 'ओडिया', calls: 520, color: '#96CEB4' },
  { lang: 'मराठी', calls: 420, color: '#FFEAA7' },
]

export default function DashboardPage({ onNavigate }) {
  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎯 GraamSeva CSC Dashboard</h1>
          <p className="header-date">
            {new Date().toLocaleDateString('hi-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="header-action">
          <button className="operator-button">👤 CSC Operator</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📞</span>
            <h3>आज की कालें</h3>
          </div>
          <div className="stat-value">{DASHBOARD_STATS.todaysCalls}</div>
          <p className="stat-change">↑ 8% से कल</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📋</span>
            <h3>आवेदन संसाधित</h3>
          </div>
          <div className="stat-value">{DASHBOARD_STATS.applicationsProcessed}</div>
          <p className="stat-change">मासिक कुल</p>
        </div>

        <div className="stat-card highlight">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <h3>रुपये अनलॉक्ड</h3>
          </div>
          <div className="stat-value">{DASHBOARD_STATS.amountUnlocked}</div>
          <p className="stat-change">{DASHBOARD_STATS.changePercent} यह सप्ताह</p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">✅</span>
            <h3>स्वीकृति दर</h3>
          </div>
          <div className="stat-value">87%</div>
          <p className="stat-change">उद्योग औसत से ऊपर</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Recent Applications */}
          <div className="card">
            <div className="card-header">
              <h2>🔄 हाल की गतिविधियाँ</h2>
              <button className="view-all-button">सभी देखें →</button>
            </div>
            <div className="activities-list">
              {RECENT_ACTIVITIES.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.status.toLowerCase()}`}>
                  <div className="activity-info">
                    <div className="activity-name">{activity.name}</div>
                    <div className="activity-scheme">{activity.scheme}</div>
                    <div className="activity-time">⏱️ {activity.date}</div>
                  </div>
                  <div className="activity-status">
                    <span className={`status-badge ${activity.status.toLowerCase()}`}>
                      {activity.status === 'Approved'
                        ? '✅'
                        : activity.status === 'Processing'
                          ? '⏳'
                          : activity.status === 'Pending'
                            ? '❓'
                            : '❌'}
                      {' '}{activity.status === 'Approved' ? 'स्वीकृत' : activity.status === 'Processing' ? 'प्रसंस्करण' : activity.status === 'Pending' ? 'लंबित' : 'अस्वीकृत'}
                    </span>
                    <div className="activity-amount">{activity.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Language Breakdown */}
          <div className="card">
            <div className="card-header">
              <h2>🗣️ भाषा वितरण</h2>
            </div>
            <div className="language-breakdown">
              {LANGUAGE_BREAKDOWN.map((item, idx) => {
                const maxCalls = Math.max(...LANGUAGE_BREAKDOWN.map((l) => l.calls))
                const percentage = (item.calls / maxCalls) * 100
                return (
                  <div key={idx} className="language-stat">
                    <div className="lang-label">
                      <span>{item.lang}</span>
                      <span className="lang-count">{item.calls}</span>
                    </div>
                    <div className="lang-bar">
                      <div
                        className="lang-fill"
                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2>⚡ त्वरित कार्य</h2>
            </div>
            <div className="quick-actions">
              <button className="action-button">
                <span className="action-icon">➕</span>
                <span>नया आवेदन</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🔍</span>
                <span>स्थिति जांचें</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                <span>रिपोर्ट</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🎤</span>
                <span>IVR टेस्ट</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Performance */}
      <div className="card">
        <div className="card-header">
          <h2>📈 योजना प्रदर्शन</h2>
        </div>
        <div className="scheme-table">
          <div className="scheme-row header">
            <div>योजना</div>
            <div>आवेदन</div>
            <div>स्वीकृत</div>
            <div>दर</div>
            <div>राशि</div>
          </div>
          {[
            {
              name: 'PM-KISAN',
              apps: 450,
              approved: 405,
              rate: '90%',
              amount: '₹24.3L',
            },
            {
              name: 'MGNREGA',
              apps: 320,
              approved: 250,
              rate: '78%',
              amount: '₹25.8L',
            },
            {
              name: 'Crop Insurance',
              apps: 180,
              approved: 140,
              rate: '78%',
              amount: '₹14.2L',
            },
            {
              name: 'Soil Health',
              apps: 120,
              approved: 95,
              rate: '79%',
              amount: '₹3.7L',
            },
          ].map((scheme, idx) => (
            <div key={idx} className="scheme-row">
              <div className="scheme-name">{scheme.name}</div>
              <div>{scheme.apps}</div>
              <div>{scheme.approved}</div>
              <div className="rate-badge">{scheme.rate}</div>
              <div className="amount">{scheme.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>
          💡 सहायता: <strong>support@graamseva.in</strong> |{' '}
          <strong>1234-567-8900</strong> (24/7)
        </p>
      </div>
    </div>
  )
}
