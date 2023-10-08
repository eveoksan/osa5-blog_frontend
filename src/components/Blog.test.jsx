import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders blog title', () => {
  const blog = {
    title: 'Test blog',
    author: 'Random Writer',
    likes: 4,
    url: 'http://localhost:3003'
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.getByText(blog.title, { selector: 'b' })

  expect(titleElement).toBeInTheDocument()
})


test('clicking the view button shows details', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Random Writer',
    likes: 4,
    url: 'http://localhost:3003'
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)

  const view = screen.getByText('View')
  await user.click(view)

  const likes = container.querySelector('.likes')
  const url = container.querySelector('.url')
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test blog',
    author: 'Random Tester',
    likes: 4,
    url: 'http://localhost:3003',
    user: 'Tester'
  }

  const user = userEvent.setup()
  const updateBlog = jest.fn()

  render(<Blog blog={blog} updatedLikes={updateBlog} />)
  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateBlog).toHaveBeenCalledTimes(2)
})