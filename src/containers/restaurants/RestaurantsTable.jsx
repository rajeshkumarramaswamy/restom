import { Space, Table } from "antd";
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { restaurantsRef } from "../../utils/services/ReactQueryServices";

const RestaurantsTable = () => {
  const columns = [
    {
      title: "Restaurant",
      dataIndex: "name",
      key: "restaurant",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
        </Space>
      ),
    },
  ];

  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef, {
    subscribe: true,
  });
  const fetchRestaurants = queryRestaurants.data?.docs.map((docSnapshot) => {
    const doc = docSnapshot.data();
    return doc;
  });

  return (
    <Table
      bordered
      columns={columns}
      dataSource={fetchRestaurants}
      loading={queryRestaurants.isLoading}
      scroll={{
        y: 375,
      }}
    />
  );
};
export default RestaurantsTable;
