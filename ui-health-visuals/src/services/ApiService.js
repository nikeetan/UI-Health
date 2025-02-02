import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

const ApiService = {
  // Admin
  registerNurse: async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/nurse`, payload);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getVaccines: async () => {
    try {
      const response = await axios.get(`${API_URL}/vaccines`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getVaccineById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/vaccine/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching vaccine");
    }
  },
  updateVaccine: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/update_vaccine/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error("Error updating vaccine");
    }
  },
  addVaccine: async (payload) => {
    try {
      const response = await axios.post(`${API_URL}/vaccine/add`, payload);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getPatientInfo: async (patientId) => {
    try {
      const response = await axios.get(`${API_URL}/patient-info/${patientId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getAllNurses: async () => {
    try {
      const response = await axios.get(`${API_URL}/nurse`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching nurses");
    }
  },
  getNurseById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/nurse/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching nurse");
    }
  },
  updateNurse: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/nurse/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error("Error updating nurse");
    }
  },
  deleteNurse: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/nurse/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error deleting nurse");
    }
  },
  // Nurse
  updateDetails: async (id, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/nurseAction/nurse/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching nurse");
    }
  },
  cancelNurseSchedule: async (nurseId, timeslotId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/nurseAction/nurse/${nurseId}/timeslot/${timeslotId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching nurse");
    }
  },
  getTimeSlots: async () => {
    try {
      const response = await axios.get(`${API_URL}/time-slots`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching Timeslots");
    }
  },
  scheduleNurse: async (payload) => {
    try {
      const response = await axios.post(
        `${API_URL}/nurseAction/schedule-time`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPatientDetailsWithNurse: async (nurse_id, patient_id) => {
    try {
      const response = await axios.get(
        `${API_URL}/nurseAction/${nurse_id}/patient-info/${patient_id}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching Timeslots");
    }
  },
  recordVaccination: async (payload) => {
    try {
      const response = await axios.post(
        `${API_URL}/nurseAction/record-vaccination`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAvailableTimeSlots: async () => {
    try {
      const response = await axios.get(`${API_URL}/patient/time-slots`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching Timeslots");
    }
  },
  scheduleAppointment: async (payload) => {
    try {
      const response = await axios.post(
        `${API_URL}/patientAction/schedule_vaccination`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updatePatient: async (id, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/patientAction/patient/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw new Error("Error updating nurse");
    }
  },
  createPatient: async (payload) => {
    try {
      const response = await axios.post(
        `${API_URL}/patientAction/patient`,
        payload
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancelpatientSchedule: async (timeslotId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/patientAction/delete_scheduled_time/${timeslotId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error fetching patient");
    }
  },
};

export default ApiService;
