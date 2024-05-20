import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const Registration = () => {
  const navigate = useNavigate(); 

  const handleLoginClick = () => {
    navigate('/main'); 
  };

  return (
        <div className="reg-window-block">
            <form className='registration-container-form'>
                <input placeholder='Введите логин/почту' />
                <input placeholder='Введите пароль'/>
                <button className='form-button' type='button' onClick={handleLoginClick}>Войти</button>
                <div className='for-reg'>
                <p style={{marginRight: '10px'}}>У вас нет учетной записи?</p>
                <Link to="/prereg" >Зарегистрироваться</Link>
                </div>
            </form>
        </div>
  );
};

export default Registration;
