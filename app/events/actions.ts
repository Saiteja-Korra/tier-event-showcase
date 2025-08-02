// // app/actions.ts
// 'use server'

// import { clerkClient, currentUser } from '@clerk/nextjs/server'
// import { revalidatePath } from 'next/cache'

// export async function upgradeUserTier() {
//   // 1. Get the current user from the server-side session.
//   const user = await currentUser()

//   if (!user) {
//     throw new Error('You must be signed in to upgrade your tier.')
//   }

//   try {
//     // 2. Use the Clerk Backend SDK to update the user's public metadata.
//     await clerkClient.users.updateUser(user.id, {
//       publicMetadata: { tier: 'platinum' },
//     })

//     // 3. Invalidate the cache for the events page.
//     // This tells Next.js to re-fetch the data on the next visit,
//     // ensuring the user sees the new events immediately.
//     revalidatePath('/events')

//     return { success: true }
//   } catch (error) {
//     console.error('Failed to upgrade tier:', error)
//     return { success: false, error: 'An unexpected error occurred.' }
//   }
// }
'use server'

import { auth } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function upgradeUserTier() {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('User not authenticated')

    await clerkClient.users.updateUser(userId, {
      publicMetadata: { tier: 'platinum' },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to upgrade tier:', error)
    return { success: false, error: error.message || 'Unknown error' }
  }
}
