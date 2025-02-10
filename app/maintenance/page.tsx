import Image from 'next/image'
import React from 'react'

const page = () => {

  return (
    <>
    <div className="flex flex-col items-center justify-center gap-20">
         <h1 className='text-green-700 outfit-light text-3xl'>
            We are currently under maintenance. Please cook with us later. 🙏
        </h1>
        <Image src="/2.gif" alt="Under Maintenance" width={300} height={300} className='shadow-xl rounded-lg'/>
        
    </div>
   </>
  )
}

export default page