import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, DatePicker, Spin } from "antd";
import AuthService from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { formatToYYYYMMDD } from "../../utils/util";

const { Option } = Select;

const ScheduleVaccination = () => {
  const storedUser = AuthService.getUser();
  const [form] = Form.useForm();
  const [vaccineList, setVaccineList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaccineResponse = await ApiService.getVaccines();
        setVaccineList(vaccineResponse);

        const timeSlotResponse = await ApiService.getAvailableTimeSlots();
        console.log(timeSlotResponse, "timeSlotResponse");
        setTimeSlots(timeSlotResponse.time_slots);
      } catch (error) {
        message.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date ? new Date(date) : null);
  };
  
  const filteredTimeSlots = timeSlots
    .filter(
      (slot) =>
        selectedDate && slot.Date ===  formatToYYYYMMDD(selectedDate) // Format selectedDate as "YYYY-MM-DD"
    )
    .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

  const onFinish = async (values) => {
    try {
      const payload = {
        patient_ssn: storedUser?.entity_id,
        vaccine_id: selectedVaccine,
        time_slot_id: selectedTimeSlot,
      };
      const response = await ApiService.scheduleAppointment(payload);
      message.success(response.message);
      form.resetFields();
      navigate("/patient"); // Redirect to patient page after successful scheduling
    } catch (error) {
      message.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <>
      <h1>Schedule Vaccination</h1>
      <Spin spinning={loading} tip="Fetching Data...">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Select Date"
            name="selectedDate"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker onChange={handleDateChange} />
          </Form.Item>

          <Form.Item
            name="vaccine_id"
            label="Select Vaccine"
            rules={[{ required: true, message: "Please select a vaccine" }]}
          >
            <Select
              placeholder="Select a vaccine"
              onChange={(value) => setSelectedVaccine(value)}
            >
              {vaccineList.length > 0 &&
                vaccineList.map((vaccine) => (
                  <Option key={vaccine.VaccineID} value={vaccine.VaccineID}>
                    {vaccine.Name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="time_slot_id"
            label="Select Time Slot"
            rules={[{ required: true, message: "Please select a time slot" }]}
          >
            <Select
              placeholder="Select a time slot"
              onChange={(value) => setSelectedTimeSlot(value)}
            >
              {filteredTimeSlots.map((slot) => (
                <Option key={slot.SlotID} value={slot.SlotID}>
                  {`Start Time: ${slot.StartTime} -  EndTime:${slot.EndTime}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Schedule Vaccination
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default ScheduleVaccination;
