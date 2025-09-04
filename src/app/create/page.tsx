'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Other']

export default function CreateListing() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [storageStatus, setStorageStatus] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    seller_email: '',
    category: 'Electronics',
    location: 'Palo Alto, CA',
    image: null as File | null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))
  }

  // Test storage bucket on component mount
  useEffect(() => {
    const testStorage = async () => {
      if (!supabase) {
        setStorageStatus('❌ Supabase client not initialized')
        return
      }

      try {
        console.log('Testing storage bucket...')
        const { data, error } = await supabase.storage
          .from('listing-images')
          .list('', { limit: 1 })

        if (error) {
          console.error('Storage test error:', error)
          setStorageStatus(`❌ Storage error: ${error.message}`)
        } else {
          console.log('Storage test successful:', data)
          setStorageStatus('✅ Storage bucket is accessible')
        }
      } catch (err) {
        console.error('Storage test failed:', err)
        setStorageStatus(`❌ Storage test failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    testStorage()
  }, [])

  const uploadImage = async (file: File): Promise<string> => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.')
    }

    try {
      console.log('Starting image upload...')
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `listings/${fileName}`

      console.log('Uploading to path:', filePath)

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file)

      console.log('Upload result:', { uploadData, uploadError })

      if (uploadError) {
        console.error('Storage upload error details:', uploadError)
        throw new Error(`Failed to upload image: ${uploadError.message} (Code: ${uploadError.statusCode})`)
      }

      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      console.log('Public URL:', urlData.publicUrl)
      return urlData.publicUrl
    } catch (error) {
      console.error('Image upload failed with error:', error)
      throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }

      let imageUrl = ''

      // Try to upload image, but don't fail the entire listing if it fails
      if (formData.image) {
        try {
          imageUrl = await uploadImage(formData.image)
        } catch (imageError) {
          console.warn('Image upload failed, trying base64 fallback:', imageError)
          // Fallback to base64 encoding if storage fails
          try {
            const reader = new FileReader()
            imageUrl = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(formData.image!)
            })
            console.log('Using base64 image as fallback')
          } catch (base64Error) {
            console.warn('Base64 conversion also failed, continuing without image:', base64Error)
            // Continue without image - the listing will still be created
          }
        }
      }

      const { error } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          seller_email: formData.seller_email,
          category: formData.category,
          location: formData.location,
          image_url: imageUrl
        })

      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
            🛍️ Create Your Listing
          </h1>
          <p className="text-gray-600">Sell your items to the community</p>
          {storageStatus && (
            <div className="mt-4 p-3 rounded-lg bg-gray-100 text-sm">
              {storageStatus}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="What are you selling?"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Describe your item in detail..."
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seller Email */}
          <div>
            <label htmlFor="seller_email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email *
            </label>
            <input
              type="email"
              id="seller_email"
              name="seller_email"
              required
              value={formData.seller_email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              Buyers will use this email to contact you about your item.
            </p>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Palo Alto, CA"
            />
            <p className="mt-1 text-sm text-gray-500">
              Where is this item located?
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload a clear photo of your item (optional but recommended).
            </p>
          </div>

          {/* Preview */}
          {formData.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="w-full h-48 relative border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Creating...' : '🚀 Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
