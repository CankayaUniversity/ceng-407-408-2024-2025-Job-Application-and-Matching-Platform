import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Şimdilik sahte kullanıcı
  const [user, setUser] = useState({
    id: 'a123',
    name: 'Jane',
    surname: 'Doe',
    avatar: 'https://i.pravatar.cc/150?u=a123',
  });

  // Daha sonra buraya backend'den veri çekme logic'i yazarsın
  // useEffect(() => {
  //   axios.get('/api/user/me').then(res => setUser(res.data));
  // }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
