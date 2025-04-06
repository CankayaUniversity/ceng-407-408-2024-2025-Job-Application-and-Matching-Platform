import { Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import JobSeekerDashboard from './JobSeekerDashboard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<JobSeekerDashboard />} />
      {/* <div className="bg-red-500 text-white p-4">
        Eğer bu kırmızı kutu görünüyorsa Tailwind çalışıyor 🎉
      </div> */}

    </Routes>
  );
}

export default App;