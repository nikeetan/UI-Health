import React, { useState, useEffect } from "react";
import { Form, Select, Button, message, DatePicker, Spin } from "antd";
import AuthService from "../../services/AuthService";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ScheduleTimePage = () => {
  const storedUser = AuthService.getUser();
  const [form] = Form.useForm();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await ApiService.getTimeSlots();
        setTimeSlots(response.time_slots);
      } catch (error) {
        message.error("An error occurred while fetching time slots");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date ? new Date(date) : null);
  };

  const filteredTimeSlots = timeSlots
    .filter(
      (slot) =>
        selectedDate && slot.Date === selectedDate.toISOString().split("T")[0]
    )
    .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

  const onFinish = async (values) => {
    try {
      const payload = {
        nurse_id: storedUser?.entity_id,
        time_slot_id: selectedTimeSlot,
      };
      const response = await ApiService.scheduleNurse(payload);
      message.success(response.message);
      form.resetFields();
      navigate('/nurse')
    } catch (error) {
      message.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <>
      <h1>Schedule Time</h1>
      <Spin spinning={loading} tip="Fetching Time Slots...">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Select Date"
            name="selectedDate"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker onChange={handleDateChange} />
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
              Schedule Appointment
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default ScheduleTimePage;
