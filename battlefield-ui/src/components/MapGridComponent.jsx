import React from 'react'

const MapGridComponent = ({map}) => {
    return (
        <div className="max-w-80 max-h-56 flex flex-col">
            <div className={`bg-[url('./src/assets/dawnbreaker-1.png')] bg-cover h-24`}></div>
            <p className="bg-gray-900 text-18 font-semibold px-6 py-4 uppercase">{map.title}</p>
        </div>
    )
}

export default MapGridComponent
