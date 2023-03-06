import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { Table } from "antd";
import React from "react";
import { driversRef } from "../../utils/services/ReactQueryServices";

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
  const queryDrivers = useFirestoreQuery(["drivers"], driversRef, {
    subscribe: true,
  });
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
