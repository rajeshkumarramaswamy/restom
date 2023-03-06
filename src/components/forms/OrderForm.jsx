import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  notification,
} from "antd";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import { driversData, restaurantsData } from "../../data/data";
import { epoch } from "../../utils/common";
import { ordersRef } from "../../utils/services/ReactQueryServices";
const { Option } = Select;

let intial = {
  name: "",
  location: "",
  driver: "",
  miles: "",
  mileageStart: "",
  mileageEnd: "",
  status: "",
  date: "",
  value: "",
};

const OrderForm = (props) => {
  const [api, contextHolder] = notification.useNotification();
  const orderMutate = useFirestoreCollectionMutation(ordersRef);
  const [orderState, setorderState] = useState(intial);

  useEffect(() => {
    if (orderMutate.isSuccess) {
      api.success({
        message: `Order Created`,
        description: `Order ${orderMutate.variables.name} created successfully`,
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      setorderState(intial);
    } else if (orderMutate.isError) {
      api.error({
        message: `Order creation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [orderMutate.isSuccess]);

  const dateFunction = (value, dateString) => {
    setorderState({
      ...orderState,
      date: epoch(dateString),
    });
  };
  const onSelectChange = (value, type) => {
    setorderState({
      ...orderState,
      [type]: value,
    });
  };

  const handleTextInput = (value, type) => {
    setorderState({
      ...orderState,
      [type]: value,
    });
  };
  const handleSubmit = () => {
    orderMutate.mutate(orderState);
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
                onChange={(value) => onSelectChange(value, "name")}
                value={orderState.name}
              >
                {restaurantsData.map((rest) => {
                  return (
                    <Option
                      key={get(rest, "name", "")}
                      value={get(rest, "name", "")}
                    >
                      {get(rest, "name", "")}
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
                value={orderState.location}
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
                onChange={(value) => onSelectChange(value, "driver")}
                value={orderState.driver}
              >
                {driversData.map((driver) => {
                  return (
                    <Option value={get(driver, "firstName", "")}>
                      {get(driver, "firstName", "")}
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
                value={orderState.miles}
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
                  value={orderState.mileageStart}
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
                  value={orderState.mileageEnd}
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
                onChange={(value) => onSelectChange(value, "status")}
                value={orderState.status}
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
              <DatePicker
                showTime
                onChange={dateFunction}
                value={orderState.date}
              />
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
                value={orderState.value}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Space>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          type="primary"
          loading={orderMutate.isLoading}
        >
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
      {contextHolder}
    </>
  );
};
export default OrderForm;
