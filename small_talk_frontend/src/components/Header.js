import React, {useState} from 'react';
import {NavLink} from 'react-router-dom';

import st_small from '../media/st_small.png';
import st_big from '../media/st_big.png';
import profile from '../media/profile.png';

function Header({history}) {
	const [headerContainerClass, setContainerClass] = useState('header-container');
	
	
	const openNav = () => {
		setContainerClass('header-container show');
	};
	
	
	const closeNav = () => {
		setContainerClass('header-container');
	};
	
	
	const handleLogoClick = () => {
		history.push('/dashboard/messages');
	};
	
	
	const handleProfileClick = () => {
		history.push('/dashboard/profile');
	}
	
	
	return (
		<div>
			<div className={headerContainerClass}>
				<img className='header-logo' src={st_small} alt='Small Talk logo' onClick={handleLogoClick} />
				
				<nav className='header-nav-container'>
					<NavLink className='header-nav-link'	exact to='/dashboard/messages'>Messages</NavLink>
					<NavLink className='header-nav-link'	exact to='/dashboard/connect'>Connect</NavLink>
					<NavLink className='header-nav-link'	exact to='/dashboard/friends'>Friends</NavLink>
				</nav>
				
				<img className='header-profile' onClick={handleProfileClick} src={profile} alt='Profile icon' />
				
				<div className='header-mobile-close' onClick={closeNav}>&times;</div>
			</div>
		
			<div className='header-mobile-container'>
				<div className='header-mobile-open' onClick={openNav}>&#9776;</div>
				<img className='header-logo-big' onClick={handleLogoClick} src={st_big} alt='Small Talk logo' />
				<img className='header-logo mobile' onClick={handleLogoClick} src={st_small} alt='Small Talk logo' />
				<div className='header-mobile-open hide'>&#9776;</div> 
				{/*	added a hidden duplicate navigation open button on the right side of mobile nav bar in order to keep logo centered in the top mobile nav bar */}
			</div>
		</div>
	);
};

export default Header;