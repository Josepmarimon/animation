'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Footer from '../../components/Footer'
import AnimatedLogo from '../../components/AnimatedLogo'

interface Wall {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  is_active: boolean
  display_order: number
  posts_count: number
}

export default function AdminWallsPage() {
  const router = useRouter()
  const [walls, setWalls] = useState<Wall[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '💬',
    color: '#6366f1',
    display_order: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    checkAdminAndFetchWalls()
  }, [])

  const checkAdminAndFetchWalls = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!roleData || roleData.role !== 'admin') {
        router.push('/')
        return
      }

      setIsAdmin(true)

      // Fetch all walls
      const { data: wallsData } = await supabase
        .from('walls')
        .select('*')
        .order('display_order', { ascending: true })

      setWalls(wallsData || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('walls')
        .insert({
          ...formData,
          created_by: user.id,
        })

      if (error) throw error

      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '💬',
        color: '#6366f1',
        display_order: 0,
      })
      setShowCreateForm(false)

      // Refresh walls
      await checkAdminAndFetchWalls()
    } catch (err: any) {
      console.error('Error creating wall:', err)
      alert(`Error: ${err.message}`)
    }
  }

  const toggleWallStatus = async (wallId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('walls')
        .update({ is_active: !currentStatus })
        .eq('id', wallId)

      if (error) throw error

      await checkAdminAndFetchWalls()
    } catch (err: any) {
      console.error('Error toggling wall status:', err)
      alert(`Error: ${err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 justify-between items-center">
            <div className="flex items-center">
              <AnimatedLogo />
            </div>
            <Link
              href="/wall"
              className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
            >
              ← Back to Walls
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Walls Management</h1>
            <p className="text-lg text-blue-100">Manage thematic walls</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-gray-100 transition-all shadow-lg"
          >
            {showCreateForm ? 'Cancel' : '+ Create New Wall'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">New Wall</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-100 mb-2">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white text-center text-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-2 py-2 h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full rounded-lg bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-gray-100 transition-all"
            >
              Create Wall
            </button>
          </form>
        )}

        {/* Walls Table */}
        <div className="rounded-2xl bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-white bg-opacity-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Wall</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Slug</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Posts</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Order</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-10">
              {walls.map((wall) => (
                <tr key={wall.id} className="hover:bg-white hover:bg-opacity-5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl"
                        style={{ backgroundColor: `${wall.color}33` }}
                      >
                        {wall.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{wall.name}</div>
                        <div className="text-sm text-blue-200 line-clamp-1">{wall.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-100">/{wall.slug}</td>
                  <td className="px-6 py-4 text-center text-white font-medium">{wall.posts_count}</td>
                  <td className="px-6 py-4 text-center text-white">{wall.display_order}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        wall.is_active
                          ? 'bg-green-500 bg-opacity-20 text-green-100'
                          : 'bg-red-500 bg-opacity-20 text-red-100'
                      }`}
                    >
                      {wall.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleWallStatus(wall.id, wall.is_active)}
                      className="rounded-lg bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 transition-all"
                    >
                      {wall.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {walls.length === 0 && (
            <div className="text-center py-12 text-blue-100">
              No walls yet. Create one!
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
