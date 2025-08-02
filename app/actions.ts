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
// app/actions.ts
'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

// Define a specific return type for the server action
interface ActionResult {
  success: boolean;
  error?: string;
}

export async function upgradeUserTier(): Promise<ActionResult> {
  const user = await currentUser()

  if (!user) {
    // This case should ideally not be hit if called from a logged-in client,
    // but it's good practice for robust server actions.
    return { success: false, error: 'You must be signed in to upgrade your tier.' }
  }

  try {
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { tier: 'platinum' },
    })

    revalidatePath('/events')

    return { success: true }
  } catch (error) {
    console.error('Failed to upgrade tier:', error)
    // Avoid returning the raw error to the client for security
    return { success: false, error: 'An unexpected error occurred.' }
  }
}
