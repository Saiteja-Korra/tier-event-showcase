// // Example component: EventCard.tsx (Visually styled with Tailwind CSS)

// import React from 'react'

// interface EventCardProps {
//   title: string
//   description: string
//   event_date: string
//   tier: string
// }

// const EventCard = ({ title, description, event_date, tier }: EventCardProps) => {
//   const tierColors: Record<string, string> = {
//     free: 'border-gray-300 bg-white',
//     silver: 'border-gray-400 bg-gray-100',
//     gold: 'border-yellow-400 bg-yellow-50',
//     platinum: 'border-purple-500 bg-purple-50',
//   }

//   return (
//     <div
//       className={`border rounded-xl p-6 shadow-md transition hover:shadow-lg ${
//         tierColors[tier] || 'border-gray-200'
//       }`}
//     >
//       <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
//       <p className="text-sm text-gray-600 mb-3">{description}</p>
//       <div className="flex justify-between items-center text-xs text-gray-500">
//         <span className="italic">{event_date}</span>
//         <span className="uppercase font-semibold text-indigo-500">{tier}</span>
//       </div>
//     </div>
//   )
// }

// export default EventCard

import React from 'react'

interface EventCardProps {
  title: string
  description: string
  event_date: string
  tier: string
  image_url: string
}

const EventCard = ({ title, description, event_date, tier, image_url }: EventCardProps) => {
  const tierColors: Record<string, string> = {
    free: 'border-gray-300 bg-white',
    silver: 'border-gray-400 bg-gray-100',
    gold: 'border-yellow-400 bg-yellow-50',
    platinum: 'border-purple-500 bg-purple-50',
  }

  const defaultImage = '/images/Screenshot.png'

  return (
    <div
      className={`border rounded-xl p-6 shadow-md transition hover:shadow-lg ${tierColors[tier] || 'border-gray-200'
        }`}
    >
      {/* Event Image */}
      <img
        src={image_url || defaultImage}
        alt={title}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />


      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {/* Date & Tier */}
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="italic">
          {new Date(event_date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <span className="uppercase font-semibold text-indigo-500">{tier}</span>
      </div>
    </div>
  )
}

export default EventCard
