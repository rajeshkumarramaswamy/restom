import { Drawer, Space, Table } from "antd";
import React, { useState, useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useFirestoreQuery } from "@react-query-firebase/firestore";
import { restaurantsRef } from "../../utils/services/ReactQueryServices";
import RestaurantEditForm from "../../components/forms/RestaurantEditForm";

const initial = {
  openDrawer: false,
  editDetails: {},
};
const RestaurantsTable = (props) => {
  const [restoState, setrestoState] = useState(initial);

  const handleEdit = (record) => {
    setrestoState({
      openDrawer: true,
      editDetails: record,
    });
  };

  const onClose = (second) => {
    setrestoState(initial);
  };
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
          <EditOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
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
    <>
      <Table
        bordered
        columns={columns}
        dataSource={fetchRestaurants}
        loading={queryRestaurants.isLoading}
        scroll={{
          y: 375,
        }}
      />
      <Drawer
        title={"Edit restaurant"}
        width={720}
        onClose={onClose}
        open={restoState.openDrawer}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <div>
          <RestaurantEditForm
            editDetails={restoState.editDetails}
            onClose={onClose}
          />
        </div>
      </Drawer>
    </>
  );
};
export default RestaurantsTable;
