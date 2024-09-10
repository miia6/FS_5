import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('when creating a new blog, the event handler is called', async () => {

    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<CreateBlogForm createBlog={createBlog} />)

    const sendButton = screen.getByText('create')

    const titleInput = screen.getByLabelText('Title')
    const authorInput = screen.getByLabelText('Author')
    const urlInput = screen.getByLabelText('url')

    await user.type(titleInput, 'testing new blog creating')
    await user.type(authorInput, 'teekkari')
    await user.type(urlInput, '/testUrl4')

    await user.click(sendButton)

    //console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'testing new blog creating',
        author: 'teekkari',
        url: '/testUrl4',
    })

    //screen.debug()
  
  })
  