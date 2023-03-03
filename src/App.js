import { ConfigProvider, theme } from "antd";
import "./App.css";
import Grid from "./layout/Grid";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { GetToken } from "./utils/api/api";
const queryClient = new QueryClient();
function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={{}}>
          <Grid />
        </ConfigProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
