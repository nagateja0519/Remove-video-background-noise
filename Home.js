import React, { useState } from 'react';

import './Home.css';
function Home(){
    const [link,setlink] = useState(' ');
    const handleInput=(e)=>{
        setlink(e.target.value)
    }
    const handleSubmit = (event) => {
        alert('A form was submitted: ' + link);
        fetch('http://localhost:8000/', {
            method: 'POST',
            body: link
          }).then(function(response) {
            console.log(response)
            return response.json();
          });
        event.preventDefault();
    }
    return (
        <body>
            <div className='main'>
                <h1>Remove Background Noise of a video</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="link" id="link" placeholder='Paste your google drive link or dropbox link' onChange={handleInput}/><br/><br/>
                    <input type="submit" value="submit" id="submit" />
                </form>
                <h3>{link}</h3>
            </div>
        </body>
    )
}

export default Home;