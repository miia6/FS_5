import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async updatedObject => {
  await axios.put(`${baseUrl}/${updatedObject.id}`, updatedObject)
}

const deleteBlog = async blogToDelete => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${blogToDelete.id}`, config)
}

export default { setToken, getAll, create, updateLikes, deleteBlog }