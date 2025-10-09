import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:8000/api/';

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (!error.response) {
        return Promise.reject(error);
    }

    if (error.response.status === 401 && !refresh) {
        refresh = true;

        try {
            const response = await axios.post('/api/token/refresh/', {
                refresh: localStorage.getItem('refresh_token')
            }, {
                headers: {
                  'Content-Type': 'application/json',
                }
              });

            if (response.status === 200) {
                const newAccess = response.data['access'];
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
                localStorage.setItem('access_token', newAccess);
                if (response.data.refresh) {
                    localStorage.setItem('refresh_token', response.data.refresh);
                }

                // retry original request with new token
                const config = { ...error.config };
                config.headers = {
                    ...(config.headers || {}),
                    Authorization: `Bearer ${newAccess}`
                };
                refresh = false;
                return axios(config);
            }
        } catch (e) {
            // refresh failed, clear tokens
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        } finally {
            refresh = false;
        }
    }

    return Promise.reject(error);
});