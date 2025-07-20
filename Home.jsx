import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './FireBase';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [form, setForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Saves to Firebase; it is in firestore database in the documents tab
      await addDoc(collection(db, 'complaints'), {
        ...form,
        timestamp: new Date().toISOString(),
      });

     
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  return (
    <div>
      <h1>CivicLink — Report a Concern</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Issue Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Describe the issue"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
