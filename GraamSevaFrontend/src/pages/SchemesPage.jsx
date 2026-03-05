export default function SchemesPage({ title, cards }) {
  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{title}</span>
        <ul className="collection">
          {cards.map((item) => (
            <li key={item.title} className="collection-item">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}