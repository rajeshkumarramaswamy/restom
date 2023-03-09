import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: "row",
    marginTop: 36,
    justifyContent: "space-between",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    width: 60,
  },
});

const InvoiceNo = () => {
  // console.log("invoiceNo", props);
  let currentData = new Date().toLocaleString();
  return (
    <Fragment>
      <View style={styles.invoiceDateContainer}>
        <Text style={styles.label}>Date: </Text>
        <Text>{currentData}</Text>
      </View>
    </Fragment>
  );
};

export default InvoiceNo;
