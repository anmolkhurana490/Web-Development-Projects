import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-around bg-red-700 text-white py-2'>
      <h1 className='font-bold text-2xl'>iTask</h1>
      <ul className='flex gap-16 text-lg'>
        <li className='cursor-pointer hover:font-bold'>Home</li>
        <li className='cursor-pointer hover:font-bold'>Your Tasks</li>
      </ul>
    </nav>
  )
}

export default Navbar
