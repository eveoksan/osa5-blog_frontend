/* eslint-disable no-undef *//* eslint-disable linebreak-style */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect' // For extended matchers
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls the event handler with the right details when a new blog is created', () => {
    // Define mock event handler functions
    const handleNewBlogMock = jest.fn()
    const handleTitleChangeMock = jest.fn()
    const handleAuthorChangeMock = jest.fn()
    const handleUrlChangeMock = jest.fn()

    render(
      <BlogForm
        handleNewBlog={handleNewBlogMock}
        handleTitleChange={handleTitleChangeMock}
        handleAuthorChange={handleAuthorChangeMock}
        handleUrlChange={handleUrlChangeMock}
        title=""
        author=""
        url=""
      />
    )

    // Get form inputs
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const saveButton = screen.getByText('Save')

    // Simulate user input
    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(authorInput, { target: { value: 'Test Author' } })
    fireEvent.change(urlInput, { target: { value: 'http://example.com' } })

    // Trigger form submission
    fireEvent.click(saveButton)

    // Expect the event handlers to be called with the correct values
    expect(handleTitleChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: 'Test Title' }) })
    )
    expect(handleAuthorChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: 'Test Author' }) })
    )
    expect(handleUrlChangeMock).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: 'http://example.com' }) })
    )

    // Expect the handleNewBlogMock to be called with the correct object
    expect(handleNewBlogMock).toHaveBeenCalledWith(
      expect.objectContaining({
        preventDefault: expect.any(Function), // Ensure preventDefault is a function
        target: expect.any(Object), // Ensure target is an object
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://example.com',
      })
    )
  })
})