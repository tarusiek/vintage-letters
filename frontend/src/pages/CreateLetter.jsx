import React, { useState } from 'react'
import '../styles/CreateLetter.css'

const CreateLetter = () => {
  const [formData, setFormData] = useState({
    topic: '',
    content: '',
    signature: ''
  })
  const [isRolling, setIsRolling] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsRolling(true)

    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setTimeout(() => {
          setShareUrl(result.shareUrl)
          setIsRolling(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Error creating letter:', error)
      setIsRolling(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  if (shareUrl) {
    return (
      <div className="container fade-in">
        <div className="letter-container vintage-paper">
          <h1 className="main-title">Your Letter is Sealed!</h1>
          <div className="seal-complete">
            <div className="seal-large"></div>
          </div>
          <p className="success-message">
            Your letter has been sealed with wax and is ready to be shared.
          </p>
          <div className="share-section">
            <input 
              type="text" 
              value={shareUrl} 
              readOnly 
              className="share-input"
            />
            <button onClick={copyToClipboard} className="vintage-button">
              Copy Link
            </button>
          </div>
          <button 
            onClick={() => setShareUrl('')}
            className="vintage-button secondary"
          >
            Write Another Letter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`container ${isRolling ? 'rolling' : ''}`}>
      <div className={`letter-container vintage-paper ${isRolling ? 'roll-up' : ''}`}>
        <h1 className="main-title">Silent thoughts</h1>
        <p className="subtitle">Send a letter to your favourite ones.</p>
        
        <form onSubmit={handleSubmit} className="letter-form">
          <div className="form-group">
            <label className="vintage-label">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="vintage-input"
              placeholder="My Dearest..."
              required
            />
          </div>

          <div className="form-group">
            <label className="vintage-label">Your Message</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="vintage-input vintage-textarea"
              placeholder="Pour your heart out..."
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label className="vintage-label">Signature</label>
            <input
              type="text"
              name="signature"
              value={formData.signature}
              onChange={handleChange}
              className="vintage-input"
              placeholder="Yours..."
              required
            />
          </div>

          <button type="submit" className="vintage-button send-button">
            Seal & Send
            <div className="seal-preview"></div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateLetter