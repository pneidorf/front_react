import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


const PreRegistration = () => {
    const navigate = useNavigate(); 
  
    const handleLoginClick = () => {
      navigate('/'); 
    };
  
    return (
          <div className="pre-window-block">
              <form className='pre-registration-container-form'>
                  <h3 className='h3-registr'>Регистрация</h3>
                  <input  placeholder='Введите ваше имя' />
                  <input placeholder='Введите вашу фамилию' />
                  <input placeholder='Введите вашу электронную почту' />
                  <input placeholder='Придумайте пароль' />
                  <input placeholder='Повторите пароль' />
                  <button className='form-button' type='button' onClick={handleLoginClick}>Зарегестрироваться</button>
              </form>
          </div>
    );
  };
  
  export default PreRegistration;