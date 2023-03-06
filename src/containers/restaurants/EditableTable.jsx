import { Form, InputNumber, Table, Typography, Input, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import { restaurantsRef } from "../../utils/services/ReactQueryServices";
import {
  useFirestoreDocumentMutation,
  useFirestoreQuery,
} from "@react-query-firebase/firestore";
import { doc, collection } from "firebase/firestore";
import { db } from "../../utils/firebase/firebaseConfig";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [mutationRef, setmutationRef] = useState(null);
  const queryRestaurants = useFirestoreQuery(["retaurants"], restaurantsRef, {
    subscribe: true,
  });
  const mutationResto = useFirestoreDocumentMutation(mutationRef);
  const fetchRestaurants = queryRestaurants.data?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  useEffect(() => {
    if (queryRestaurants.isFetched) {
      setData(fetchRestaurants);
    }
  }, [queryRestaurants.isFetched]);

  useEffect(() => {
    if (!!mutationRef) {
      mutationResto.mutate(form.getFieldValue());
    }
  }, [mutationRef]);

  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      phone: "",
      location: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => record.id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setmutationRef(doc(collection(db, "restaurants"), record.id));
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Restaurant",
      dataIndex: "name",
      key: "restaurant",
      editable: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              {mutationResto.isLoading ? "Saving" : "Save"}
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        loading={queryRestaurants.isLoading}
        rowClassName="editable-row"
        scroll={{
          y: 375,
        }}
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default EditableTable;
