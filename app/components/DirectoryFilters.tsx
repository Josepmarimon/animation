'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

const SPECIALIZATIONS = [
  { value: '2d_animation', label: '2D Animation' },
  { value: '3d_animation', label: '3D Animation' },
  { value: 'character_design', label: 'Character Design' },
  { value: 'storyboard', label: 'Storyboard' },
  { value: 'motion_graphics', label: 'Motion Graphics' },
  { value: 'visual_effects', label: 'VFX' },
  { value: 'stop_motion', label: 'Stop Motion' },
  { value: 'concept_art', label: 'Concept Art' },
  { value: 'rigging', label: 'Rigging' },
  { value: 'compositing', label: 'Compositing' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'texturing', label: 'Texturing' },
  { value: 'modeling', label: 'Modeling' },
]

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
          {SPECIALIZATIONS.map((spec) => (
            <option key={spec.value} value={spec.value}>
              {spec.label}
            </option>
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
