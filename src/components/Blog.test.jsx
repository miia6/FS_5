import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Renders the title and author, but not URL and number of likes', () => {
  const blog = {
    title: 'testing blog view',
    author: 'teekkari',
    url: '/testUrl',
  }

  const { container } = render(<Blog blog={blog}/>)
                          
  //screen.debug()

  const div = container.querySelector('p')
  expect(div).toHaveTextContent('testing blog view')
  expect(div).toHaveTextContent('teekkari')
  expect(div).not.toHaveTextContent('/testUrl')
  expect(div).not.toHaveTextContent('likes:')

})


test('clicking the "view" button shows URL and number of likes', async () => {
    const blog = {
        title: 'testing view button',
        author: 'teekkari',
        url: '/testUrl2',
        likes: 6,
        user: { username: 'testuser' }
    }

    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} 
            handleLikeUpdate={mockHandler}
            currentUser={{ username: 'testuser' }} 
            />
    )
    
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    //screen.debug()

    const url = screen.getByText('/testUrl2')
    expect(url).toBeDefined()

    const likes = screen.getByText('likes: 6')
    expect(likes).toBeDefined()

    const likeButton = screen.getByText('like')
    await user.click(likeButton)

    //screen.debug()

})

test('clicking the "like" button twice, the event handler is called twice', async () => {
  const blog = {
    title: 'testing like button',
    author: 'teekkari',
    url: '/testUrl3',
    likes: 6,
    user: { username: 'testuser' }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} 
          handleLikeUpdate={mockHandler}
          currentUser={{ username: 'testuser' }} />
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)

  //screen.debug()

})

