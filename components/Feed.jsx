'use client';

import React from 'react';

import PromptCard from './PromptCard';

const PropmtCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-2 prompt_layout'>
      {data.map((post) => (
        <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
      ))}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = React.useState([]);

  const [searchText, setSearchText] = React.useState('');
  const [searchedResults, setSearchedResults] = React.useState([]);
  const [searchTimeout, setSearchTimeout] = React.useState(null);

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setAllPosts(data);
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, 'i'); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.creator.email) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(searchText);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };
  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          value={searchText}
          onChange={handleSearchChange}
          placeholder='Search for a tag or a username'
          required
          className='search_input peer'
        />
      </form>

      {searchText ? (
        <PropmtCardList data={searchedResults} handleTagClick={handleTagClick} />
      ) : (
        <PropmtCardList data={allPosts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
