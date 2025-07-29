import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { Modal, Button, message, Form, Input, TimePicker, DatePicker } from 'antd';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();

  // Fetch busy dates
  useEffect(() => {
    fetchBusyDates();
  }, []);

  const fetchBusyDates = () => {
    axios.get('http://localhost:8080/api/busy/my')
      .then(response => {
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(`${event.date}T${event.startTime}`),
          end: new Date(`${event.date}T${event.endTime}`),
          isManual: event.clientId === null
        }));
        setEvents(formattedEvents);
      })
      .catch(error => {
        console.error('Error fetching busy dates:', error);
        message.error('Failed to load busy dates');
      });
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    form.resetFields();
    form.setFieldsValue({
      date: dayjs(start),
      startTime: dayjs(start),
      endTime: dayjs(end)
    });
    setModalVisible(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
    
    if (event.clientId === null) {
      form.setFieldsValue({
        title: event.title,
        date: dayjs(event.date),
        startTime: dayjs(event.startTime, 'HH:mm:ss'),
        endTime: dayjs(event.endTime, 'HH:mm:ss'),
        taskCity: event.taskCity
      });
    }
  };

 const handleSave = () => {
    form.validateFields().then(values => {
      const payload = {
        title: values.title || 'Busy',
        date: dayjs(values.date).format('YYYY-MM-DD'),
        startTime: dayjs(values.startTime).format('HH:mm:ss'),
        endTime: dayjs(values.endTime).format('HH:mm:ss'),
        taskCity: values.taskCity
      };

      // Always include the ID if it exists (for both manual and non-manual events)
      if (selectedEvent?.id) {
        payload.id = selectedEvent.id;
      }

      const apiCall = selectedEvent?.id
        ? axios.put(`http://localhost:8080/api/busy/${selectedEvent.id}`, payload)
        : axios.post('http://localhost:8080/api/busy', payload);

      apiCall
        .then((response) => {
          message.success('Busy date saved successfully');
          console.log('Saved data:', response.data); // Debug log
          fetchBusyDates();
          setModalVisible(false);
        })
        .catch(error => {
          console.error('Error saving busy date:', error.response?.data || error.message);
          message.error(error.response?.data?.message || 'Failed to save busy date');
        });
    });
};

  const handleDelete = () => {
    if (!selectedEvent?.isManual) return;

    Modal.confirm({
      title: 'Delete Busy Date',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this busy date?',
      onOk: () => {
        axios.delete(`http://localhost:8080/api/busy/${selectedEvent.id}`)
          .then(() => {
            message.success('Busy date deleted');
            fetchBusyDates();
            setModalVisible(false);
          })
          .catch(error => {
            console.error('Error deleting busy date:', error);
            message.error('Failed to delete busy date');
          });
      }
    });
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.clientId) {
      backgroundColor = '#f50';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="pt-20 p-4">
      <h2 className="text-xl font-bold mb-4">My Busy Dates Calendar</h2>
      
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      <Modal
        title={selectedEvent ? (selectedEvent.isManual ? 'Edit Busy Date' : 'Appointment Details') : 'Add Busy Date'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          selectedEvent?.isManual && (
            <Button key="delete" danger onClick={handleDelete}>
              Delete
            </Button>
          ),
          (!selectedEvent || selectedEvent?.isManual) && (
            <Button key="save" type="primary" onClick={handleSave}>
              Save
            </Button>
          )
        ]}
        width={700}
      >
        {selectedEvent && !selectedEvent.isManual ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Date:</strong> {dayjs(selectedEvent.date).format('YYYY-MM-DD')}</p>
              <p><strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}</p>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
            </div>
            <div>
              <p><strong>Client:</strong> {selectedEvent.clientFirstName || 'N/A'} {selectedEvent.clientLastName || 'N/A'}</p>
              <p><strong>Location:</strong> {selectedEvent.taskCity || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="title" label="Title">
                <Input placeholder="e.g. Personal Appointment" />
              </Form.Item>
              <Form.Item name="taskCity" label="Location">
                <Input placeholder="City/Town" />
              </Form.Item>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default AvailabilityCalendar;