import { useState, useEffect, useMemo } from "react"
import loanService from "../services/loanService"
import { t } from "../lib/i18n"

const DEFAULT_LOAN_AMOUNT = 200000

const NEARBY_BANK_OFFERS = [
  {
    id: "sbi-rural",
    bankName: "State Bank of India",
    branch: "Rural Branch",
    distanceKm: 2.1,
    annualInterestRate: 7.2,
    tenureMonths: 48,
    processingFeePercent: 1.0,
    minAmount: 50000,
    maxAmount: 1200000,
    prepayment: "Allowed after 12 months",
    documents: ["Aadhaar Card", "PAN Card", "Land/Income Proof", "Bank Statement (6 months)", "Passport Size Photo"],
  },
  {
    id: "pnb-kisan",
    bankName: "Punjab National Bank",
    branch: "Kisan Seva Branch",
    distanceKm: 3.4,
    annualInterestRate: 7.8,
    tenureMonths: 60,
    processingFeePercent: 0.8,
    minAmount: 75000,
    maxAmount: 1500000,
    prepayment: "Allowed with nominal fee",
    documents: ["Aadhaar Card", "Address Proof", "Income Certificate", "Land Records", "2 Guarantor References"],
  },
  {
    id: "bob-agri",
    bankName: "Bank of Baroda",
    branch: "Agri Credit Desk",
    distanceKm: 4.2,
    annualInterestRate: 8.1,
    tenureMonths: 36,
    processingFeePercent: 0.75,
    minAmount: 100000,
    maxAmount: 1000000,
    prepayment: "No penalty after 24 EMIs",
    documents: ["Aadhaar + PAN", "Farmer ID/KCC Details", "Last 1 year passbook", "Crop/Business Plan", "Photograph"],
  },
]

function calculateLoanBreakdown(principal, annualRate, months, processingFeePercent) {
  const monthlyRate = annualRate / 100 / 12

  if (!principal || principal <= 0 || !months || months <= 0) {
    return {
      emi: 0,
      totalPayable: 0,
      totalInterest: 0,
      processingFee: 0,
      installmentCount: months || 0,
    }
  }

  const emi =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)

  const totalEmiPayable = emi * months
  const processingFee = principal * (processingFeePercent / 100)
  const totalPayable = totalEmiPayable + processingFee

  return {
    emi: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalEmiPayable - principal),
    processingFee: Math.round(processingFee),
    installmentCount: months,
  }
}

