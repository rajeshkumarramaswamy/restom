import {
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from "@react-query-firebase/firestore";
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
  Spin,
} from "antd";
import dayjs from "dayjs";
import { collection, doc } from "firebase/firestore";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import { epoch, modifySelectData } from "../../utils/common";
import { db } from "../../utils/firebase/firebaseConfig";
import {
  driversRef,
  locationsRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
const { Option } = Select;

let intial = {
  restaurant: "",
  location: "",
  driver: "",
  miles: "",
  mileageStart: "",
  mileageEnd: "",
  status: "",
  date: "",
  value: "",
};

const OrderFormEdit = (props) => {
  const [form] = Form.useForm();
  const [restoList, setrestoList] = useState([]);
  const [driversList, setdriversList] = useState([]);
  const [locationsList, setlocationsList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [orderRef, setorderRef] = useState(null);
  const orderValue = Form.useWatch("value", form);
  const mileageEnd = Form.useWatch("mileageEnd", form);
  const mileageStart = Form.useWatch("mileageStart", form);
  const paidToRestaurant = Form.useWatch("paid", form);
  const costPerKm = Form.useWatch("costPerKm", form);

  const orderMutate = useFirestoreDocumentMutation(orderRef, { merge: true });
  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef, {
    subscribe: true,
  });

  const queryDrivers = useFirestoreQuery(["drivers"], driversRef, {
    subscribe: true,
  });
  const queryLocations = useFirestoreQuery(["locations"], locationsRef, {
    subscribe: true,
  });

  useEffect(() => {
    if (orderMutate.isSuccess) {
      api.success({
        message: `Order updated`,
        description: (
          <div>
            Order <b>{get(props, "editDetails.orderNumber", "")}</b> updated
            successfully
          </div>
        ),
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
    } else if (orderMutate.isError) {
      api.error({
        message: `Order updation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [orderMutate.isSuccess]);

  useEffect(() => {
    if (queryRestaurants.isFetched) {
      const fetchRestaurants = queryRestaurants.data?.docs.map(
        (docSnapshot) => {
          const doc = docSnapshot.data();
          return doc;
        }
      );
      let finalRestaurants = modifySelectData(fetchRestaurants);
      setrestoList(finalRestaurants);
    }
  }, [queryRestaurants.isFetched]);

  useEffect(() => {
    if (queryDrivers.isFetched) {
      const fetchDrivers = queryDrivers.data?.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      let finalDrivers = modifySelectData(fetchDrivers);
      setdriversList(finalDrivers);
    }
  }, [queryDrivers.isFetched]);

  useEffect(() => {
    if (queryLocations.isFetched) {
      const fetchLocations = queryLocations.data?.docs.map((docSnapshot) => {
        const doc = docSnapshot.data();
        return doc;
      });
      let finalLocations = modifySelectData(fetchLocations);
      setlocationsList(finalLocations);
    }
  }, [queryLocations.isFetched]);

  useEffect(() => {
    form.setFieldsValue({
      ...props.editDetails,
      date: dayjs(props.editDetails.date),
    });
    if (get(props, "editDetails.id", false)) {
      setorderRef(doc(collection(db, "orders"), props.editDetails.id));
    }
  }, [props.editDetails.name]);

  const handleSubmit = (values) => {
    orderMutate.mutate({
      ...values,
      id: props.editDetails.id,
      deliveryCharge:
        (values.mileageEnd - values.mileageStart) * values.costPerKm,
      costPerKm: costPerKm,
      date: epoch(values.date),
    });
  };
  const onValuesChange = (changedValues, allValues) => {
    const fieldName = Object.keys(changedValues)[0];

    if (fieldName === "paid" && changedValues["paid"]) {
      form.setFieldsValue({
        value: 0,
      });
    } else if (fieldName === "paid" && !changedValues["paid"]) {
      form.setFieldsValue({
        value: props.editDetails.value,
      });
    }
  };

  const handleClose = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <>
      <Spin spinning={orderMutate.isLoading}>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          onValuesChange={onValuesChange}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
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
                  loading={queryRestaurants.isLoading}
                >
                  {restoList.map((rest) => {
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
                <Select
                  placeholder="Please select a location"
                  className="addScroll"
                  loading={queryLocations.isLoading}
                >
                  {locationsList.map((rest) => {
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
                  loading={queryDrivers.isLoading}
                >
                  {driversList.map((driver) => {
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
              <Form.Item name="paid" label="Order paid">
                <Select placeholder="Please select payment status">
                  <Option value={true}>Yes</Option>
                  <Option value={false}>No</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Customer location" name="customerLocation">
                <Input placeholder="Customer location" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Customer number" name="customerNumber">
                <Input placeholder="Customer Numbers" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Bike Kilometers"
                style={{
                  marginBottom: 0,
                }}
              >
                <Form.Item
                  name="mileageStart"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Mileage start",
                    },
                  ]}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                  }}
                >
                  <Input type="number" placeholder="Bike kilometers start" />
                </Form.Item>
                <Form.Item
                  name="mileageEnd"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Mileage end",
                    },
                  ]}
                  style={{
                    display: "inline-block",
                    width: "calc(50% - 8px)",
                    margin: "0 8px",
                  }}
                >
                  <Input type="number" placeholder="Bike kilometers end" />
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Cost per Km"
                style={{
                  marginBottom: 0,
                }}
              >
                <Form.Item
                  name="costPerKm"
                  rules={[
                    {
                      required: true,
                      message: "Please enter cost per Km",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    max={mileageEnd}
                    placeholder="Cost per Km"
                  />
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
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
                <DatePicker showTime />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="value"
                label="Value"
                rules={[
                  {
                    required: !paidToRestaurant,
                    message: "Enter Value",
                  },
                ]}
              >
                <Input
                  disabled={paidToRestaurant}
                  style={{
                    width: "100%",
                  }}
                  type="number"
                  placeholder="Please enter value"
                />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button onClick={handleClose}>Cancel / Close</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form>
      </Spin>

      <div
        style={{
          marginTop: "20px",
          bottom: 0,
          fontWeight: "bolder",
          color: "gray",
        }}
      >
        <h1>Total : {orderValue}</h1>
        <p>
          Delivery Charges :{" "}
          {`Rs.${(mileageEnd - mileageStart) * costPerKm || 0}`}
        </p>
      </div>
      {contextHolder}
    </>
  );
};
export default OrderFormEdit;
