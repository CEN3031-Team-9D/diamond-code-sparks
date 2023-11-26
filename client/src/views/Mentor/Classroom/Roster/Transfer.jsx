import { Modal, Button, Form, Select } from 'antd';
import React, { useState } from 'react';

export default function Transfer({ student, classrooms, setStudentClassroom }) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    setStudentClassroom(student.key, values.classroom);
    handleOk();
  }

  return (
    <div>
      <button id='link-btn' onClick={showModal}>Transfer</button>
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
	<br/>
	<Form form={form} onFinish={onFinish} >
	  <Form.Item name='classroom' label='Classroom' rules={[{ required: true, message: 'Please select a classroom!' }]}>
	    <Select>
	      {classrooms.map(room => <Select.Option key={room.id} value={room.id}>{room.name}</Select.Option>)}
	    </Select>
	  </Form.Item>
	  <Form.Item>
	    <Button type='primary' htmlType='submit'>OK</Button>
	  </Form.Item>
	</Form>
      </Modal>
    </div>
  );
}
