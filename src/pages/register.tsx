import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

const CreateAccount = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const createUser = api.user.register.useMutation();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync({ name, email, password })
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  return (
    <form className='testBox' onSubmit={handleSubmit}>
      <h1 className='pageTitle'>Create your account</h1><br />

      <input className='input'
        type="text"
        name="name"
        value={name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <input className='input'
        type="email"
        name="email"
        value={email}
        onChange={handleInputChange}
        placeholder="Email"
      />
      <input className='input'
        type="password"
        name="password"
        value={password}
        onChange={handleInputChange}
        placeholder="Password"
      />
      <button className="testButton"type="submit">CREATE ACCOUNT</button>
      <p>Have an Account? <a className="altButton" href="/login">LOGIN</a></p>
    </form>
  );
};

export default CreateAccount;
