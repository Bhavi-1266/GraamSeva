export default function LoanPage({ title, subtitle, cards }) {
  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{title}</span>
        <p>{subtitle}</p>
        {cards.length > 0 && (
          <ul className="collection top-gap">
            {cards.map((item) => (
              <li key={item.title} className="collection-item">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}