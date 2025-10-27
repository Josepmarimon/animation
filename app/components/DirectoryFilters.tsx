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
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Specialization Filter */}
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Specialization
          </label>
          <select
            id="specialization"
            value={selectedSpecialization}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All specializations</option>
            {SPECIALIZATIONS.map((spec) => (
              <option key={spec.value} value={spec.value}>
                {spec.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Country
          </label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedSpecialization && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {SPECIALIZATIONS.find((s) => s.value === selectedSpecialization)?.label}
              <button
                onClick={() => handleFilterChange('specialization', '')}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {selectedCountry && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
              {selectedCountry}
              <button
                onClick={() => handleFilterChange('country', '')}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
