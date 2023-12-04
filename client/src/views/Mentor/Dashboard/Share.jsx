import { Modal, Button, Form, Select } from 'antd';
import React, { useState } from 'react';

export default function Share({ lesson, teachers }) {
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
    // setSharedLesson(lesson, values.share);
    handleOk();
  }

  return (
    <div>
      <button id='share-btn' onClick={showModal}>Share</button>
      <Modal visible={visible} onCancel={handleCancel} footer={null}>
	<br/>
	<Form form={form} onFinish={onFinish} >
	  <Form.Item name='share' label='Share lesson to: ' rules={[{ required: true, message: 'Please select a teacher!' }]}>
	    <Select>
	      {teachers.map(teach => <Select.Option key={teach.id} value={teach.id}>{teach.first_name} {teach.last_name}</Select.Option>)}
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