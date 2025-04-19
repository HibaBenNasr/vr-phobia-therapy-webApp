import React, { useEffect, useState } from 'react'

const MainLayout = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get query parameters from the URL
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('userId');
    
        setUserData({ userId });
      }, []);
  return (
    
    <div className='p-5 mt-16'>
      <h1>Page 2</h1>
      {userData ? (
        <div>
          <p>User ID: {userData.userId}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default MainLayout