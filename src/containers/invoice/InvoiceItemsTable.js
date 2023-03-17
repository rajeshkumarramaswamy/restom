import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import InvoiceTableHeader from "./InvoiceTableHeader";
import InvoiceTableRow from "./InvoiceTableRow";
import InvoiceTableBlankSpace from "./InvoiceTableBlankSpace";
import InvoiceTableFooter from "./InvoiceTableFooter";
import { get } from "lodash";

const tableRowsCount = 11;

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#bff0fd",
  },
});

const InvoiceItemsTable = ({ invoice }) => {
  return (
    <View style={styles.tableContainer}>
      <InvoiceTableHeader />
      <InvoiceTableRow items={get(invoice, "alldocs", [])} />
      {tableRowsCount > get(invoice, "alldocs", []).length ? (
        <InvoiceTableBlankSpace
          rowsCount={tableRowsCount - get(invoice, "alldocs", []).length}
        />
      ) : (
        <InvoiceTableBlankSpace rowsCount={0} />
      )}

      <InvoiceTableFooter
        total={invoice.total}
        deliveryCharges={invoice.deliveryCharges}
        paidonDelivery={invoice.paidonDelivery}
        totalKms={invoice.totalKms}
      />
    </View>
  );
};

export default InvoiceItemsTable;
