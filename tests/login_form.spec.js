const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {    
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users/', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'secret'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('secret')
    await page.getByRole('button', { name: 'login' }).click()  
    
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('secret')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new' }).click()
      await page.getByRole('textbox').first().fill('testiblogi')
      await page.getByRole('textbox').nth(1).fill('testijoukko')
      await page.getByRole('textbox').nth(2).fill('www.testi.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('testiblogi').first()).toBeVisible()
    })
  
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new' }).click()
      await page.getByRole('textbox').first().fill('like test blog')
      await page.getByRole('textbox').nth(1).fill('like author')
      await page.getByRole('textbox').nth(2).fill('www.like.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.locator('.blog-title').first()).toBeVisible()
      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'like' }).first().click()

      await expect(page.locator('.blog-likes').first()).toContainText('1')
    })
    
  test('a blog can be deleted', async ({ page }) => {
    await page.getByRole('button', { name: 'create new' }).click()
    await page.getByRole('textbox').first().fill('delete test blog')
    await page.getByRole('textbox').nth(1).fill('delete author')
    await page.getByRole('textbox').nth(2).fill('www.delete.com')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.locator('.blog-title').first()).toBeVisible()
    await page.getByRole('button', { name: 'view' }).first().click()

    page.on('dialog', dialog => dialog.accept())
    await page.getByRole('button', { name: 'remove' }).first().click()

    await expect(page.locator('.blog-title')).toHaveCount(0)
  })
  
  test('blogs are ordered according to likes', async ({ page }) => {
    await page.getByRole('button', { name: 'create new' }).click()
    await page.getByRole('textbox').first().fill('like test blog')
    await page.getByRole('textbox').nth(1).fill('like author')
    await page.getByRole('textbox').nth(2).fill('www.like.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('button', { name: 'create new' }).click()
    await page.getByRole('textbox').first().fill('like test blog 2')
    await page.getByRole('textbox').nth(1).fill('like author 2')
    await page.getByRole('textbox').nth(2).fill('www.like2.com')
    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('button', { name: 'view' }).first().click()
    await page.getByRole('button', { name: 'like' }).first().click()
    await expect(page.locator('.blog-likes').first()).toContainText('1')
    await page.getByRole('button', { name: 'like' }).first().click()
    await expect(page.locator('.blog-likes').first()).toContainText('2')

    await expect(page.locator('.blog-title').first()).toContainText('like test blog')
  })
  
})
})