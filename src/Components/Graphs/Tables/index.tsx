import { Table } from 'antd';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';

interface Props {
  data: any;
  columns: any;
  graphTitle?: string;
  source?: string;
  graphDescription?: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  tableHeight?: number;
  graphID?: string;
}

export function TablesViz(props: Props) {
  const {
    sourceLink,
    graphTitle,
    source,
    graphDescription,
    footNote,
    padding,
    backgroundColor,
    data,
    tableHeight,
    columns,
    graphID,
  } = props;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        margin: 'auto',
        flexGrow: 1,
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-00)',
          width: '100%',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
          />
        ) : null}
        <Table
          className='undp-data-table'
          columns={columns}
          dataSource={data}
          bordered
          size='small'
          pagination={false}
          scroll={{ y: tableHeight }}
          rowHoverable={false}
        />
        {source || footNote ? (
          <div className='margin-top-05'>
            <GraphFooter
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
