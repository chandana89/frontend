import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { AccountStatus, Status } from '../../hooks/auth';
import { useStore } from '../../store';

const MIN_PASSWORD_LENGTH = 8;

const RegisterPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const store = useStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (email.trim() === '' || password === '') {
            setError('Enter your email and a password.');
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const ret = await api.Register(email.trim(), password);
            store.setUser(ret.user, ret.token);
            if (Status() === AccountStatus.Authenticated)
                return navigate(from, { replace: true });
            setError('Could not create your account, please try again.');
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Could not create your account, please try again.');
        }
        setLoading(false);
    }

    return (
        <div className='register-page justify-content-center align-items-center d-flex bg-white row gx-0'>
            <div className="register-content col-xl-5 col-lg-6 py-5 p-sm-5">
                <div className='mx-3'>
                    <h2 className="login-heading m-0 mb-3">Create account</h2>
                    <form className="auth-login-form mt-2" onSubmit={handleSubmit} >

                        <div className="position-relative form-group mb-3">
                            <label htmlFor="register-email" className="form-label">Email</label>
                            <input type="email" id="register-email" disabled={loading} autoFocus autoComplete="email" className='form-control' name="email" value={email} onChange={(e) => { setEmail(e.target.value); }} />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="register-password" className="form-label">Password</label>
                            <input id="register-password" disabled={loading} autoComplete="new-password" className='form-control' type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                            <div className="form-text">At least {MIN_PASSWORD_LENGTH} characters.</div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="register-confirm-password" className="form-label">Confirm password</label>
                            <input id="register-confirm-password" disabled={loading} autoComplete="new-password" className='form-control' type='password' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        </div>

                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

                        <div className="d-grid gap-2">
                            <button className="btn btn-primary" disabled={loading} >
                                {loading && <span className="spinner-border spinner-border-sm me-1" />}Create account
                            </button>
                        </div>

                        <p className="text-center mt-3 mb-0">
                            Already have an account? <Link to="/login" state={location.state}>Sign in</Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage
