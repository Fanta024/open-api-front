import {PageContainer} from '@ant-design/pro-components';
import ReactECharts from 'echarts-for-react';
import {useEffect, useState} from "react";
import {listTopInvokeInterfaceInfoUsingGET} from "@/services/openapiBackend/analysisInterfaceController";
import {message} from "antd";

const AnalysisInterface: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfoVO[]>([])

  useEffect(() => {
    try {
      listTopInvokeInterfaceInfoUsingGET().then(res => {
        if (res.data) {
          setData(res.data);
        }
      });
    } catch (e) {
      message.error('服务器异常');
    }
  }, [])  //deps内的数据发生变化后会执行回调函数  这里是空数组  所有只会执行一次
  const echartsData = data.map(item => {
    return {
      value: item.totalInvokeNum,
      name: item.name
    }
  })
  const option = {
    title: {
      text: '接口分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: echartsData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  return (
    <PageContainer title={"接口分析"}>
      <ReactECharts option={option}/>
    </PageContainer>
  );
};

export default AnalysisInterface;
