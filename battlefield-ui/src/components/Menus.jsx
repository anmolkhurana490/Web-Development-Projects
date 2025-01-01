import React from "react";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { RiTeamLine } from "react-icons/ri";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaPowerOff, FaLayerGroup } from "react-icons/fa";

export const TopMenu = ({ leftMenuToggle, rightMenuToggle }) => {
    return (
        <div className="browser-breadcrumb items-center text-white py-3">
            <div className="flex items-center gap-2 xs:gap-6 text-18">
                <IoIosArrowBack />
                <button className="">Multiplayer</button>
                <div>/</div>
                <button className="">Server Browser</button>
                <div>/</div>
            </div>
            <div className="flex justify-between items-center mx-4">
                <h1 className="text-36 font-semibold uppercase my-1">Server Info</h1>
                <div className="menu-buttons space-x-2 text-36">
                    <button className="sm:hidden p-1" onClick={leftMenuToggle}><IoMenu /></button>
                    <button className="sm:hidden p-1" onClick={rightMenuToggle}><FaLayerGroup /></button>
                </div>
            </div>
        </div>
    );
};


export const LeftSideMenu = ({ showLeftMenu }) => {
    return (
        <div className={"text-menu text-white h-full px-4 py-8 flex-col justify-between items-center border-r border-gray-500 hidden sm:flex flex-shrink-0 overflow-y-auto custom-scrollbar max-sm:absolute max-sm:bg-gray-900 " + (showLeftMenu ? "max-sm:flex" : '')}>
            <div className="left-menu-center my-auto space-y-4">
                <ul className="left-menu-games space-y-4">
                    <li className=""></li>
                    <li className=""></li>
                    <li className=""></li>
                    <li className=""></li>
                </ul>
                <ul className="left-menu-others space-y-4">
                    <li className=""></li>
                    <li className=""></li>
                    <li className=""></li>
                </ul>
            </div>
            <ul className="left-menu-miscs py-4 space-y-8">
                <li className=""><FaCircleQuestion /></li>
                <li className=""><FaPowerOff /></li>
            </ul>
        </div>
    );
};

export const RightSideMenu = ({ showRightMenu }) => {
    return (
        <div className={"right-menu text-white flex-shrink-0 p-4 sm:mr-8 py-16 h-full hidden sm:block overflow-y-auto custom-scrollbar max-sm:bg-gray-900 " + (showRightMenu ? "max-sm:block max-sm:absolute" : '')}>
            <ul className="right-menu-invite space-y-4">
                <RiTeamLine />
                <button className="bg-gray-300 w-[40px] h-[40px] text-gray-800 text-3xl flex items-center justify-center hover:bg-white"> <IoIosAdd /> </button>
                <input name="invite" type="radio" />
                <li className=""></li>
                <input name="invite" type="radio" />
                <li className=""></li>
            </ul>
        </div>
    );
};