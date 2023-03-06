import React, { useEffect } from "react";
import { Typography, Popconfirm } from "antd";

import { db } from "../../utils/firebase/firebaseConfig";
import { useFirestoreDocumentMutation } from "@react-query-firebase/firestore";
import { collection, doc } from "firebase/firestore";

const EditMutation = (props) => {
  const restCollect = collection(db, "restaurants");
  const ref = doc(restCollect, props.record.id);

  const restoMutation = useFirestoreDocumentMutation(ref);
  const handleMutate = () => {
    props.save(props.record);
  };
  useEffect(() => {
    if (restoMutation.isSuccess) {
      props.save(props.record);
    }
  }, [restoMutation.isSuccess]);

  return (
    <span>
      <Typography.Link
        onClick={handleMutate}
        style={{
          marginRight: 8,
        }}
      >
        {restoMutation.isLoading ? "Saving" : "Save"}
      </Typography.Link>
      <Popconfirm title="Sure to cancel?" onConfirm={props.cancel}>
        <a>Cancel</a>
      </Popconfirm>
    </span>
  );
};

export default EditMutation;
