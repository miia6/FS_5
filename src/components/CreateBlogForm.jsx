import { useState } from 'react'
import PropTypes from 'prop-types'


const CreateBlogForm = ({ createBlog }) => {

    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: '',
    })

    const addBlog = (event) => {
        event.preventDefault()
        createBlog(newBlog)
        setNewBlog({ title: '', author: '', url: '' }) //setNewBlog('')
    }

    return (

        <div>
            <h2>Create a new blog</h2>
            <form onSubmit={addBlog}>
                <div>
                    title: 
                    <input
                    type="text"
                    valueTitle={newBlog.title}
                    name="title"
                    aria-label="Title"
                    data-testid='title'
                    onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
                    />
                </div>
                <div>
                    author: 
                    <input
                    type="text"
                    valueAuthor={newBlog.author}
                    name="author"
                    aria-label="Author"
                    data-testid='author'
                    onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
                    />
                </div>
                <div>
                    url:
                    <input
                    type="text"
                    valueUrl={newBlog.url}
                    name="url"
                    aria-label="url"
                    data-testid='url'
                    onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

CreateBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
}

export default CreateBlogForm