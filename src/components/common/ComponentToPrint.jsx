import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: "red",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  valueText: {},
});

// Create Document Component
const ComponentToPrint = (props) => {
  let { data } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>Xeat Delivery Partner</View>
        {data &&
          data.alldocs.length > 0 &&
          data.alldocs.map((order) => {
            return (
              <View style={styles.column}>
                <View style={styles.section}>
                  <Text>Restaurant Name</Text>
                </View>
                <View style={styles.section}>
                  <Text>{order.name}</Text>
                </View>
              </View>
            );
          })}
        <>
          <View style={styles.section}>
            <Text>Total</Text>
            <Text>{data.total}</Text>
          </View>
        </>
      </Page>
    </Document>
  );
};

export default ComponentToPrint;
