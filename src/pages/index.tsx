import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

const Homepage = () => {
  const [categories, setCategories] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const updateInterestMutation = api.home.updateInterests.useMutation();

  const { data, error, refetch } = api.home.getCategories.useQuery({ page: currentPage });

  useEffect(() => {

    if (data) {
      setCategories(data);
    }

    if (error) {
      const isUnauthorized = error.data?.code === 'UNAUTHORIZED';
      if (isUnauthorized) {
        alert('Login required');
        router.push('/login');
      }
    }
  }, [data, error, currentPage, router]);

  const handleInterestToggle = async (categoryId: any, isInterested: any) => {
    const action = isInterested ? 'remove' : 'add';
    try {
      await updateInterestMutation.mutateAsync({
        categories: [categoryId],
        action,
      });
      refetch();
    } catch (error) {
      console.error("Failed to update interest:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    alert('You Logged Out');
    router.push('/login');
  };

  const nextPage = () => {
    if (categories.length === 6) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  if (!categories) return <div className='altButton'>Loading...</div>;

  return (
    <div className='testBox'>
      <button className='logoutButton altButton' onClick={logout}>Logout</button>
      <h1 className='pageTitle'>Homepage</h1>
      <ul>
        {categories.map((category: any) => (
      <li key={category.id} className="category-item">
        <button 
          className={`toggleButton ${category.interested ? 'interested' : ''}`} 
          onClick={() => handleInterestToggle(category.id, category.interested)}
        >
          {category.interested ? 'Interested' : 'Not Interested'}
        </button>
        <div className="category-name">{category.name}</div>
      </li>
        ))}
      </ul>
      <div className="page-changer">
        <button className='testButton' onClick={prevPage}>Previous</button>
        <span>Page {currentPage}</span>
        <button className='testButton' onClick={nextPage}>Next</button>
      </div>
    </div>
  );
};

export default Homepage;
