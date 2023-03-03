import { Space, Table, Tag } from "antd";
import React from "react";
import Icon, { EditOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { GetDrivers, GetOrders, GetRestaurants } from "../../utils/api/api";
import { driversRef } from "../../utils/services/ReactQueryServices";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
const columns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Vehicle Number",
    dataIndex: "vehicleNumber",
    key: "vehicleNumber",
  },
];

const DriversTable = () => {
  const queryDrivers = useFirestoreQuery(["drivers"], driversRef);
  const fetchDrivers = queryDrivers.data?.docs?.map((docSnapshot) => {
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
      dataSource={fetchDrivers}
      loading={queryDrivers.isLoading}
      scroll={{
        y: 375,
      }}
    />
  );
};
export default DriversTable;
