import { Button, Form, Input, Space, notification } from "antd";
import React, { useState, useEffect } from "react";
import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { driversRef } from "../../utils/services/ReactQueryServices";

const initial = {
  firstName: "",
  lastName: "",
  phone: "",
  vehicleNumber: "",
};

const DriverForm = (props) => {
  const [driverState, setdriverState] = useState(initial);
  const [api, contextHolder] = notification.useNotification();
  const driverForm = useFirestoreCollectionMutation(driversRef);

  useEffect(() => {
    if (driverForm.isSuccess) {
      api.success({
        message: `Driver Created`,
        description: `Driver ${driverForm.variables.name} created successfully`,
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      setdriverState(initial);
    } else if (driverForm.isError) {
      api.error({
        message: `Driver creation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [driverForm.isSuccess]);

  const handleState = (value, type) => {
    setdriverState({
      ...driverState,
      [type]: value,
    });
  };

  const handleSubmit = () => {
    driverForm.mutate(driverState);
  };
  return (
    <>
      <Form layout="vertical" hideRequiredMark>
        <Form.Item name="First Name" label="Restaurant">
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter first name"
            onChange={(e) => handleState(e.target.value, "firstName")}
            value={driverState.name}
          />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            {
              required: true,
              message: "Please enter last name",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter last name"
            onChange={(e) => handleState(e.target.value, "lastName")}
            value={driverState.location}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              required: true,
              message: "Please enter phone",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter phone"
            onChange={(e) => handleState(e.target.value, "phone")}
            value={driverState.phone}
          />
        </Form.Item>
        <Form.Item
          name="vehicleNumber"
          label="Vehicle Number"
          rules={[
            {
              required: true,
              message: "Please enter vehicle number",
            },
          ]}
        >
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter vehicle number"
            onChange={(e) => handleState(e.target.value, "vehicleNumber")}
            value={driverState.phone}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          type="primary"
          loading={driverForm.isLoading}
        >
          Submit
        </Button>
      </Space>
      {contextHolder}
    </>
  );
};
export default DriverForm;
