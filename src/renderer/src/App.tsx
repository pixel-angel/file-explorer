import { useState } from 'react';
import AppLayout from './componenets/layout/AppLayout';
import HomePage from './features/home/HomePage';
import './App.css';

export default function App() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('Home');

  return (
    <AppLayout
      search={search}
      onSearchChange={setSearch}
      page={page}
      onNavigate={setPage}
    >
      <HomePage
        search={search}
        page={page}
        onNavigate={setPage}
      />
    </AppLayout>
  );
}