/* eslint-disable linebreak-style */
import PropTypes from 'prop-types'

const BlogForm = ({
  handleNewBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  title,
  author,
  url
}) => {
  return (
    <div>
      <h3>Add new blog</h3>
      <form onSubmit={handleNewBlog}>
        <div>
        title:
          <input
            id="blogtitle"
            type="text"
            value={title}
            name="Title"
            onChange={handleTitleChange}
            placeholder="title"
          />
        </div>
        <div>
        author:
          <input
            id="blogauthor"
            type="text"
            value={author}
            name="Author"
            onChange={handleAuthorChange}
            placeholder="author"
          />
        </div>
        <div>
        url:
          <input
            id="blogurl"
            type="text"
            value={url}
            name="Url"
            onChange={handleUrlChange}
            placeholder="url"
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}


BlogForm.propTypes = {
  handleNewBlog: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  testing: PropTypes.bool
}


export default BlogForm