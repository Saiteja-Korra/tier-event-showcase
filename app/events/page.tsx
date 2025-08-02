// // app/events/page.tsx
// import { currentUser } from "@clerk/nextjs/server";
// import { supabase } from "@/lib/supabaseClient"; // We'll create this next
// import EventCard from "@/components/EventCard";   // We'll create this too

// const tierOrder = ["free", "silver", "gold", "platinum"];

// export default async function EventsPage() {
//   const user = await currentUser();

//   if (!user) return <div className="p-6">Please log in to view events.</div>;

//   const userTier = (user.publicMetadata.tier as string) || "free";
//   const allowedTiers = tierOrder.slice(0, tierOrder.indexOf(userTier) + 1);

//   const { data: events, error } = await supabase
//     .from("events")
//     .select("*")
//     .in("tier", allowedTiers);

//   if (error) {
//   console.error("Supabase error:", error.message);
//   return <div>Error loading events: {error.message}</div>;
//     }


//   return (
//       <div className="max-w-7xl mx-auto p-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">Available Events</h1>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {events.map(event => (
//                   <EventCard key={event.id} {...event} />
//               ))}
//           </div>
//       </div>

//   );
// }

// // 'use client'

// // import { useEffect, useState } from 'react'
// // import { useUser } from '@clerk/nextjs'
// // import { createClient } from '@supabase/supabase-js'
// // import EventCard from '@/components/EventCard'

// // const supabase = createClient(
// //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// // )

// // const tierOrder = ['free', 'silver', 'gold', 'platinum']

// // export default function EventsPage() {
// //   const { user, isLoaded } = useUser()
// //   const [events, setEvents] = useState<any[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [error, setError] = useState<string | null>(null)

// //   const userTier = (user?.publicMetadata?.tier as string) || 'free'
// //   const allowedTiers = tierOrder.slice(0, tierOrder.indexOf(userTier) + 1)

// //   useEffect(() => {
// //     if (!isLoaded || !user) return

// //     const fetchEvents = async () => {
// //       setLoading(true)
// //       const { data, error } = await supabase
// //         .from('events')
// //         .select('*')

// //       if (error) {
// //         setError(error.message)
// //       } else {
// //         setEvents(data)
// //       }

// //       setLoading(false)
// //     }

// //     fetchEvents()
// //   }, [isLoaded, user])

// //   const handleTierUpgrade = async () => {
// //     try {
// //       await user?.update({
// //         publicMetadata: { tier: 'platinum' },
// //       })
// //       window.location.reload()
// //     } catch (err) {
// //       alert('Failed to upgrade tier.')
// //     }
// //   }

// //   if (!isLoaded) return <div className="p-6">Loading user...</div>
// //   if (!user) return <div className="p-6">Please log in to view events.</div>
// //   if (loading) return <div className="p-6">Loading events...</div>
// //   if (error) return <div className="p-6 text-red-600">Error: {error}</div>

// //   return (
// //     <div className="max-w-7xl mx-auto p-6">
// //       <h1 className="text-2xl font-bold text-gray-800 mb-4">Available Events</h1>

// //       <button
// //         onClick={handleTierUpgrade}
// //         className="mb-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
// //       >
// //         Simulate Tier Upgrade to Platinum
// //       </button>

// //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //         {events.map((event) => {
// //           const isAllowed = allowedTiers.includes(event.tier)
// //           return (
// //             <div key={event.id} className="relative">
// //               <EventCard {...event} />
// //               {!isAllowed && (
// //                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl text-red-600 text-center font-semibold text-sm p-4">
// //                   Upgrade to <span className="ml-1 font-bold">Platinum</span> to access this event.
// //                 </div>
// //               )}
// //             </div>
// //           )
// //         })}
// //       </div>
// //     </div>
// //   )
// // }


// // app/events/page.tsx


//'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import EventCard from '@/components/EventCard'
import { upgradeUserTier } from '@/app/events/actions'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Event type definition
interface Event {
  id: number
  title: string
  description: string
  event_date: string
  tier: string
  image_url: string
}

export default function EventsPage() {
  const { user, isLoaded } = useUser()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpgrading, setIsUpgrading] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setLoading(false)
      return
    }

    const fetchEvents = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('events').select('*')

      if (error) {
        setError(error.message)
      } else {
        setEvents(data || [])
      }
      setLoading(false)
    }

    fetchEvents()
  }, [isLoaded, user])

  const handleTierUpgrade = async () => {
    setIsUpgrading(true)
    const result = await upgradeUserTier()
    if (!result.success) {
      setError(result.error || 'Failed to upgrade tier.')
    } else {
      await user?.reload()
    }
    setIsUpgrading(false)
  }

  if (!isLoaded || loading) return <div className="p-6 text-center">Loading...</div>
  if (!user) return <div className="p-6 text-center">Please log in to view events.</div>
  if (error) return <div className="p-6 text-red-600 text-center">Error: {error}</div>

  const currentTier = (user.publicMetadata.tier as string) || 'free'

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Available Events</h1>
          <p className="text-md text-gray-500 mt-1">
            Your current tier:{' '}
            <span className="font-semibold capitalize text-indigo-600">
              {currentTier}
            </span>
          </p>
        </div>
        <button
          onClick={handleTierUpgrade}
          disabled={isUpgrading || currentTier === 'platinum'}
          className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUpgrading ? 'Upgrading...' : 'Simulate Upgrade to Platinum'}
        </button>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>No events available for your current tier.</p>
        </div>
      )}
    </div>
  )
}
