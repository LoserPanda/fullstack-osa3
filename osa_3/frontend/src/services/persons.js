import axios from 'axios';
const url = '/api/persons';

const getAll = () => {
    return axios.get(url)
        .then(response => response.data);
}

const create = (newObject) => {
    return axios.post(url, newObject)
        .then(response => response.data);
}

const remove = (id) => {
    return axios.delete(`${url}/${id}`);
}

const modify = (id, changedPerson) => {
    return axios.put(`${url}/${id}`, changedPerson)
}

export default { getAll, create, remove, modify };