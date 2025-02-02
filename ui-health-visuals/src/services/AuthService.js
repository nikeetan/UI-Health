import axios from 'axios';
import { message } from 'antd';

class AuthService {
  static async login(username, password) {
    try {
      const response = await axios.post('http://127.0.0.1:5000/user/login', {
        username,
        password,
      });

      const { success, user, error } = response.data;

      if (success) {
        localStorage.setItem('user', JSON.stringify(user));
        message.success('Login successful');
        return { success: true, user };
      } else {
        message.error(error || 'An error occurred during login');
        return { success: false, error };
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred during login');
      return { success: false, error: 'An error occurred during login' };
    }
  }

  static logout() {
    localStorage.removeItem('user');
    message.success('Logout successful');
    window.location.href = '/'
  }

  static getUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}

export default AuthService;
