const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('http://localhost:5173')
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users/', {
      data: {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'secret'
      }
    })
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
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'create new' }).click()
    await page.getByRole('textbox').first().fill('testiblogi')
    await page.getByRole('textbox').nth(1).fill('testijoukko')
    await page.getByRole('textbox').nth(2).fill('www.testi.com')
    await page.getByRole('button', { name: 'create' }).click()

    await expect(page.getByText('testiblogi testijoukko').first()).toBeVisible()
  })
})
})