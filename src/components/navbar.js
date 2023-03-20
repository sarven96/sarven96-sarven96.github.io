import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = () => {
    const [nav, setNav] = useState(false);

    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className='flex justify-between items-center h-24  mx-auto px-4'>
            <h1 className='w-full text-4xl font-bold'>CLASS.</h1>
            <ul className='hidden md:flex'>
                
                
                <a href='https://github.com/sarven96' className='p-4 text-2xl'>GitHub</a>
                <a href='https://linkedin.com/in/sarvendrensugumaren' className='p-4 text-2xl'>LinkedIn</a>
            </ul>
            <div onClick={handleNav} className='block md:hidden'>
                {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
            </div>
            <ul className={nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#ffffff] ease-in-out duration-500' : 'ease-in-out duration-500 fixed left-[-100%]'}>
                <h1 className='w-full text-3xl font-bold m-4'>CLASS.</h1>
                
                
                <a href='https://github.com/sarven96' className='p-4 border-b border-gray-600'>GitHub</a>
                <a href='https://linkedin.com/in/sarvendrensugumaren' className='p-4'>LinkedIn</a>
            </ul>
        </div>
    );
};

export default Navbar;
