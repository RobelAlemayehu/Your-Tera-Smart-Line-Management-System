import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Verify = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.verifyResetCode(formData);
      navigate('/reset-password', { state: { email: formData.email, code: formData.code } });
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(62, 129, 139, 1), rgba(5, 63, 71, 1))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            color: '#4A868C', 
            fontSize: '28px', 
            fontWeight: 'bold',
            marginBottom: '8px'
          }}>
            Verify Code
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Enter the verification code sent to your email
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#4A868C',
              fontWeight: '500'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4A868C'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#4A868C',
              fontWeight: '500'
            }}>
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4A868C'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#ccc' : '#4A868C',
              color: 'white',
              padding: '14px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e5e9'
        }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            <Link 
              to="/forgotpassword" 
              style={{ 
                color: '#4A868C', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Resend Code
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;