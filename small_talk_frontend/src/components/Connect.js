import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import Header from "./Header";
import RenderConnectItems from "./RenderConnectItems";

function Connect({ history }) {
  const { user } = useContext(UserContext);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/users/${user._id}`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => setAllUsers(res));
  }, [user]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const filterSearch = () => {
    let usersArray = allUsers;

    // checks which users are already friends with logged in user
    for (let i = 0; i < usersArray.length; i++) {
      if (usersArray[i].friends.some((friend) => friend._id === user._id))
        usersArray[i].isFriend = true;
    }

    // filters the users based on search query
    if (searchInput) {
      usersArray = usersArray.filter((user) =>
        (user.firstName + " " + user.lastName)
          .trim()
          .toLowerCase()
          .includes(searchInput.trim().toLowerCase())
      );
    }

    return usersArray;
  };

  return (
    <div>
      <Header history={history} />

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
