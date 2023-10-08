import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Footer from './components/Footer'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(`Success: ${user.name} logged in`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error: Invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }


  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }


  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.create({
        title, author, url
      })

      setTitle('')
      setAuthor('')
      setUrl('')
      blogFormRef.current.toggleVisibility()
      setErrorMessage(`Success: A new blog titled ${title} by ${author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 10000)

      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    } catch (exception) {
      setErrorMessage('Error: Could not add the new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLikes = async (id, blogObject) => {
    try {
      await blogService.update({ id, blogObject })
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    } catch (exception) {
      setErrorMessage('Error: Liking unsuccessful')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (id) => {
    console.log('Trying to delete:', id)
    const question = window.confirm('Are you sure you want to delete the blog?')
    if (question) {
      try {
        await blogService.deleteBlog(id)
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        )
        setErrorMessage('Success: Blog has been deleted!')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      } catch (exception) {
        setErrorMessage('Error: Could not delete')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }


  blogs.sort(function (a,b) {
    return b.likes - a.likes
  })


  if (user === null) {
    return (
      <div>
        <h1>Blogs</h1>
        <Notification message={errorMessage} />

        {!user && loginForm()}
        {user && <div>
          <p>{user.name} logged in
            <button onClick={handleLogout} type="button">Logout</button>
          </p>
        </div>
        }
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />
      <p>{user.name} is logged in
        <button onClick={handleLogout} type="button">Logout</button>
      </p>

      <Togglable buttonLabel='Add new blog' ref={blogFormRef}>
        <BlogForm
          handleNewBlog={handleNewBlog}
          handleAuthorChange={({ target }) => setAuthor(target.value)}
          handleTitleChange={({ target }) => setTitle(target.value)}
          handleUrlChange={({ target }) => setUrl(target.value)}
          title={title}
          author={author}
          url={url}
        />
      </Togglable>

      <h3>Bloglist</h3>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} updatedLikes={handleLikes} deleteBlog={handleDelete}/>
      )}
      <Footer />
    </div>
  )
}

export default App