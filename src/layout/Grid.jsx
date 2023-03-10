import { Layout, theme } from "antd";
import { useQuery } from "react-query";
import ParentContainer from "../containers/main/ParentContainer";
import { GetToken } from "../utils/api/api";
import Xeat from "../assets/xeat_delivery_partner_logo.png";
const { Header, Content, Footer } = Layout;
const Grid = () => {
  // const getToken = useQuery("token", GetToken, {
  //   refetchOnWindowFocus: false,
  // });
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
        }}
      >
        <img className="xeat_logo" src={Xeat} />
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "0 50px",
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
          }}
        >
          <ParentContainer />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Xeat Pvt Ltd ©2023 Created by Rajesh
      </Footer>
    </Layout>
  );
};
export default Grid;
