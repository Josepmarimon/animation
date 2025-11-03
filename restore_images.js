const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function restoreImages() {
  const portfolioProjects = [
    {
      id: "1761560446377",
      url: "https://ejsaxspiunmyebveufon.supabase.co/storage/v1/object/public/portfolio/a5b0b2f1-562c-444b-b4f5-d267b2829916/1761560445506_y6s9wj.png",
      type: "image",
      title: "Animation Frames",
      description: "Expression frames of the character Pitiriflori",
      is_featured: true
    },
    {
      id: "1761560693932",
      url: "https://ejsaxspiunmyebveufon.supabase.co/storage/v1/object/public/portfolio/a5b0b2f1-562c-444b-b4f5-d267b2829916/1761560693140_86vl9b.png",
      type: "image",
      title: "Animation Frames 2",
      description: "Expressive Frames of the character Rakatan",
      is_featured: false
    },
    {
      id: "1761560723962",
      url: "https://ejsaxspiunmyebveufon.supabase.co/storage/v1/object/public/portfolio/a5b0b2f1-562c-444b-b4f5-d267b2829916/1761560723208_mfvl86.png",
      type: "image",
      title: "Walking frames",
      description: "Walking and Jumping",
      is_featured: false
    }
  ]

  const { error } = await supabase
    .from('profiles')
    .update({ portfolio_projects: portfolioProjects })
    .eq('id', 'a5b0b2f1-562c-444b-b4f5-d267b2829916')

  if (error) {
    console.error('Error restoring images:', error)
  } else {
    console.log('✓ Successfully restored 3 portfolio images')
  }
}

restoreImages()
