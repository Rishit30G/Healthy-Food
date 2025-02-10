import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-green-600/15 py-5">
        <div className="container mx-auto text-center text-green-800 outfit-regular flex items-center justify-center">
            <p className="flex items-center">
              Made for 
              <img className="inline-block object-contain size-12 mb-2" src="/vege.gif" alt="Vegetable" loading="eager" />
              consumers
            </p>
          </div>
    </footer>
  )
}

export default Footer;