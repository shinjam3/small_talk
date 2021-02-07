import React, {useState} from 'react';
import Header from './Header';
import ProfileNav from './ProfileNav';
import Notifications from './Notifications';
import EditProfile from './EditProfile';
import Settings from './Settings';

function Profile({history}) {
	const [currentPage, setCurrentPage] = useState('notifications');	
	
	const handleSetPage = (page) => {
		setCurrentPage(page);
	}
	
	const conditionalRender = () => {
		if (currentPage==='notifications') {
			return (<Notifications />);
		}
		else if (currentPage==='edit') {
			return (<EditProfile />)
		}
		else {
			return (<Settings history={history} />);
		}
	}
	
	return (
		<div>
			<Header history={history} />
			<ProfileNav history={history} page={handleSetPage} />
			
			<div className='content-body'>
				{conditionalRender()}
			</div>
		</div>
	);
};

export default Profile;
