import React, { useState } from "react";
import { TopMenu, LeftSideMenu, RightSideMenu } from "./Menus";
import MapGridComponent from "./MapGridComponent";
import Flags from 'country-flag-icons/react/3x2'
import { IoIosStar } from "react-icons/io";
import AllSettings from "./AllSettings";

const ServerInfo = ({ playerData, setPlayerData }) => {
    const Flag = Flags['DE']
    const [showLeftMenu, setShowLeftMenu] = useState(false)
    const [showRightMenu, setShowRightMenu] = useState(false)

    const leftMenuToggle = () => setShowLeftMenu(!showLeftMenu);
    const rightMenuToggle = () => setShowRightMenu(!showRightMenu);

    const setSettingsData = async (newSettings) => {
        let newData = {...playerData}
        newData['settingsData'] = newSettings
        // setPlayerData(newData)
        const response = await fetch('http://localhost:8080/serverInfo', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'attribute': 'settingsData',
                'value': newSettings
            })
        })
        if (response.ok) {
            console.log('Saving successful');
        } else {
            console.log('Error while saving data:', response.statusText);
        }
    }

    return (
        <div className="bg-gray-900 bg-opacity-60 flex overflow-hidden h-[100vh] relative">
            <LeftSideMenu showLeftMenu={showLeftMenu}/>
            <div className="text-white font-sans min-h-screen pl-4 xs:pl-8 sm:pl-12 sm:pr-4 xs:py-2 md:py-4 lg:py-8 flex-1">
                <TopMenu leftMenuToggle={leftMenuToggle} rightMenuToggle={rightMenuToggle}/>

                <div className="h-full pb-16 overflow-y-auto custom-scrollbar">
                    {/* Header Section */}
                    <div className="mb-8 w-2/3 [&>*]:my-3 xs:mt-2 md:mt-6 lg:mt-12">
                        <h1 className="font-semibold text-36">#1 NASA | Noobs Welcome | Conquest 40Hz</h1>
                        <p className="text-18 text-opacity-80 mt-2 content-center uppercase">
                            <Flag height="16" className="inline mr-2" />
                            Conquest Large - Siege of Shanghai - Normal - 40 Hz
                        </p>
                        <p className="text-18 text-opacity-80">
                            Server protected by The_K-50 AntiCheat. Vip !Rules, Questions, Request, Appeal, Visit us: www.epg.gg | Discord https://discord.gg/3r5NK4d
                        </p>
                    </div>

                    {/* Buttons Section */}
                    <div className="si-buttons flex flex-col flex-grow items-center gap-4 mx-2 mb-8 xs:grid xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <button className="si-button bg-green-600 hover:bg-green-700">Join</button>
                        <button className="si-button">Spectate</button>
                        <button className="si-button">Join as Commander</button>
                        <button className="si-button"> <IoIosStar className="inline text-2xl" /> 13672</button>
                    </div>

                    {/* Stats Section */}
                    <div className="flex gap:8 gap-12 md:gap-32 mb-8">
                        {playerData && Object.entries(playerData.playerStats).map(([item, value]) => {
                            if (item !== '_id') {
                                return (<div key={item}>
                                    <p className="text-18 font-bold uppercase">{item}</p>
                                    <p className="text-30">{value.val1 + value.sep + value.val2}</p>
                                </div>)
                            }
                        })}
                    </div>

                    {playerData && <AllSettings settingsData={playerData.settingsData} setSettingsData={setSettingsData} />}

                    {/* Map Rotation Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4 uppercase">Map Rotation</h2>
                        <div className="flex flex-col items-center sm:grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-x-4 gap-y-8 mr-2">
                            {Array(10).fill().map((_, index) => {
                                return <MapGridComponent key={index} map={{ image: "./src/assets/dawnbreaker-1.png", title: "Conquest Large Dawnbreaker" }} />
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <RightSideMenu showRightMenu={showRightMenu} />
        </div>
    );
};

export default ServerInfo;