import {ProColumns, ProTable,} from '@ant-design/pro-components';
import {Modal} from 'antd';
import React from 'react';


export type Props = {
  columns: ProColumns<API.RuleListItem>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfoAddRequest) => Promise<void>;
  createModalOpen: boolean;
};

const CreateForm: React.FC<Props> = (props) => {
  const {createModalOpen, columns, onCancel, onSubmit} = props
  return (
    <Modal open={createModalOpen} onCancel={() => onCancel?.()}>
      <ProTable type={"form"} columns={columns} onSubmit={async (value) => {
        await onSubmit?.(value);
      }
      }
      />
    </Modal>
  );
};

export default CreateForm;
