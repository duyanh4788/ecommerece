import React, { useState } from 'react';
import { Link } from '@mui/material';
import { pathParams } from 'commom/common.contants';

export const Password = () => {
  const [user, setUser] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: '',
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = event => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log('ok');
    }
  };

  const validate = () => {
    let validationErrors: any = {};
    if (!user.email) {
      validationErrors.email = 'Please enter your email.';
    }
    setErrors(validationErrors);
    return validationErrors;
  };

  return (
    <div className="sign_in">
      <div className="wrap_login">
        <h5>Forgot Password</h5>
        <form noValidate onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          {errors.email && <span className="msg_error">*{errors.email}</span>}
          <div style={{ textAlign: 'center' }}>
            <button type="submit">Fogot Password</button>
          </div>
        </form>
        <Link href={pathParams.SIGNIN}>Sign In</Link>
      </div>
    </div>
  );
};
