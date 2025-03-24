const BASE_URL = 'http://localhost:5098/api';

export const environment = {
  apiEndpoints: {
    auth: `${BASE_URL}/Auth`,
    user: `${BASE_URL}/User`,
    role: `${BASE_URL}/Role`,
    menu: `${BASE_URL}/Menu`,
    link: `${BASE_URL}/Link`,
  },
};
