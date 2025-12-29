import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { AccountStatus, Status } from '../../hooks/auth';
import { useStore } from '../../store';

const LoginPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const store = useStore();

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password === '' || email === '') return;

        setLoading(true);
        await api.Login(email, password).then((ret) => {
            store.setUser(ret.user);
            if (Status() === AccountStatus.Authenticated)
                return navigate(from, { replace: true });
            setEmail('');
            setPassword('');
            setLoading(false);
        })


    }

    return (
        <div className='register-page vh-100 d-flex bg-white row gx-0'>
            <div className="register-content col-xl-5 col-lg-6 py-5 p-sm-5">
                <div className='mx-3'>
                    <h2 className="login-heading m-0 mb-3">Welcome</h2>
                    <p className="card-text mb-4">Please sign-in to your account using your login credentials</p>
                    <form className="auth-login-form mt-2" onSubmit={handleSubmit} >

                        <div className="position-relative form-group mb-3">
                            <label htmlFor="login-email" className="form-label">Email</label>
                            <input type="text" aria-describedby="login-email" id="login-email" disabled={loading} autoFocus tabIndex={1} className='form-control' name="email" value={email} onChange={(e) => { setEmail(e.target.value); }} />
                            <div className="invalid-feedback">A valid email is required</div>
                        </div>

                        <div className="form-group mb-3">
                            <div className="d-flex justify-content-between">
                                <label htmlFor="login-password" className="form-label">Password</label>
                            </div>
                            <div className="position-relative input-group form-password-toggle">
                                <input aria-describedby="login-password" id="login-password" tabIndex={2} disabled={loading} className='form-control' type='password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                            </div>
                            <div className="invalid-feedback">A password is required</div>
                        </div>

                        <div className="d-grid gap-2">
                            <button tabIndex={4} className="btn btn-primary" disabled={loading} >
                                {loading && <span className="spinner-border spinner-border-sm me-1" />}Sign in
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    );
};

export default LoginPage
