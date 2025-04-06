import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from './assets/illustration.png';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// const navigate = useNavigate();
// navigate('/dashboard');

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:9090/login/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Giriş başarılı!', data);

                // Token'ı localStorage’a kaydet
                localStorage.setItem('token', data.token);

                // Yönlendirme
                navigate('/dashboard');
            } else {
                const errorText = await response.text();
                console.error('Sunucu hatası:', errorText);
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error('Bağlantı hatası:', err);
            setError('Sunucuya ulaşılamadı');
        }
    };




    return (
    <div className="flex min-h-screen font-sans">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-10 md:px-20 bg-white">
        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-bold mb-2">Login</h2>
          <p className="text-sm mb-6">
            If you don’t have an account register <br />
            You can{' '}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Sign Up here !
            </Link>
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
            <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />

            {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors mt-4"
            >
                Login
            </button>
            </form>

          

          <div className="my-8 border-t pt-4 text-center">
            <p className="text-gray-500 text-sm mb-2">or sign up with</p>
            <div className="flex justify-center gap-6">
              <FaGithub size={24} className="text-gray-700 cursor-pointer hover:text-black" />
              <FaGoogle size={24} className="text-gray-700 cursor-pointer hover:text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Illustration */}
            <div className="block md:flex w-1/2 bg-[#1849C6] items-center justify-center relative">
              <div className="absolute top-8 right-8">
                <span className="text-white font-semibold">Logo</span>
              </div>
              <img
                src={illustration}
                alt="Illustration"
                className="w-3/4 max-w-[400px]"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  console.log('Image src:', e.target.src);
                }}
              />
            </div>
    </div>
  );
}
