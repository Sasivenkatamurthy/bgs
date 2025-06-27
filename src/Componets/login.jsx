import React, { useState, useEffect, } from 'react';
import { DownloadSimple } from "@phosphor-icons/react";

function Login() {
    const [step, setStep] = useState(() => {
        const savedStep = sessionStorage.getItem('step');
        return savedStep ? parseInt(savedStep, 10) : 1;
    });
    const [form, setForm] = useState(() => {
        const savedForm = sessionStorage.getItem('form');
        return savedForm ? JSON.parse(savedForm) : { name: '', email: '', otp: '' };
    });
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [images, setImages] = useState([]);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setMessage('');
    };
    const [otpTimer, setOtpTimer] = useState(60);
    const [resendAvailable, setResendAvailable] = useState(false);
    const handleResendOtp = async () => {
        await handleSendOtp();
    };
    // Start/restart OTP timer when step 3 is entered
useEffect(() => {
    let timer;
    if (step === 3 && !resendAvailable) {
        timer = setInterval(() => {
            setOtpTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setResendAvailable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(timer);
}, [step, resendAvailable]);

    // Synchronize step with browser history
    useEffect(() => {
        // On initial mount, replace state
        if (!window.history.state || typeof window.history.state.step !== 'number') {
            window.history.replaceState({ step }, '', '');
        } else if (window.history.state.step !== step) {
            // On step change, push new state
            window.history.pushState({ step }, '', '');
        }
        // Listen for back/forward navigation
        const onPopState = (event) => {
            if (event.state && typeof event.state.step === 'number') {
                setStep(event.state.step);
            } else {
                setStep(1);
            }
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [step]);
    // Register user
    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/save-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStep(2);
                setMessage('Registered! Now send OTP to your email.');
            } else {
                setMessage(data.message || 'Registration failed');
            }
        } catch {
            setMessage('Could not connect to backend');
        }
    };

    // Send OTP
    const handleSendOtp = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUserId(data.userId);
                setStep(3);
                setMessage('OTP sent to your email.');
                setOtpTimer(60);
                setResendAvailable(false);
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch {
            setMessage('Could not connect to backend');
        }
    };

    // Verify OTP
    const handleVerifyOtp = async e => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    otp: form.otp,
                    userId
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStep(4);
                setMessage('Welcome to BGS');
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                    setMessage('');
                }, 5000);
            }
        } catch {
            setMessage('Could not connect to backend');
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        }
    };
    useEffect(() => {
        sessionStorage.setItem('step', step);
        sessionStorage.setItem('form', JSON.stringify(form));
    }, [step, form]);
    // Fetch images after successful login
    useEffect(() => {
        if (step === 4) {
            fetch('http://localhost:4000/api/user-images')
                .then(res => res.json())
                .then(data => setImages(data.images || []));
        }
    }, [step]);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100vw',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e3ecf7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: 50,
                    height: 30,
                    background: '#2e7d32',
                    color: '#fff',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px',
                    fontSize: 14,
                    zIndex: 9999,
                    boxShadow: '0 2px 8px #0002'
                }}>
                    {message}
                </div>
            )}
            <div style={{
                maxWidth: 370,
                width: '100%',
                padding: 32,
                borderRadius: 16,
                // background: '#f8fafc',
                // boxShadow: '0 8px 32px #0002',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <form onSubmit={handleVerifyOtp} style={{ width: '100%' }}>
                    {step === 1 && (
                        <>
                            <div style={{
                                borderRadius: 12,
                                padding: 0,
                                background: 'transparent',
                                boxShadow: 'none',
                                marginLeft: 0,
                                marginRight: 15,
                            }}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 500, fontSize: 18 }}>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            borderRadius: 8,
                                            border: '1px solid #bdbdbd',
                                            marginTop: 6,
                                            fontSize: 16,
                                            background: '#fff'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 500, fontSize: 18 }}>Email:</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            borderRadius: 8,
                                            border: '1px solid #bdbdbd',
                                            marginTop: 6,
                                            fontSize: 16,
                                            background: '#fff'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: 16, marginLeft: 20 }}>
                                    <button
                                        type="button"
                                        style={{
                                            width: '100%',
                                            padding: 12,
                                            background: '#457b9d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 8,
                                            fontWeight: 'bold',
                                            fontSize: 18,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px #457b9d22'
                                        }}
                                        onClick={handleRegister}
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #bdbdbd' }}
                                    disabled
                                />
                            </div>
                            <div style={{ marginBottom: 16, marginLeft: 20 }}>
                                <button
                                    type="button"
                                    style={{
                                        width: '100%',
                                        padding: 10,
                                        background: '#457b9d',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 6,
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={handleSendOtp}
                                >
                                    Send OTP
                                </button>
                            </div>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <div style={{ margin: '18px 0 10px 0' }}>
                                <label>Enter OTP:</label>
                                <input
                                    type="text"
                                    name="otp"
                                    value={form.otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: 8,
                                        borderRadius: 6,
                                        border: '1px solid #bdbdbd',
                                        letterSpacing: 4,
                                        fontSize: 18,
                                        textAlign: 'center'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: 16, marginLeft: 20 }}>
                                {resendAvailable ? (
                                    <button
                                        type="button"
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            background: '#457b9d',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleResendOtp}
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <span style={{ color: '#999' }}>Resend OTP in {otpTimer} seconds</span>
                                )}
                            </div>
                            {!resendAvailable && (
                                <div style={{ marginBottom: 16, marginLeft: 20 }}>
                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            padding: 10,
                                            background: '#1d3557',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 6,
                                            fontWeight: 'bold',
                                            cursor: form.otp.length === 6 ? 'pointer' : 'not-allowed',
                                            opacity: form.otp.length === 6 ? 1 : 0.6
                                        }}
                                        disabled={form.otp.length !== 6}
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {step === 4 && (
                        <div style={{ marginTop: 0, color: '#2e7d32', fontWeight: 700, width: '100vw', maxWidth: '100vw', padding: 0, marginLeft: '-210%', marginRight: 0, marginBottom: 0, height: '100vh' }}>
                            {/* Display images in a grid */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 16,
                                    justifyContent: 'center',
                                    width: '100vw',
                                    maxHeight: '100vh', // enables vertical scroll if many rows
                                    // overflowY: 'auto',
                                    boxSizing: 'border-box',
                                    // padding: '0 2vw'
                                }}
                            >
                                {images.length > 0 ? (
                                    images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                position: 'relative',
                                                width: '200px',
                                                height: '600px',
                                                flex: '0 0 calc(25% - 16px)', // 4 per row, minus gap
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            onMouseEnter={() => setHoveredIdx(idx)}
                                            onMouseLeave={() => setHoveredIdx(null)}
                                        >
                                            <img
                                                src={img}
                                                alt="User upload"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    borderRadius: 8,
                                                    marginBottom: 10,
                                                    maxWidth: '100%',
                                                    minWidth: 0
                                                }}
                                            />
                                            {hoveredIdx === idx && (
                                                <a
                                                    href={img}
                                                    download
                                                    style={{
                                                        position: 'absolute',
                                                        top: 10,
                                                        right: 10,
                                                        background: 'rgba(0,0,0,0.6)',
                                                        borderRadius: '50%',
                                                        padding: 6,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        zIndex: 2,
                                                        textDecoration: 'none'
                                                    }}
                                                    title="Download"
                                                >
                                                    <DownloadSimple size={24} weight="bold" />
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div>No images uploaded yet.</div>
                                )}
                            </div>
                        </div>
                    )}
                </form>
                {message && <p style={{ marginTop: 16, color: message.includes('success') ? '#2e7d32' : '#d32f2f' }}>{message}</p>}
            </div>
        </div>
    );
}
export default Login;