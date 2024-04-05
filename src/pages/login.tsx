import { useState } from 'react';
import { api } from '../utils/api';
import { useRouter } from 'next/router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = api.user.login.useMutation();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
        
        const result = await login.mutateAsync({ email, password });

        localStorage.setItem('token', result.token);

        router.push('/');

    } catch (error: any) {

      if (error.message === 'Verify Email') {

        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else if (error.message === 'Incorrect Credentials') {

        setErrorMessage('Incorrect Credentials. Please try again.');
      } else {

        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };
  

  return (
    <form className="testBox" onSubmit={handleSubmit}>
      <h1 className='pageTitle'>Login</h1><br />
      <input className='input'
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input className='input'
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button className="testButton" type="submit">LOGIN</button>
      <p>Don't have an Account? <a className="altButton" href="/register">SIGN UP</a></p>
    </form>
  );
};

export default Login;
