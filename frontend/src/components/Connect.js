import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import Header from './Header';
import RenderConnectItems from './RenderConnectItems';

function Connect() {
  const { user } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => setAllUsers(res));
  }, []);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filterSearch = () => {
    let usersArray = allUsers;
    // filters the users based on search query
    if (searchInput) {
      usersArray = usersArray.filter((user) =>
        (user.firstName + ' ' + user.lastName).trim().toLowerCase().includes(searchInput.trim().toLowerCase())
      );
    }

    return usersArray;
  };

  /* <RenderConnectItems users={filterSearch()} />
    the users prop calls a filterSearch insted of referencing it
    because it will be invoked when the Connect component is being
    rendered/re-rendered
  */
  return (
    <div>
      <Header />

      <div className="content-body">
        <form className="connect-form" onSubmit={(e) => e.preventDefault()}>
          <input
            className="connect-input"
            type="text"
            onChange={handleChange}
            placeholder="Search for a user..."
            value={searchInput}
          />
        </form>

        <div className="connect-users-container">
          <RenderConnectItems users={filterSearch()} />
        </div>
      </div>
    </div>
  );
}

export default Connect;
