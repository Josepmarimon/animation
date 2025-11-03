const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPostsCounts() {
  // Get walls with their posts_count field
  const { data: walls, error: wallsError } = await supabase
    .from('walls')
    .select('id, slug, name, posts_count')
    .eq('is_active', true)
    .order('display_order');
  
  if (wallsError) {
    console.error('Error fetching walls:', wallsError);
    return;
  }
  
  console.log('\n=== Posts Count from walls table ===');
  for (const wall of walls) {
    console.log(`${wall.name} (${wall.slug}): ${wall.posts_count || 0} posts`);
  }
  
  // Now count actual posts for each wall
  console.log('\n=== Actual posts count from wall_posts table ===');
  for (const wall of walls) {
    const { count, error } = await supabase
      .from('wall_posts')
      .select('*', { count: 'exact', head: true })
      .eq('wall_id', wall.id);
    
    if (error) {
      console.error(`Error counting posts for ${wall.name}:`, error);
    } else {
      console.log(`${wall.name} (${wall.slug}): ${count} actual posts`);
    }
  }
}

checkPostsCounts();
