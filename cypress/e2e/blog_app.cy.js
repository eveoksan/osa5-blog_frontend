/* eslint-disable linebreak-style */

describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Tepponen',
      username: 'meikalainen',
      password: 'salainen123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('login form can be opened', function() {
    cy.contains('Login').click()
    cy.get('#username').type('meikalainen')
    cy.get('#password').type('salainen123')
    cy.get('#login-button').click()
    cy.contains('Success: Matti Tepponen logged in')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('meikalainen')
      cy.get('#password').type('salainen123')
      cy.get('#login-button').click()

      cy.contains('Success: Matti Tepponen logged in')
    })

    it('login fails with wrong password', function() {
      cy.get('#username').type('meikalainen')
      cy.get('#password').type('hakkeri2000')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'Error: Invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Success: Matti Tepponen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'meikalainen', password: 'salainen123' })
    })

    it('a new blog can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('#blogtitle').type('Blogipostaus luotu Cypressilla')
      cy.get('#blogauthor').type('Tepponen Matti')
      cy.get('#blogurl').type('http://localhost:3000')
      cy.contains('Save').click()

      cy.contains('Blogipostaus luotu Cypressilla')
    })
  })

  describe('After creating a new blog', function() {
    beforeEach(function() {
      cy.login({ username: 'meikalainen', password: 'salainen123' })
      cy.contains('Add new blog').click()
      cy.get('#blogtitle').type('Blogipostaus luotu Cypressilla')
      cy.get('#blogauthor').type('Tepponen Matti')
      cy.get('#blogurl').type('http://localhost:3000')
      cy.contains('Save').click()
    })

    it('liking a blog', function() {
      cy.contains('View').click()
      cy.contains('like').click()
      cy.contains('like').click()
      cy.contains('like').click()
      cy.contains('Likes: 1')
    })

    it('deleting a blog', function() {
      cy.contains('View').click()
      cy.contains('delete').click()
      cy.get('.success')
        .should('contain', 'Success: Blog has been deleted!')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Blogipostaus luotu Cypressilla')
    })
  })


  describe('Blog list order',function() {
    beforeEach(function() {
      cy.login({ username: 'meikalainen', password: 'salainen123' })
      cy.createBlog({
        title: 'First blogipostaus luotu Cypressilla & least likes',
        author: 'Tepponen Matti',
        url: 'http://localhost:3000',
        likes: 10
      })
      cy.createBlog({
        title: 'Second blogipostaus luotu Cypressilla & most likes',
        author: 'Tepponen Matti',
        url: 'http://localhost:3000',
        likes: 20
      })
      cy.createBlog({
        title: 'Third blogipostaus luotu Cypressilla & average amount likes',
        author: 'Tepponen Matti',
        url: 'http://localhost:3000',
        likes: 15
      })
    })

    it('most liked to least liked order', function() {
      cy.get('.blog').eq(0).should('contain', 'Second blogipostaus luotu Cypressilla & most likes')
      cy.get('.blog').eq(1).should('contain', 'Third blogipostaus luotu Cypressilla & average amount likes')
      cy.get('.blog').eq(2).should('contain', 'First blogipostaus luotu Cypressilla & least likes')
    })
  })

})
