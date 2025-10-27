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

  const handleSpecializationClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Toggle: if clicking the same specialization, clear it
    const newValue = selectedSpecialization === value ? '' : value

    if (newValue) {
      params.set('specialization', newValue)
    } else {
      params.delete('specialization')
    }

    setSelectedSpecialization(newValue)

    startTransition(() => {
      router.push(`/directory?${params.toString()}`)
    })
  }

  const handleCountryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set('country', value)
    } else {
      params.delete('country')
    }

    setSelectedCountry(value)

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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Specialization Quick Filters */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Specialization
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALIZATIONS.map((spec) => {
            const isSelected = selectedSpecialization === spec.value
            return (
              <button
                key={spec.value}
                onClick={() => handleSpecializationClick(spec.value)}
                disabled={isPending}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {spec.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Country Filter */}
      <div>
        <label
          htmlFor="country"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Country
        </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={isPending}
          className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
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
  )
}
