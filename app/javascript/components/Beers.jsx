import React, { useState, useEffect } from 'react';
import { Table, message, Popconfirm, Button, Form, Input, Modal, Select } from 'antd';
import AddBeerModal from './AddBeerModal';

const { Option } = Select;

export default function Beers() {
  const [visible, setVisible] = useState(false);
  const [beers, setBeers] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '',
      key: 'action',
      render: (_text, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record)}>
            Update
          </Button>
          &nbsp; &nbsp;
          <Popconfirm title="Are you sure delete beer?" onConfirm={() => deleteBeer(record.id)} okText="Yes" cancelText="No">
            <Button type="danger">Delete </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const loadBeers = async () => {
    try {
      const url = 'api/v1/beers/index';

      const response = await fetch(url);

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      const beers = data.map(item => ({
        key: item.id,
        id: item.id,
        brand: item.brand,
        style: item.style,
        country: item.country,
        quantity: item.quantity,
      }));

      setBeers(beers);
    } catch (error) {
      console.log(error);
      message.error('Error: ' + error);
    }
  };

  const showModal = record => {
    form.setFieldsValue({
      id: record.id,
      key: record.key,
      brand: record.brand,
      style: record.style,
      country: record.country,
      quantity: record.quantity,
    });

    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const update = async values => {
    try {
      const url = 'api/v1/beers/';

      const response = await fetch(url, {
        method: 'put',
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

  useEffect(() => {
    loadBeers();
  }, []);

  const reloadBeers = () => {
    setBeers([]);
    loadBeers();
  };

  const deleteBeer = async id => {
    try {
      const url = `api/v1/beers/${id}`;

      const response = await fetch(url, {
        method: 'delete',
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      reloadBeers();

      return data;
    } catch (error) {
      console.log(error);
      message.error('Error: ' + error);
    }
  };

  return (
    <>
      <Table className="table-striped-rows" dataSource={beers} columns={columns} pagination={{ pageSize: 5 }} />

      <AddBeerModal reloadBeers={reloadBeers} />

      {/* Modal para actualizar */}
      <Modal title="Update beer ..." visible={visible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={update}>
          <Form.Item name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

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
