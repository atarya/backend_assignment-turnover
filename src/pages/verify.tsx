import { useRouter } from 'next/router';
import { useState } from 'react';
import { api } from '../utils/api';

const VerifyEmail = () => {
  const router = useRouter();
  const { email } = router.query;
  const [code, setCode] = useState('');
  const verifyEmail = api.user.verify.useMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Email is required.');
      return;
    }

    try {
      await verifyEmail.mutateAsync({ email: email.toString(), code });
      alert('Email verified successfully!');
      router.push('/login');
    } catch (error) {
      console.error('Failed to verify email:', error);
      setErrorMessage('Incorrect Code. Please try again.');
    }
  };

  return (
    <form className="testBox" onSubmit={handleSubmit}>
      <h1 className='pageTitle' >Verify your email</h1><br />
      <div>Email: {email}</div>
      <input className='input'
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Verification Code"
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button className="testButton" type="submit">VERIFY</button>
    </form>
  );
};

export default VerifyEmail;
