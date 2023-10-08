/* eslint-disable linebreak-style */
import Togglable from './Togglable'

const Blog = ({ blog, updatedLikes, deleteBlog }) => {
  const like = () => {
    const { id, author, url, title, } = blog
    if (blog.likes === null) {
      blog.likes = 0
    }
    const updated = {
      title,
      author,
      url,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    }
    updatedLikes(id, updated)
  }

  const remove = () => {
    const { id } = blog
    deleteBlog(id)
  }

  return(
    <li className="blog">
      <b>{blog.title}</b> {blog.author}
      <Togglable buttonLabel="View">
        <small>
      Title: <i> {blog.title} </i>
          <br />
      Author: <i> {blog.author} </i>
          <br />
      Likes: <i> {blog.likes} </i>
          <button onClick={like}>like</button>
          <br />
      Url: <i> {blog.url} </i>
          <br />
      Added by: <i>{blog.user ? blog.user.name : 'Tester'}</i>
        </small>
        <button onClick={remove}>delete</button>
      </Togglable>
    </li>
  )
}

export default Blog