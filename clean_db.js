const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function clean() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, portfolio_projects')
  
  console.log('Found profiles:', profiles?.length || 0)
  
  for (const profile of profiles || []) {
    console.log(`\nProfile ${profile.id}:`)
    console.log('  Current portfolio_projects:', JSON.stringify(profile.portfolio_projects, null, 2))
    
    if (!profile.portfolio_projects || profile.portfolio_projects.length === 0) {
      console.log('  No portfolio items')
      continue
    }
    
    // Set portfolio to empty array to remove everything
    const { error } = await supabase
      .from('profiles')
      .update({ portfolio_projects: [] })
      .eq('id', profile.id)
    
    if (error) {
      console.error('  Error:', error)
    } else {
      console.log('  ✓ Cleared all portfolio items')
    }
  }
}

clean()
