import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeUpdate, handleBlogDeletion, currentUser }) => {            // handleLikeUpdate, handleBlogDeletion, currentUser

  const [showDetails, setShowDetails] = useState(false)
  const [localLikes, setLocalLikes] = useState(blog.likes)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }


  const handleLike = async () => {
    const updatedBlog = {...blog, likes: localLikes + 1, id: blog.id}
    setLocalLikes(localLikes + 1)
    //handleLikeUpdate()
    try {
      await blogService.updateLikes(updatedBlog)
      //setLocalLikes(localLikes + 1)
      handleLikeUpdate()
    } catch (error) {
      console.log("Error updating likes")
    }
  }

  const handleDeletion = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog)
        handleBlogDeletion(blog)
      } catch (error) {
        console.log("Error deleting blog")
        console.log(error.message)
      }
    }
  }


  return (
    <div style={blogStyle} data-testid={`blogsTest`}>
      <p>{blog.title} {blog.author}</p>
      <button onClick={toggleDetails}> {showDetails ? 'hide' : 'view'} </button>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes: {localLikes? localLikes : 0}{' '} 
            <button onClick={handleLike}>like</button>
          </p>
          <p>{blog.user.username}</p>
          {currentUser && currentUser.username === blog.user.username && (
            <button onClick={handleDeletion}>remove</button>
          )}
        </div>
      )}
    </div>
  )

}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  //handleLikeUpdate: PropTypes.func.isRequired,
  //handleBlogDeletion: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
}


export default Blog