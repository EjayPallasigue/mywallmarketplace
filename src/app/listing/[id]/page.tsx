'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, Listing } from '@/lib/supabase'

export default function ListingDetail() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMessageForm, setShowMessageForm] = useState(false)
  const [messageData, setMessageData] = useState({
    buyer_email: '',
    message: ''
  })
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchListing(params.id as string)
    }
  }, [params.id])

  const fetchListing = async (id: string) => {
    try {
      if (!supabase) {
        console.error('Supabase client not initialized. Please check your environment variables.')
        router.push('/')
        return
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setListing(data)
    } catch (error) {
      console.error('Error fetching listing:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingMessage(true)

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized. Please check your environment variables.')
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          listing_id: listing!.id,
          buyer_email: messageData.buyer_email,
          seller_email: listing!.seller_email,
          message: messageData.message
        })

      if (error) throw error

      // Here you would typically trigger an email notification
      // For now, we'll just show a success message
      alert('Message sent successfully! The seller will be notified.')
      setShowMessageForm(false)
      setMessageData({ buyer_email: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Browse
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Image */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg">
            {listing.image_url ? (
              <Image
                src={listing.image_url}
                alt={listing.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-lg">📷 No Image Available</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {listing.category}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                Listed {formatDate(listing.created_at)}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-500 text-sm">4.8 (24 reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {listing.title}
            </h1>
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              {formatPrice(listing.price)}
            </div>
            <div className="flex items-center space-x-2 text-gray-600 mb-6">
              <span className="text-lg">📍</span>
              <span className="text-lg">{listing.location}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
              {listing.description}
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💬 Contact Seller</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Interested in this item? Send a message to the seller to arrange a meeting or ask questions.
            </p>
            
            {!showMessageForm ? (
              <button
                onClick={() => setShowMessageForm(true)}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💬 Message Seller
              </button>
            ) : (
              <form onSubmit={handleMessageSubmit} className="space-y-6">
                <div>
                  <label htmlFor="buyer_email" className="block text-sm font-bold text-gray-700 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="buyer_email"
                    required
                    value={messageData.buyer_email}
                    onChange={(e) => setMessageData(prev => ({ ...prev, buyer_email: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={messageData.message}
                    onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Hi! I'm interested in your item. Could we arrange a time to meet?"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageForm(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    {sendingMessage ? 'Sending...' : '📤 Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
