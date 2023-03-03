import { Space, Table } from "antd";
import React, { useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { restaurantsRef } from "../../utils/services/ReactQueryServices";
// import { GetRestaurants } from "../../utils/api/api";
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

const RestaurantsTable = () => {
  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef);
  const fetchRestaurants = queryRestaurants.data?.docs.map((docSnapshot) => {
    const doc = docSnapshot.data();
    return doc;
  });
  const tableProps = {
    bordered: true,
  };
  return (
    <Table
      {...tableProps}
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
