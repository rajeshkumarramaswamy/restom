import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import { Button, Form, Input, Space, notification, Spin } from "antd";
import React, { useEffect } from "react";
import { locationsRef } from "../../utils/services/ReactQueryServices";

const LocationsForm = (props) => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const locationMutation = useFirestoreCollectionMutation(locationsRef);

  useEffect(() => {
    if (locationMutation.isSuccess) {
      api.success({
        message: `Location Created`,
        description: (
          <div>
            Location <b>{form.getFieldValue("name")}</b> created successfully
          </div>
        ),
        placement: "bottomRight",
        style: {
          backgroundColor: "#f6ffed",
          border: "1px solid #b7eb8f",
        },
      });
      form.resetFields();
    } else if (locationMutation.isError) {
      api.error({
        message: `Location creation failed !`,
        description: `Please try again later`,
        placement: "bottomRight",
      });
    }
  }, [locationMutation.isSuccess]);
  const onFinish = (values) => {
    locationMutation.mutate(values);
  };

  return (
    <>
      <Spin spinning={locationMutation.isLoading}>
        <Form
          layout="vertical"
          hideRequiredMark
          form={form}
          onFinish={onFinish}
        >
          <Form.Item name="name" label="Location Name">
            <Input
              style={{
                width: "100%",
              }}
              placeholder="Please enter Location name"
            />
          </Form.Item>
          <Space>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        </Form>
      </Spin>
      {contextHolder}
    </>
  );
};

export default LocationsForm;
