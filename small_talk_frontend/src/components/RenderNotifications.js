import React from 'react';
import NotificationItem from './NotificationItem';

function RenderNotifications({notifications}) {
	return (
		notifications.map(notification => <NotificationItem key={notification._id} notification={notification} />)
	);
};

export default RenderNotifications;