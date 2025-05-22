import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightIllustration from "./components/RightIllustration";
import illustration from './assets/Saly-10.png';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// const navigate = useNavigate();
// navigate('/dashboard');

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

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
                localStorage.setItem('userType', data.userType);
                localStorage.setItem('id', data.id);

                // ✅ Token'dan email’i çöz
                const payload = parseJwt(data.token);
                if (payload && payload.sub) {
                    localStorage.setItem('userEmail', payload.sub);
                }

                // Yönlendirme
                if (payload.sub === "jobapp408@gmail.com") {
                    navigate('/admin/reported-blogs');
                    return;
                }
                else if (data.userType === 'EMPLOYER') {
                    navigate('/employerDashboard');
                }
                else if (data.userType === 'CANDIDATE') {
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

            // navigate('candidate/jobs');  //şimdilik diğer sayfaya ulaşmak için eklendi, burası sonra silinecek!!!
        }
    };




    return (
        <div className="flex min-h-screen">

            {/* Left: Form */}
            <div className="w-1/2 bg-white p-10 flex items-center justify-center">
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

                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                            <label htmlFor="email" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    borderBottom: '2px solid #ccc',
                                    padding: '8px 0',
                                    outline: 'none',
                                    fontSize: '16px',
                                    backgroundColor: 'transparent',
                                    color: '#000'
                                }}
                                onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                                onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                            <label htmlFor="password" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your Password"
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        borderBottom: '2px solid #ccc',
                                        padding: '8px 36px 8px 0',
                                        outline: 'none',
                                        fontSize: '16px',
                                        backgroundColor: 'transparent',
                                        color: '#000'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                                    onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        color: '#666'
                                    }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>


                        {/* Remember me & Forgot password */}
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                            {/*<label className="flex items-center gap-2">*/}
                            {/*    <input type="checkbox" />*/}
                            {/*    Remember me*/}
                            {/*</label>*/}
                            <a href="/forgot-password" className="hover:underline">Forgot Password?</a>
                        </div>


                        {error && (
                            <p className="text-sm text-red-500 font-medium">{error}</p>
                        )}

                        <button
                            style={{ marginTop: '30px', marginBottom: '20px' }}
                            type="submit"
                            className="w-full bg-[#0C21C1] text-white py-3 rounded-full hover:bg-[#0a1ba6] transition"
                        >
                            Login
                        </button>
                    </form>


                    <div className="mt-8 text-center">
                        {/* or sign up with */}
                        <div className="flex items-center mb-6">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-sm text-gray-500">or sign up with</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>
                        <div className="flex justify-center gap-6">
                            <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGithub size={24}
                                className="text-black" />
                            </button>
                            <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGoogle size={24}
                                className="text-black" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Illustration */}
            <RightIllustration illustration={illustration} />


        </div>
    );
}
