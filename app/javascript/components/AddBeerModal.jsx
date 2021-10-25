import React, { useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';

const { Option } = Select;

export default function AddBeerModal({ reloadBeers }) {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async values => {
    try {
      const url = 'api/v1/beers/create';

      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Network error.');

      const data = await response.json();

      handleCancel();
      form.resetFields();
      reloadBeers();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create New +
      </Button>

      <Modal title="Add New Beer ..." visible={visible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="brand" label="Brand" rules={[{ required: true, message: "Please input your beer's brand!" }]}>
            <Input placeholder="Input your beer's brand" />
          </Form.Item>

          <Form.Item name="style" label="Style" rules={[{ required: true, message: "Please input your beer's style!" }]}>
            <Input placeholder="Input your beer's style" />
          </Form.Item>

          <Form.Item
            name="country"
            label="Country"
            rules={[
              {
                required: true,
                message: "Please input your beer's country!",
              },
            ]}
          >
            <Select showSearch placeholder="Select your beer's country" optionFilterProp="children" style={{ width: '100%' }}>
              <Option value="Finland">Finland</Option>
              <Option value="Germany">Germany</Option>
              <Option value="Netherlands">Netherlands</Option>
              <Option value="UK">UK</Option>
              <Option value="USA">USA</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input the quantity!' }]}>
            <Input type="number" placeholder="How many beers you desire?" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
