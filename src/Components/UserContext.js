import React, { createContext } from 'react';

export const UserContext = createContext({
  userId: '',
  userName: '',
  setUserId: () => {},
  setUserName: () => {},
  handleLogin: () => {},
});
