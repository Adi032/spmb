
import { StudentRegistration } from '../types';

/**
 * GANTI URL DI BAWAH INI dengan URL Web App Anda 
 * yang didapat setelah klik 'Deploy' > 'New Deployment' di Google Apps Script.
 */
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyyNRzuqVn5wE2RXR3h4RyEUcN-JyZLhcIHMRKJ8L_Aov8tqxxo93wUZJiypeUCWfMbbw/exec';

export const api = {
  submitRegistration: async (data: StudentRegistration) => {
    // Check if URL is still placeholder
    if (GAS_URL.includes('AKfycbzECTRz9Fh')) {
      console.warn("Peringatan: Anda masih menggunakan URL API dummy. Pastikan sudah menggantinya di services/api.ts");
    }

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        // Menggunakan mode no-cors jika perlu, tapi GAS biasanya butuh mode default dengan penanganan redirect
        mode: 'cors', 
        body: JSON.stringify({ action: 'register', payload: data })
      });
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getAllRegistrations: async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({ action: 'list' })
      });
      const result = await response.json();
      return result.list || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }
};
