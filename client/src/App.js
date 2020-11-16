import React, { useEffect, useState } from 'react'
import './App.css';
import { baseUrl } from './constants/baseUrl'

import axios from 'axios'
import { FaSearch } from 'react-icons/fa';
import { Input } from '@material-ui/core';


function App() {

  const [tweets, setTweets] = useState([])
  const [filteredTweets, setFilteredTweets] = useState([])
  const [hashtags, setHashtags] = useState([])
  const [pagination, setPagination] = useState(5)

  // Updates hashtags for visible tweets
  useEffect(() => {

    let hashtags = [];
    let visibleTweets = filteredTweets.slice(0, pagination)

    // Constructs array of all hashtags associated with currently filtered tweets
    for (let i = 0; i < visibleTweets.length; i++) {
      for (let j = 0; j < visibleTweets[i].entities.hashtags.length; j++) {
        let hashtag = visibleTweets[i].entities.hashtags[j]
        if (!hashtags.includes(hashtag)) hashtags.push(hashtag)
      }
    }

    setHashtags(hashtags)

  }, [tweets, pagination])

  function fetchTweets(e) {
    // Resets to default number of tweets displayed
    setPagination(5);

    axios.get(`${baseUrl}/feed?search=${e.target.value}`)
      .then(resp => {
        console.log('Tweets found!', resp)
        let tweets = resp.data.statuses

        setFilteredTweets(tweets)
        setTweets(tweets)
      })
      .catch(err => console.log('Error fetching tweets', err.message))
  }

  function renderSearch() {
    return (
      <div className='input-group'>
        <Input
          onKeyUp={fetchTweets}
          style={{ width: '100%', background: '#fff', padding: 15, borderRadius: 4, border: '1px solid #aaa', marginBottom: 25, boxSizing: 'border-box' }}
          placeholder='Search by keyword'
          inputProps={{ 'aria-label': 'search' }}
          startAdornment={<FaSearch style={{ color: '#b3babd', marginRight: '1%' }} />}
        />
      </div>
    )
  }

  function filterByHashtag(hashtag) {
    let arr = tweets

    arr = arr.filter(el => el.entities.hashtags.some(item => item.text === hashtag))
    setFilteredTweets(arr)
  }

  // Formats tweet text
  function parseTweetText(tweet) {
    let text = tweet.full_text

    const { urls } = tweet.entities

    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        text.replace(urls[i].url, '')
      }
    }

    return text
  }

  // Formats tweet links
  function parseTweetLinks(tweet) {
    let links = ''

    const { urls } = tweet.entities

    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        links += urls[i].url + ' '
      }
    }

    return links;
  }

  return (
    <div className="App">

      <div style={{ width: '80%', margin: '0 auto' }}>
        <h3 style={{ textAlign: 'left', color: '#52636a' }}>Tweet Feed</h3>

        {/* Mobile search input positioning */}
        <div className='mobile-visible'>
          {renderSearch()}
        </div>

        <div className='main'>
          <div style={{ flex: .75, display: 'flex', flexDirection: 'column', marginBottom: 25 }}>

            {/* Desktop search input positioning */}
            <div className='mobile-hidden'>
              {renderSearch()}
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'scroll', boxShadow: '0px 2px 4px #999' }}>

              <div className='container' style={{ flex: 1, padding: 0, boxShadow: 'none' }}>
                {filteredTweets.length > 0
                  ?
                  <div>
                    {/* Displays number of tweets based on pagination count */}
                    {filteredTweets.slice(0, pagination)
                      .map((tweet, index) =>
                        <div style={{ display: 'flex', background: index % 2 ? '#f8f9f9' : '#fff', padding: 15 }} key={index}>
                          <img src={tweet.user.profile_image_url} alt='profile' style={{ alignSelf: 'center', width: 50, marginRight: 20, borderRadius: '50%' }} />
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontWeight: 'bold' }}>@{tweet.user.screen_name}</p>
                            <p style={{fontSize: 15, lineHeight: '1.4em'}}>
                              {parseTweetText(tweet)}
                              <span style={{ color: '#3c7cb3' }}> {parseTweetLinks(tweet)}</span>
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                              {tweet.entities.hashtags.map((hashtag, i) =>
                                <div className='hashtag' key={i} >
                                  #{hashtag.text}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {filteredTweets.length > pagination &&
                      <div style={{ cursor: 'pointer', paddingBottom: 30 }} onClick={() => setPagination(pagination + 5)}>
                        <p style={{ color: '#3c7cb3' }}>Load More</p>
                      </div>
                    }
                  </div>
                  :
                  <div style={{ padding: '5%' }}>No tweets found! Please enter text in the search box or refine your query.</div>
                }

              </div>
            </div>
          </div>
          <div className='container' style={{ flex: .25, maxHeight: '50%', margin: 25, overflow: 'scroll', marginTop: 0 }}>
            <p style={{ fontWeight: 500, textAlign: 'left' }}>Filter by hashtag</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {hashtags.length > 0
                ? hashtags.map((hashtag, index) =>
                  <div onClick={() => filterByHashtag(hashtag.text)} style={{ cursor: 'pointer' }} className='hashtag' key={index}>
                    #{hashtag.text}
                  </div>
                )
                : <p style={{ width: '100%', textAlign: 'center' }}>No hashtags yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
