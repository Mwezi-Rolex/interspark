import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const studentLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/student/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
      localStorage.setItem('userType', 'student');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const companySignup = async (companyData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/company/signup`, {
      email: companyData.email,
      password: companyData.password,
      companyName: companyData.companyName,
      description: companyData.description,
      industry: companyData.industry,
      location: companyData.location,
      website: companyData.website
    });

    if (response.data.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.company));
      localStorage.setItem('userType', 'company');
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.errors) {
      const errorMessages = error.response.data.errors.map(err =>
        `${err.field}: ${err.message}`
      ).join(', ');
      throw new Error(errorMessages);
    }
    throw error.response?.data || { message: 'Company signup failed' };
  }
};

export const companyLogin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/company/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.company));
      localStorage.setItem('userType', 'company');
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Company login failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
};

export const studentSignup = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/student/signup`, formData);

    if (response.data.message === 'Student registered successfully') {
      return {
        token: response.data.token,
        student: response.data.student
      };
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    throw error.response?.data || error;
  }
};
