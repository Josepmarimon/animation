'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

const SPECIALIZATIONS = [
  {
    category: 'Transversal Disciplines',
    options: [
      { value: 'art_director', label: 'Art Director' },
      { value: 'character_designer', label: 'Character Designer' },
      { value: 'scriptwriter', label: 'Scriptwriter (Animation)' },
      { value: 'storyboarder', label: 'Storyboarder' },
      { value: 'concept_artist', label: 'Concept Artist' },
      { value: 'matte_painter', label: 'Matte Painter' },
      { value: 'colorist', label: 'Colorist' },
      { value: 'lighting_designer', label: 'Lighting Designer' },
      { value: 'sound_designer', label: 'Sound Designer' },
      { value: 'foley_artist', label: 'Foley Artist' },
      { value: 'voice_actor', label: 'Voice Actor / Doblador' },
      { value: 'music_composer', label: 'Music Composer (Animation)' },
      { value: 'sound_mixer', label: 'Sound Mixer' },
      { value: 'compositor_general', label: 'Compositor (General)' },
      { value: 'editor', label: 'Editor' },
      { value: 'vfx_artist', label: 'VFX Artist' },
      { value: 'color_grader', label: 'Color Grader' },
      { value: 'render_artist', label: 'Render Artist' },
      { value: 'pipeline_developer', label: 'Pipeline Developer' },
      { value: 'technical_artist', label: 'Technical Artist' },
    ]
  },
  {
    category: 'Education & Community',
    options: [
      { value: 'animation_teacher', label: 'Animation Teacher' },
      { value: 'workshop_facilitator', label: 'Workshop Facilitator' },
      { value: 'festival_curator', label: 'Festival Curator' },
      { value: 'animation_historian', label: 'Animation Historian / Researcher' },
    ]
  },
  {
    category: 'Stop Motion',
    options: [
      { value: 'stop_motion_animator', label: 'Stop Motion Animator' },
      { value: 'puppet_fabricator', label: 'Puppet Fabricator' },
      { value: 'armature_maker', label: 'Armature Maker / Rigging (Stop Motion)' },
      { value: 'model_maker', label: 'Model Maker' },
      { value: 'set_builder', label: 'Set Builder / Prop Maker' },
      { value: 'costume_designer_mini', label: 'Costume Designer (Miniature)' },
      { value: 'cutout_animator', label: 'Cut-Out Animator' },
      { value: 'puppet_designer', label: 'Puppet Designer' },
      { value: 'stop_motion_director', label: 'Stop Motion Director' },
      { value: 'stop_motion_producer', label: 'Stop Motion Producer' },
      { value: 'stop_motion_compositor', label: 'Stop Motion Compositor' },
      { value: 'camera_operator_sm', label: 'Camera Operator (Stop Motion)' },
      { value: 'dop_stop_motion', label: 'Director of Photography (Stop Motion)' },
      { value: 'motion_control_operator', label: 'Technician / Motion Control Operator' },
    ]
  },
  {
    category: 'Techniques & Styles',
    options: [
      { value: 'paper_cutout', label: 'Paper Cut-Out Animation' },
      { value: 'pixilation', label: 'Pixilation' },
      { value: 'rotoscoping', label: 'Rotoscoping' },
      { value: 'sand_animation', label: 'Sand Animation' },
      { value: 'light_animation', label: 'Light Animation' },
      { value: 'paint_on_glass', label: 'Paint-on-Glass Animation' },
      { value: 'experimental_animation', label: 'Experimental Animation' },
      { value: 'hybrid_techniques', label: 'Hybrid Techniques (Stop Motion + 2D / 3D)' },
    ]
  },
  {
    category: 'Focus & Genre',
    options: [
      { value: 'music_video', label: 'Music Video Animation' },
      { value: 'commercial_animation', label: 'Commercial Animation / Publicidad' },
      { value: 'short_film', label: 'Short Film / Feature Film / Series' },
      { value: 'documentary_animation', label: 'Documentary Animation' },
      { value: 'social_project', label: 'Social Project Animation' },
      { value: 'educational_animation', label: 'Educational Animation' },
      { value: 'scientific_viz', label: 'Scientific Visualization' },
      { value: 'activism_animation', label: 'Animation for Change / Activism' },
      { value: 'art_installation', label: 'Art Installation Animation' },
      { value: 'live_events', label: 'Animation for Live Events / Mapping' },
    ]
  },
]

// Flatten for use in dropdown
const FLAT_SPECIALIZATIONS = SPECIALIZATIONS.flatMap(cat => cat.options)

interface DirectoryFiltersProps {
  countries: string[]
}

export default function DirectoryFilters({ countries }: DirectoryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get('specialization') || ''
  )
  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get('country') || ''
  )

  const handleFilterChange = (type: 'specialization' | 'country', value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(type, value)
    } else {
      params.delete(type)
    }

    if (type === 'specialization') {
      setSelectedSpecialization(value)
    } else {
      setSelectedCountry(value)
    }

    startTransition(() => {
      router.push(`/directory?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSelectedSpecialization('')
    setSelectedCountry('')
    startTransition(() => {
      router.push('/directory')
    })
  }

  const hasActiveFilters = selectedSpecialization || selectedCountry

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
      {/* Specialization Dropdown */}
      <div className="relative flex-1 min-w-0">
        <select
          id="specialization"
          value={selectedSpecialization}
          onChange={(e) => handleFilterChange('specialization', e.target.value)}
          disabled={isPending}
          className="w-full h-12 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">All specializations</option>
          {SPECIALIZATIONS.map((category) => (
            <optgroup key={category.category} label={category.category}>
              {category.options.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="relative flex-1 min-w-0">
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => handleFilterChange('country', e.target.value)}
          disabled={isPending}
          className="w-full h-12 pl-4 pr-10 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">All countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="h-12 px-5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
