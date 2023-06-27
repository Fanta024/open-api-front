import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns, ProDescriptionsItemProps} from '@ant-design/pro-components';
import {FooterToolbar, PageContainer, ProDescriptions, ProTable,} from '@ant-design/pro-components';
import {Button, Drawer, message, Popconfirm} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateModal from './components/UpdateModal';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST
} from "@/services/openapiBackend/interfaceInfoController";
import {SortOrder} from "antd/es/table/interface";
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";


const TableList: React.FC = () => {
  /**
   * 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);
  /**
   * 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfoAddRequest) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({...fields});
      hide();
      message.success('添加成功');
      handleUpdateModalOpen(false)
      return false;
    } catch (error) {
      hide();
      message.error('操作异常');
      return true;
    }
  };
  /**
   * 更新节点
   * @param record
   */
  const handleUpdate = async (record: API.InterfaceInfoUpdateRequest) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    if (!record) return true;
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...record
      });
      hide();
      message.success('操作成功');
      return false;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return true;
    }
  };

  /**
   *  删除接口
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return false;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return true;
    }
  };
  /**
   * 发布接口
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reloadAndRest?.();
      return false;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return true;
    }
  };
  /**
   * 下线接口
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reloadAndRest?.();
      return false;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return true;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          title="确定要删除?"
          key="del"
          onConfirm={async () => {
            await handleRemove(record);
          }}
        >
          <a>删除</a>
        </Popconfirm>,
        record.status == 0 ?
          <Popconfirm
            title="确定要发布?"
            key="online"
            onConfirm={async () => {
              await handleOnline(record);
            }}
          >
            <a>发布</a>
          </Popconfirm> :
          <Popconfirm
            title="确定要下线?"
            key="offline"
            onConfirm={async () => {
              await handleOffline(record);
            }}
          >
            <a>下线</a>
          </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined/> 添加
          </Button>,
        ]}
        request={async (params: {
          pageSize?: number;
          current?: number;
          keyword?: string;
        }, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res = await listInterfaceInfoByPageUsingGET({...params});
          if (res.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res.data.total || 0
            }
          }
          return {
            data: [],
            success: false,
            total: 0
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Chosen{' '}
              <a style={{fontWeight: 600}}>{selectedRowsState.length}</a>{' '}
              项
              &nbsp;&nbsp;
              <span>
               Total number of service calls
                {' '}
                {/*{selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}*/}
                万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch deletion
          </Button>
          <Button type="primary">
            Batch approval
          </Button>
        </FooterToolbar>
      )}

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.InterfaceInfo>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.InterfaceInfo>[]}
          />
        )}
      </Drawer>
      <CreateModal columns={columns} onCancel={() => {
        handleModalOpen(false)
      }} onSubmit={async (values) => {
        await handleAdd(values)
      }} createModalOpen={createModalOpen}/>
    </PageContainer>
  );
};

export default TableList;
