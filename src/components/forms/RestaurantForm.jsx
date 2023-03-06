import { Button, Form, Input, Space, notification } from "antd";
import React, { useState, useEffect } from "react";
import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { restaurantsRef } from "../../utils/services/ReactQueryServices";

const initial = {
  name: "",
  location: "",
  phone: "",
};

const RestaurantForm = (props) => {
  const [restState, setrestState] = useState(initial);
  const [api, contextHolder] = notification.useNotification();
  const restoForm = useFirestoreCollectionMutation(restaurantsRef);

  useEffect(() => {
    if (restoForm.isSuccess) {
      api.success({
        message: `Restaurant Created`,
        description: `Restaurant ${restoForm.variables.name} created successfully`,
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      setrestState(initial);
    } else if (restoForm.isError) {
      api.error({
        message: `Restaurant creation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [restoForm.isSuccess]);

  const handleState = (value, type) => {
    setrestState({
      ...restState,
      [type]: value,
    });
  };

  const handleSubmit = () => {
    restoForm.mutate(restState);
  };
  return (
    <>
      <Form layout="vertical" hideRequiredMark>
        <Form.Item name="restaurant" label="Restaurant">
          <Input
            style={{
              width: "100%",
            }}
            placeholder="Please enter restaurant name"
            onChange={(e) => handleState(e.target.value, "name")}
            value={restState.name}
          />
        </Form.Item>
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
            onChange={(e) => handleState(e.target.value, "location")}
            value={restState.location}
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
            value={restState.phone}
          />
        </Form.Item>
      </Form>
      <Space>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          type="primary"
          loading={restoForm.isLoading}
        >
          Submit
        </Button>
      </Space>
      {contextHolder}
    </>
  );
};
export default RestaurantForm;
