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
} from "antd";
import dayjs from "dayjs";
import { collection, doc } from "firebase/firestore";
import { get } from "lodash";
import React, { useState, useEffect } from "react";
import { epoch, modifySelectData } from "../../utils/common";
import { db } from "../../utils/firebase/firebaseConfig";
import {
  driversRef,
  restaurantsRef,
} from "../../utils/services/ReactQueryServices";
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

const OrderFormEdit = (props) => {
  const [restoList, setrestoList] = useState([]);
  const [driversList, setdriversList] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [orderRef, setorderRef] = useState(null);

  const orderMutate = useFirestoreDocumentMutation(orderRef, { merge: true });
  const [orderState, setorderState] = useState(intial);
  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef, {
    subscribe: true,
  });

  const queryDrivers = useFirestoreQuery(["drivers"], driversRef, {
    subscribe: true,
  });

  useEffect(() => {
    if (orderMutate.isSuccess) {
      api.success({
        message: `Order updated`,
        description: `Order ${orderMutate.variables.name} updated successfully`,
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      setorderState(intial);
      props.onClose();
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
    if (!!orderRef) {
      orderMutate.mutate(orderState);
    }
  }, [orderRef]);

  useEffect(() => {
    setorderState(props.editDetails);
  }, [props.editDetails]);

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
    setorderRef(doc(collection(db, "orders"), props.editDetails.id));
  };
  console.log("props", props.editDetails, orderState);
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
                defaultValue={orderState.name}
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
              <Input
                style={{
                  width: "100%",
                }}
                placeholder="Please enter location"
                onChange={(e) => handleTextInput(e.target.value, "location")}
                value={orderState.location}
                defaultValue={orderState.location}
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
                defaultValue={orderState.driver}
              >
                {driversList.map((driver) => {
                  return (
                    <Option
                      key={get(driver, "firstName", "")}
                      value={get(driver, "firstName", "")}
                    >
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
                defaultValue={orderState.miles}
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
                  defaultValue={orderState.mileageStart}
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
                  defaultValue={orderState.mileageEnd}
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
                defaultValue={orderState.status}
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
                value={dayjs(orderState.date)}
                defaultValue={dayjs(orderState.date)}
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
                type="number"
                placeholder="Please enter value"
                onChange={(e) => handleTextInput(e.target.value, "value")}
                value={orderState.value}
                defaultValue={orderState.value}
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
export default OrderFormEdit;
