import { useState } from 'react';
import AppLayout from './componenets/layout/AppLayout';
import HomePage from './features/home/HomePage';
import './App.css';

export default function App() {
  const [search, setSearch] = useState('');

  return (
    <AppLayout search={search} onSearchChange={setSearch}>
      <HomePage search={search} />
    </AppLayout>
  );
}