const formatCurrency = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`

export default function LoanPage({ uiLanguage }) {
  const [loanOptions, setLoanOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loanAmount, setLoanAmount] = useState(DEFAULT_LOAN_AMOUNT)
  const [selectedNearbyOffer, setSelectedNearbyOffer] = useState(null)
  const [selectedGlobalOption, setSelectedGlobalOption] = useState(null)
  const [globalLoanAmount, setGlobalLoanAmount] = useState(DEFAULT_LOAN_AMOUNT)
  const [locationLabel, setLocationLabel] = useState(null)

  useEffect(() => {
    loadLoanOptions()
  }, [uiLanguage])

  useEffect(() => {
    try {
      const rawLocation = localStorage.getItem(STORAGE_KEYS.location)
      if (!rawLocation) return
      const parsed = JSON.parse(rawLocation)
      const label = parsed?.village || parsed?.district || parsed?.state || parsed?.displayName || null
      setLocationLabel(label)
    } catch {
      setLocationLabel(null)
    }
  }, [])

  const loadLoanOptions = async () => {
    try {
      setLoading(true)
      const result = await loanService.getLoanOptions(uiLanguage)
      setLoanOptions(result.data)
      console.log(`Loan options loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load loan options:", err)
    } finally {
      setLoading(false)
    }
  }

  const nearbyLoanComparisons = useMemo(() => {
    return NEARBY_BANK_OFFERS.map((offer) => ({
      ...offer,
      breakdown: calculateLoanBreakdown(
        Number(loanAmount),
        offer.annualInterestRate,
        offer.tenureMonths,
        offer.processingFeePercent,
      ),
    }))
  }, [loanAmount])

  const parseAnnualRate = (option) => {
    const source = `${option?.interest || ""} ${option?.detail || ""}`
    const match = source.match(/(\d+(\.\d+)?)\s*%/)
    return match ? Number(match[1]) : 8.5
  }

  const parseTenureMonths = (option) => {
    const source = `${option?.tenure || ""} ${option?.detail || ""}`.toLowerCase()
    const yearMatch = source.match(/(\d+)\s*-\s*(\d+)\s*year|(\d+)\s*year/)
    if (yearMatch) {
      const years = Number(yearMatch[2] || yearMatch[3] || yearMatch[1] || 3)
      return years * 12
    }
    const monthMatch = source.match(/(\d+)\s*-\s*(\d+)\s*month|(\d+)\s*month/)
    if (monthMatch) {
      return Number(monthMatch[2] || monthMatch[3] || monthMatch[1] || 36)
    }
    return 36
  }

  const getGlobalDocuments = (option) => {
    const title = (option?.title || "").toLowerCase()
    if (title.includes("crop")) {
      return ["Aadhaar Card", "Land/Crop Proof", "Bank Passbook", "Recent Photograph"]
    }
    if (title.includes("equipment") || title.includes("tractor")) {
      return ["Aadhaar + PAN", "Land Ownership/Lease Proof", "Income Certificate", "Quotation of Equipment"]
    }
    return ["Aadhaar Card", "Address Proof", "Income Proof", "Bank Statement (6 months)", "Photograph"]
  }

  const title = "Loan Options"
  const subtitle = "Available loan schemes for farmers and rural areas"

  const nearbyTitle = "Nearby Bank Loan Comparison"
  const nearbySubtitle = locationLabel
    ? `Estimated offers near ${locationLabel}.`
    : "Estimated offers from nearby branches (location integration pending backend)."

  const selectedBreakdown = selectedNearbyOffer
    ? calculateLoanBreakdown(
        Number(loanAmount),
        selectedNearbyOffer.annualInterestRate,
        selectedNearbyOffer.tenureMonths,
        selectedNearbyOffer.processingFeePercent,
      )
    : null

  const selectedGlobalBreakdown = selectedGlobalOption
    ? calculateLoanBreakdown(
        Number(globalLoanAmount),
        parseAnnualRate(selectedGlobalOption),
        parseTenureMonths(selectedGlobalOption),
        0.5,
      )
    : null

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{t(uiLanguage, 'loanTitle')}</span>
        <p className="mb-4 text-gray-600">{t(uiLanguage, 'loanSubtitle')}</p>

        {loading ? (
          <div className="center-align py-4">
            <p>{t(uiLanguage, 'loanLoading')}</p>
          </div>
        ) : (
          <ul className="collection top-gap">
            {loanOptions.map((item) => (
              <li key={item.id || item.title} className="collection-item">
                <div className="mb-2">
                  <strong className="text-lg">{item.title}</strong>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="bg-blue-100 px-2 py-1 rounded">Amount: {item.amount}</span>
                    <span className="bg-green-100 px-2 py-1 rounded">Interest: {item.interest}</span>
                    <span className="bg-yellow-100 px-2 py-1 rounded">Tenure: {item.tenure}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{item.detail}</p>
                {item.eligibility && (
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>{t(uiLanguage, 'loanEligibility')}</strong> {item.eligibility}
                  </p>
                )}
                <div className="global-option-actions">
                  <button
                    className="nearby-details-btn"
                    onClick={() => {
                      setSelectedGlobalOption(item)
                      setGlobalLoanAmount(DEFAULT_LOAN_AMOUNT)
                    }}
                  >
                    View Complete Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="nearby-loan-section top-gap">
          <div className="nearby-loan-head">
            <h4>{nearbyTitle}</h4>
            <p>{nearbySubtitle}</p>
          </div>

          <div className="nearby-loan-input-row">
            <label htmlFor="loan-amount">Loan Amount</label>
            <input
              id="loan-amount"
              type="number"
              min="10000"
              step="1000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value || 0)))}
            />
          </div>

          <div className="nearby-loan-grid">
            {nearbyLoanComparisons.map((offer) => (
              <article className="nearby-loan-card" key={offer.id}>
                <div className="nearby-loan-card-head">
                  <strong>{offer.bankName}</strong>
                  <small>{offer.branch}</small>
                </div>

                <div className="nearby-tags">
                  <span>{offer.distanceKm} km</span>
                  <span>{offer.annualInterestRate}% p.a.</span>
                  <span>{offer.tenureMonths} months</span>
                </div>

                <div className="nearby-metrics">
                  <p>EMI: <strong>{formatCurrency(offer.breakdown.emi)}</strong></p>
                  <p>Total Payable: <strong>{formatCurrency(offer.breakdown.totalPayable)}</strong></p>
                </div>

                <button className="nearby-details-btn" onClick={() => setSelectedNearbyOffer(offer)}>
                  View Full Loan Details
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>

      {selectedNearbyOffer && selectedBreakdown && (
        <div className="nearby-loan-modal-overlay" onClick={() => setSelectedNearbyOffer(null)}>
          <div className="nearby-loan-modal" onClick={(e) => e.stopPropagation()}>
            <button className="nearby-loan-close" onClick={() => setSelectedNearbyOffer(null)}>
              Close
            </button>

            <h3>{selectedNearbyOffer.bankName}</h3>
            <p className="nearby-loan-modal-sub">{selectedNearbyOffer.branch}</p>

            <div className="nearby-loan-summary-grid">
              <p>Requested Amount: <strong>{formatCurrency(loanAmount)}</strong></p>
              <p>Interest Rate: <strong>{selectedNearbyOffer.annualInterestRate}% p.a.</strong></p>
              <p>Tenure: <strong>{selectedNearbyOffer.tenureMonths} months</strong></p>
              <p>Installments (Stages): <strong>{selectedBreakdown.installmentCount}</strong></p>
              <p>Monthly EMI: <strong>{formatCurrency(selectedBreakdown.emi)}</strong></p>
              <p>Total Interest: <strong>{formatCurrency(selectedBreakdown.totalInterest)}</strong></p>
              <p>Processing Fee: <strong>{formatCurrency(selectedBreakdown.processingFee)}</strong></p>
              <p>Final Amount to Pay: <strong>{formatCurrency(selectedBreakdown.totalPayable)}</strong></p>
            </div>

            <p className="nearby-loan-modal-section">Loan Conditions</p>
            <ul className="nearby-loan-list">
              <li>Loan range: {formatCurrency(selectedNearbyOffer.minAmount)} to {formatCurrency(selectedNearbyOffer.maxAmount)}</li>
              <li>Prepayment rule: {selectedNearbyOffer.prepayment}</li>
            </ul>

            <p className="nearby-loan-modal-section">Documents Required</p>
            <ul className="nearby-loan-list">
              {selectedNearbyOffer.documents.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedGlobalOption && selectedGlobalBreakdown && (
        <div className="nearby-loan-modal-overlay" onClick={() => setSelectedGlobalOption(null)}>
          <div className="nearby-loan-modal" onClick={(e) => e.stopPropagation()}>
            <button className="nearby-loan-close" onClick={() => setSelectedGlobalOption(null)}>
              Close
            </button>

            <h3>{selectedGlobalOption.title}</h3>
            <p className="nearby-loan-modal-sub">{selectedGlobalOption.detail}</p>

            <div className="nearby-loan-input-row">
              <label htmlFor="global-loan-amount">Loan Amount</label>
              <input
                id="global-loan-amount"
                type="number"
                min="10000"
                step="1000"
                value={globalLoanAmount}
                onChange={(e) => setGlobalLoanAmount(Math.max(0, Number(e.target.value || 0)))}
              />
            </div>

            <div className="nearby-loan-summary-grid">
              <p>Requested Amount: <strong>{formatCurrency(globalLoanAmount)}</strong></p>
              <p>Estimated Interest Rate: <strong>{parseAnnualRate(selectedGlobalOption)}% p.a.</strong></p>
              <p>Estimated Tenure: <strong>{parseTenureMonths(selectedGlobalOption)} months</strong></p>
              <p>Installments (Stages): <strong>{selectedGlobalBreakdown.installmentCount}</strong></p>
              <p>Monthly EMI: <strong>{formatCurrency(selectedGlobalBreakdown.emi)}</strong></p>
              <p>Total Interest: <strong>{formatCurrency(selectedGlobalBreakdown.totalInterest)}</strong></p>
              <p>Processing Fee: <strong>{formatCurrency(selectedGlobalBreakdown.processingFee)}</strong></p>
              <p>Final Amount to Pay: <strong>{formatCurrency(selectedGlobalBreakdown.totalPayable)}</strong></p>
            </div>

            <p className="nearby-loan-modal-section">Eligibility</p>
            <ul className="nearby-loan-list">
              <li>{selectedGlobalOption.eligibility || "Eligibility details to be validated by bank branch."}</li>
            </ul>

            <p className="nearby-loan-modal-section">Documents Required</p>
            <ul className="nearby-loan-list">
              {getGlobalDocuments(selectedGlobalOption).map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
