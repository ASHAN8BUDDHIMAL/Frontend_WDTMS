// ✅ All import statements MUST be at the top
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button, Input, TimePicker, Form, message } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

axios.defaults.withCredentials = true;

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const AvailabilityCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch bookings on mount
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/busy/my')
      .then((response) => {
        // Map backend data to calendar events with JS Date objects for start/end
        const loadedEvents = response.data.map((event) => ({
          ...event,
          start: new Date(`${event.date}T${event.startTime}`),
          end: new Date(`${event.date}T${event.endTime}`),
        }));
        setEvents(loadedEvents);
      })
      .catch((error) => {
        console.error('Failed to load availability:', error.response?.data || error.message);
        message.error('Failed to load availability');
      });
  }, []);

  // When user clicks on an empty slot
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setSelectedEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  // When user clicks on an existing event
  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
    form.setFieldsValue({
      title: event.title,
      startTime: dayjs(event.start),
      endTime: dayjs(event.end),
    });
  };

  // Save new or edited availability
  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      const payload = {
        title: values.title,
        startTime: dayjs(values.startTime).format('HH:mm'),
        endTime: dayjs(values.endTime).format('HH:mm'),
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
      };

      // If editing an existing event, do update (PUT), else create (POST)
      const request = selectedEvent
        ? axios.put(`http://localhost:8080/api/busy/${selectedEvent.id}`, payload)
        : axios.post('http://localhost:8080/api/busy', payload);

      request
        .then((response) => {
          // Update events state
          if (selectedEvent) {
            // Replace updated event
            setEvents((prev) =>
              prev.map((evt) => (evt.id === selectedEvent.id ? {
                ...response.data,
                start: new Date(`${response.data.date}T${response.data.startTime}`),
                end: new Date(`${response.data.date}T${response.data.endTime}`),
              } : evt))
            );
          } else {
            // Add new event
            const newEvent = {
              ...response.data,
              start: new Date(`${response.data.date}T${response.data.startTime}`),
              end: new Date(`${response.data.date}T${response.data.endTime}`),
            };
            setEvents((prev) => [...prev, newEvent]);
          }

          setModalVisible(false);
          form.resetFields();
          message.success('Availability saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving availability:', error.response?.data || error.message);
          message.error('Error saving availability');
        });
    });
  };

  // Delete availability event
  const handleDelete = () => {
    if (!selectedEvent || !selectedEvent.id) {
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this availability?',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        axios
          .delete(`http://localhost:8080/api/busy/${selectedEvent.id}`)
          .then(() => {
            setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
            message.success('Availability deleted');
            setModalVisible(false);
          })
          .catch((error) => {
            console.error('Error deleting availability:', error.response?.data || error.message);
            message.error('Failed to delete availability');
          });
      },
    });
  };

  return (
    <div className="pt-20 p-4 ">
      {/* <h2 className="text-xl font-bold mb-4 text-center">Availability Calendar</h2> */}
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleEventSelect}
        popup
      />

      <Modal
        title={selectedEvent ? 'Edit Availability' : 'Add Availability'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          selectedEvent && (
            <Button key="delete" danger onClick={handleDelete}>
              Delete
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
          key="save"
          type="primary"
          onClick={handleFormSubmit}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
        >
          Save
        </Button>
,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
            <Input placeholder="e.g. Personal Appointment" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: 'Please select end time' }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AvailabilityCalendar;
