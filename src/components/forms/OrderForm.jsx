import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import { useQueryClient, useQuery } from "react-query";
import { ordersRef } from "../../utils/services/ReactQueryServices";
const { Option } = Select;

let intial = {
  restaurantName: "",
  location: "",
  driver: "",
  miles: "",
  mileageStart: "",
  mileageEnd: "",
  status: "",
  date: "",
  orderValue: "",
};

const OrderForm = (props) => {
  const queryClient = useQueryClient();

  const [orderState, setorderState] = useState(intial);
  const { RangePicker } = DatePicker;
  const dateFunction = (value, dateString) => {
    console.log("Selected Time: ", value.toDate());
  };
  const onSelectChange = (value) => {
    console.log("onOk: ", value);
  };

  const handleTextInput = (value, type) => {
    setorderState({
      ...orderState,
      [type]: value,
    });
  };

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
              <Select
                placeholder="Please select a restaurant"
                onChange={onSelectChange}
              >
                {queryClient
                  .getQueryData("fetchRestaurant")
                  ?.data?.map((obj) => {
                    return (
                      <Option
                        key={get(obj, "_fieldsProto.name.stringValue", "")}
                        value={get(obj, "_fieldsProto.name.stringValue", "")}
                      >
                        {get(obj, "_fieldsProto.name.stringValue", "")}
                      </Option>
                    );
                  })}
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
                onChange={(e) => handleTextInput(e.target.value, "location")}
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
              <Select
                placeholder="Please select an Driver"
                onChange={onSelectChange}
              >
                {queryClient.getQueryData("fetchDrivers").data.map((driver) => {
                  return (
                    <Option
                      value={get(
                        driver,
                        "_fieldsProto.firstName.stringValue",
                        ""
                      )}
                    >
                      {get(driver, "_fieldsProto.firstName.stringValue", "")}
                    </Option>
                  );
                })}
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
                onChange={(e) => handleTextInput(e.target.value, "miles")}
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
                <Input
                  placeholder="Mileage Start"
                  onChange={(e) =>
                    handleTextInput(e.target.value, "mileageStart")
                  }
                />
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
                <Input
                  placeholder="Mileage End"
                  onChange={(e) =>
                    handleTextInput(e.target.value, "mileageEnd")
                  }
                />
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
              <Select
                placeholder="Please select status"
                onChange={onSelectChange}
              >
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
              <DatePicker showTime onChange={dateFunction} />
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
                onChange={(e) => handleTextInput(e.target.value, "value")}
              />
            </Form.Item>
          </Col>
        </Row>
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
          fontWeight: "bolder",
          color: "gray",
        }}
      >
        <h1>Total : {orderState.value}</h1>
      </div>
    </>
  );
};
export default OrderForm;
