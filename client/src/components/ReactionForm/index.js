import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';
import { QUERY_ME, QUERY_THOUGHT, QUERY_THOUGHTS } from '../../utils/queries';

const ReactionForm = ({ thoughtId }) => {

  const [reactionBody, setBody] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  const [addReaction, {error}] = useMutation(ADD_REACTION, {
    update(cache, { data: { addReaction } }) {

      try {
        const { thought } = cache.readQuery({ query: QUERY_THOUGHT });
        cache.writeQuery({
          query: QUERY_THOUGHT,
          data: { thought: { ...thought, reactions: [ ...thought.reactions, addReaction]}},
        });
      } catch (e) {
        console.warn('First thougt insertion by user!')
      }

      const { reactions } = cache.readQuery({ query: QUERY_THOUGHT });
      cache.writeQuery({
        query: QUERY_THOUGHT,
        data: { thought: [addReaction, ...reactions]},
      });
    }
  });

  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setBody(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    setBody('');
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form 
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
        >
        <textarea
          placeholder="Leave a reaction to this thought..."
          value={reactionBody}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>

        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>

      </form>
      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
  );
};

export default ReactionForm;