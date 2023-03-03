import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

const { Option } = Select;

const RestaurantForm = (props) => {
  const queryClient = useQueryClient();
  const { RangePicker } = DatePicker;

  const dateFunction = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  const onOk = (value) => {
    console.log("onOk: ", value);
  };
  console.log("query", queryClient.getQueriesData("fetchRestaurants"));
  return (
    <>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="restaurant"
              label="Restaurant"
              rules={[
                {
                  required: true,
                  message: "Please select Restaurant",
                },
              ]}
            >
              <Select placeholder="Please select a restaurant">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: "Please enter location",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                placeholder="Please enter location"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="driver"
              label="Driver"
              rules={[
                {
                  required: true,
                  message: "Please select an Driver",
                },
              ]}
            >
              <Select placeholder="Please select an Driver">
                <Option value="xiao">Xiaoxiao Fu</Option>
                <Option value="mao">Maomao Zhou</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="miles"
              label="Miles"
              rules={[
                {
                  required: true,
                  message: "Please enter miles",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                placeholder="Please enter miles"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Mileage"
              style={{
                marginBottom: 0,
              }}
            >
              <Form.Item
                name="mileageStart"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                }}
              >
                <Input placeholder="Mileage Start" />
              </Form.Item>
              <Form.Item
                name="mileageEnd"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
              >
                <Input placeholder="Mileage End" />
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="status"
              label="Status"
              rules={[
                {
                  required: true,
                  message: "Select status",
                },
              ]}
            >
              <Select placeholder="Please select status">
                <Option value="completed">Completed</Option>
                <Option value="inprogress">In progress</Option>
                <Option value="hold">Hold</Option>
                <Option value="failed">Failed</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="date"
              label="Date"
              rules={[
                {
                  required: true,
                  message: "Please choose the approver",
                },
              ]}
            >
              <DatePicker showTime onChange={dateFunction} onOk={onOk} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="value"
              label="Value"
              rules={[
                {
                  required: true,
                  message: "Enter Value",
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                placeholder="Please enter value"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "please enter url description",
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="please enter url description"
              />
            </Form.Item>
          </Col>
        </Row> */}
      </Form>
      <Space>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button onClick={props.onClose} type="primary">
          Submit
        </Button>
      </Space>
      <div
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <h1>Total : 23232</h1>
      </div>
    </>
  );
};
export default RestaurantForm;
