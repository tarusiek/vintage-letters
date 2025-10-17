import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/ViewLetter.css'

const ViewLetter = () => {
  const { id } = useParams()
  const [letter, setLetter] = useState(null)
  const [isUnwrapping, setIsUnwrapping] = useState(false)
  const [isUnwrapped, setIsUnwrapped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch(`/api/letters/${id}`)
        if (response.ok) {
          const data = await response.json()
          setLetter(data)
        } else {
          setError('Letter not found')
        }
      } catch (err) {
        setError('Failed to fetch letter')
      } finally {
        setLoading(false)
      }
    }

    fetchLetter()
  }, [id])

  const handleUnwrap = () => {
    setIsUnwrapping(true)
    setTimeout(() => {
      setIsUnwrapped(true)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="letter-container vintage-paper">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="letter-container vintage-paper">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  if (!isUnwrapped) {
    return (
      <div className="container">
        <div className={`unopened-letter ${isUnwrapping ? 'unwrapping' : ''}`}>
          <h1 className="unopened-title">A Message Awaits You</h1>
          <p className="unopened-subtitle">Someone has sent you a letter!</p>
          <div className="sealed-letter">
            <div className="wax-seal" onClick={handleUnwrap}>
              <div className="seal"></div>
            </div>
            <div className="letter-fold"></div>
          </div>
          <button 
            onClick={handleUnwrap} 
            className="vintage-button unwrap-button"
            disabled={isUnwrapping}
          >
            {isUnwrapping ? 'Unwrapping...' : 'Unwrap Message'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="letter-container vintage-paper unroll">
        <div className="letter-header">
          <h1 className="letter-topic">{letter.topic}</h1>
          <div className="letter-date">
            {new Date(letter.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        
        <div className="letter-content">
          {letter.content.split('\n').map((paragraph, index) => (
            <p key={index} className="letter-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="letter-signature">
          <div className="signature-line"></div>
          <p className="signature-text">{letter.signature}</p>
        </div>
      </div>
    </div>
  )
}

export default ViewLetter