import React, {useEffect, useContext} from 'react';
import {UserContext} from '../contexts/UserContext';
import st_big from '../media/st_big.png';

function AccountDeleted({history}) {
	const {signOut} = useContext(UserContext);
	
	useEffect(() => {
		signOut();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	
	const handleClick = () => {
		history.push('/');
	}
	
	return (				
		<div className='account-deleted-container'>
			<img className='login-logo' src={st_big} alt='Small Talk Logo' onClick={handleClick} />
			
			<h2>We are sorry to hear that you are leaving us.</h2>
			<h2>Thank you for giving Small Talk a try.</h2>
			<h2>Feel free to register a new account with us again!</h2>
		</div>
	);
};

export default AccountDeleted;