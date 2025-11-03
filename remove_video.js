// Quick script to remove video from portfolio
// Run with: node remove_video.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function removeVideo() {
  // Get all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, portfolio_projects')
  
  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  for (const profile of profiles) {
    if (!profile.portfolio_projects) continue
    
    const filtered = profile.portfolio_projects.filter(p => {
      const url = p.url || ''
      const isVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
      if (isVideo) {
        console.log(`Removing video: ${url} from profile ${profile.id}`)
      }
      return !isVideo
    })
    
    if (filtered.length !== profile.portfolio_projects.length) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ portfolio_projects: filtered })
        .eq('id', profile.id)
      
      if (updateError) {
        console.error(`Error updating profile ${profile.id}:`, updateError)
      } else {
        console.log(`Updated profile ${profile.id}`)
      }
    }
  }
  
  console.log('Done!')
}

removeVideo()
