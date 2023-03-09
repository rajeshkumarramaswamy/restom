import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { Table } from "antd";
import React from "react";
import { locationsRef } from "../../utils/services/ReactQueryServices";

const columns = [
  {
    title: "Location name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
];

const DriversTable = () => {
  const queryLocations = useFirestoreQuery(["locations"], locationsRef, {
    subscribe: true,
  });
  const fetchLocations = queryLocations.data?.docs?.map((docSnapshot) => {
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
      dataSource={fetchLocations}
      loading={queryLocations.isLoading}
      size="small"
      scroll={{
        y: 375,
      }}
    />
  );
};
export default DriversTable;
