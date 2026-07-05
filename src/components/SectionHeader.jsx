import { Link } from 'react-router-dom'

export default function SectionHeader({ title, to, icon }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
        {icon} {title}
      </h2>
      {to ? (
        <Link to={to} className="text-sm font-medium text-accent hover:text-accent-blue">
          View All
        </Link>
      ) : null}
    </div>
  )
}
