import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  //const [loginVisible, setLoginVisible] = useState(false)

  const [blogMessage, setBlogMessage] = useState(null)
  const [loginMessage, setLoginMessage] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  //const [createBlogVisible, setCreateBlogVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogs = await blogService.getAll()
        const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      } catch (error) {
        console.log('Error fetching blogs', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) 
    }
  }, [])


  const blogFormRef = useRef()


  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleLogin={handleLogin}
    />
  )

    /*const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }*/

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, 
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      
      blogService
        .setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')

        setLoginMessage('log in succeeded')

        setTimeout(() => {
          setLoginMessage(null)
        }, 3000)

    } catch (exception) {
      setLoginMessage('wrong username or password')

      setTimeout(() => {
        setLoginMessage(null)
      }, 3000)
    }
  }


  const createBlogForm = () => (
    <Togglable buttonLabel='Create a new blog' ref={blogFormRef}>
      <CreateBlogForm createBlog={addBlog} />
    </Togglable>
  )



  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      const blogWithUser = { ...returnedBlog, user: user } 
      setBlogs(blogs.concat(blogWithUser)) //setBlogs(blogs.concat(returnedBlog))
      setBlogMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)

      setTimeout(() => {
          setBlogMessage(null)
        }, 3000)

    } catch (error) {
        console.log(error.message)
        setBlogMessage('error creating new blog')
      }
  }

  /*const createBlogForm = () => {
    const hideWhenVisible = { display: createBlogVisible ? 'none' : '' }
    const showWhenVisible = { display : createBlogVisible ? '' : 'none' }

    return (

      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateBlogVisible(true)}>create blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateBlogForm
            createBlog={addBlog}
          />
          <button onClick={() => setCreateBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }*/

  const handleLikeUpdate = async () => {
    try {
      const updatedBlogs = await blogService.getAll()
      const sortedBlogs = updatedBlogs.sort( (a, b) => b.likes - a.likes )
      setBlogs(sortedBlogs)
    } catch (error) {
      console.log("Error fetching updated blogs")
    }
  }

  const handleBlogDeletion = async (blogToDelete) => {
    try {
      const updatedBlogs = blogs.filter( (blog) => blog.id !== blogToDelete.id)
      setBlogs(updatedBlogs)
    } catch (error) {
      console.log("Error deleting blog")
      console.log(error.message)
    }
  }


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null) 
    setUser(null)
  }


  if (user === null) {
    return (
      <div>
      <Togglable buttonLabel="Login here">
        {loginForm()}
      </Togglable>
        <Notification message={loginMessage} />   
      </div> 
    )
  }

  return (
    <div>
      <Notification message={loginMessage} />  

      <h2>Blogs</h2>
      <p>{user.username} logged in</p> 
      <button onClick={handleLogout}>logout</button>

      <div style={{ marginTop: '20px' }}>
        {createBlogForm()}
        <Notification message={blogMessage} />
      </div>

      <div style={{ marginTop: '20px' }}>
        {blogs.map(blog => (
            <Blog key={blog.id} 
              blog={blog} 
              handleLikeUpdate={handleLikeUpdate}
              handleBlogDeletion={handleBlogDeletion}
              currentUser={user}/>
        ))}
      </div>

    </div>
  )

}

export default App