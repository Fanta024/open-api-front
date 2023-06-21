import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, List, message, Pagination} from 'antd';
import React, {useEffect, useState} from 'react';
import {listInterfaceInfoByPageUsingGET} from "@/services/openapiBackend/interfaceInfoController";


const PAGESIZE = 10
const Index: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [dataList, setDataList] = useState<API.InterfaceInfo[]>([]);
  const loadingData = async (current = 1, pageSize = PAGESIZE) => {
    setLoading(true)
    try {
      let res = await listInterfaceInfoByPageUsingGET({current, pageSize})
      setDataList(res?.data?.records ?? [])
      setTotal(res?.data?.total ?? 0)
    } catch (error: any) {
      message.error('请求失败，' + error.message);
    }
    setLoading(false)
  }

  useEffect(() => {
    loadingData()
  }, [])
  return (
    <PageContainer title={"在线接口平台"}>
      <Card>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={dataList}
          renderItem={(item) => {
            const apiLink = `/interfaceInfo/${item.id}`;
            return (<List.Item
              actions={[<a href={apiLink}>查看接口</a>]}
            >
              <List.Item.Meta
                title={<a key={item.id} href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>)
          }}
        />
        <Pagination showTotal={(total) => `总数：${total}`}
                    defaultCurrent={1} total={total} pageSize={PAGESIZE}
                    onChange={(page, pageSize) => {
                      loadingData(page, pageSize)
                    }}/>
      </Card>
    </PageContainer>
  );
};

export default Index;
