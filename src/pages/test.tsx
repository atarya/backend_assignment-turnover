import React, { useState } from 'react';
import { api } from '../utils/api';

const TestPage = () => {

  const [input, setInput] = useState('');
  const [id, setId] = useState(1);
  
  const { data } = api.tester.test.useQuery({ id });

  const handleInputChange = (e: any) => {
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    const newId = parseInt(input);
    if (!isNaN(newId)) {
        setId(newId);
    }
  };

  if (!data) return <div>NO DATA</div>;

  return (
    <div className='testBox'>
      <input onChange={ handleInputChange }value={ input }/>
      <button className='testButton' onClick={ handleSubmit }>SearchById</button>
      <h1 className='testResult'>{ data.name }</h1>
    </div>
  );
};

export default TestPage;
