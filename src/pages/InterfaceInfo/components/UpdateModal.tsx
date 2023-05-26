import {ActionType, ProColumns, ProFormInstance, ProTable,} from '@ant-design/pro-components';
import {Modal} from 'antd';
import React, {useEffect, useRef} from 'react';


export type UpdateFormProps = {
  columns: ProColumns<API.RuleListItem>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfoUpdateRequest) => Promise<void>;
  updateModalOpen: boolean;
  values: API.InterfaceInfoUpdateRequest;
};

const UpdateModal: React.FC<UpdateFormProps> = (props) => {
  const {values, updateModalOpen, columns, onCancel, onSubmit} = props
  const fromRef = useRef<ProFormInstance>();
  useEffect(() => {
    fromRef.current?.setFieldsValue(values);
  })
  return (
    <Modal footer={null} open={updateModalOpen} onCancel={() => onCancel?.()}>
      <ProTable type={"form"} columns={columns} formRef={fromRef} onSubmit={async (value) => {
        await onSubmit?.(value);
      }}
      />
    </Modal>
  );
};

export default UpdateModal;
