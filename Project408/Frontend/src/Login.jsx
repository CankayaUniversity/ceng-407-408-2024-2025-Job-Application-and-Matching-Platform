import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from './assets/Saly-10.png';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// const navigate = useNavigate();
// navigate('/dashboard');

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
                localStorage.setItem('userType',data.userType);
                localStorage.setItem('id',data.id);
                // Yönlendirme
                if(data.userType==='EMPLOYER'){
                    navigate('/employerDashboard');
                }
                else if(data.userType==='CANDIDATE'){
                    // navigate('/dashboard');
                    navigate('/candidate/jobs');
                }

            } else {
                const errorText = await response.text();
                console.error('Sunucu hatası:', errorText);
                setError('Invalid email or password');

                // navigate('/employerDashboard');  //şimdilik diğer sayfaya ulaşmak için eklendi, burası sonra silinecek!!!
            }
        } catch (err) {
            console.error('Bağlantı hatası:', err);
            setError('Sunucuya ulaşılamadı');

            // navigate('/dashboard');  //şimdilik diğer sayfaya ulaşmak için eklendi, burası sonra silinecek!!!
        }
    };




    return (
      <div className="flex min-h-screen">

      {/* Left: Form */}
      <div className="w-1/2 bg-white p-10 flex items-center justify-center">
          <div className="w-full max-w-[400px]">
              <h2 className="text-3xl font-bold mb-2">Login</h2>
              <p className="text-sm mb-6">
                  If you don’t have an account register <br/>
                  You can{' '}
                  <Link to="/" className="text-blue-600 font-medium hover:underline">
                      Sign Up here !
                  </Link>
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>

                  <div className="flex flex-col">
                      <label htmlFor="email" className="mb-1 font-medium text-sm">Email</label>
                      <input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white text-black border border-gray-300 pb-2 placeholder-gray-500 focus:outline-none focus:border-gray-500"
                      />
                  </div>

                  <div className="flex flex-col">
                      <label htmlFor="password" className="mb-1 font-medium text-sm">Password</label>

                      <div className="relative">
                          <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your Password"
                              className="bg-white text-black border border-gray-400 focus:border-[#0C21C1] focus:outline-none py-1 placeholder-gray-500 pr-10 w-full mb-3"
                          />

                          <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#0C21C1]"
                          >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                      </div>
                  </div>


                  {error && (
                      <p className="text-sm text-red-500 font-medium">{error}</p>
                  )}

                  <button
                      type="submit"
                      className="w-full bg-[#0C21C1] text-white py-3 rounded-full hover:bg-[#0a1ba6] transition"
                  >
                      Login
                  </button>
              </form>


              <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500 mb-4">or sign up with</p>
                  <div className="flex justify-center gap-6">
                      <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGithub size={24}
                                                                                                     className="text-black"/>
                      </button>
                      <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGoogle size={24}
                                                                                                     className="text-black"/>
                      </button>
                  </div>
              </div>
          </div>
      </div>

          {/* Right: Illustration */}
          <div className="w-1/2 bg-[#1849C6] flex items-center justify-center relative">

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
