import { LocalStore } from "./LocalStorageService";

export const baseURL = 'https://chat.cybercode88.com/';

const getHeader = (header = {}) => {
    const { token } = LocalStore.getStore();

    if (token) {
        header = {
            ...header,
            'Authorization': 'Bearer ' + token,
        }
    }

    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...header
    }
}
export default HttpService = {
    Post: async (router, body, header) => {
        const headers = getHeader(header);
        const url = (baseURL + router).replace(/\/\//g, '/');

        return fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        }).then(res => res.json()).catch((error) => console.error(error))
    },
    Get: async (router, header) => {
        const headers = getHeader(header);
        const url = (baseURL + router).replace(/\/\//g, '/');

        return fetch(url, {
            method: 'GET',
            headers
        }).then(res => res.json()).catch((error) => console.error(error))
    }
}