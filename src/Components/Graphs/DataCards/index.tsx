/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
import { useCallback, useEffect, useMemo, useState } from 'react';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import sortBy from 'lodash.sortby';
import {
  createFilter,
  DropdownSelect,
  Modal,
  P,
  Pagination,
  Search,
} from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
  FilterSettingsDataType,
  SourcesDataType,
} from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { string2HTML } from '../../../Utils/string2HTML';
import { getUniqValue } from '../../../Utils/getUniqValue';
import { transformDefaultValue } from '../../../Utils/transformDataForSelect';
import { CsvDownloadButton } from '../../Actions/CsvDownloadButton';
import { FileDown } from '../../Icons/Icons';

export type FilterDataType = {
  column: string;
  label?: string;
  defaultValue?: string;
  excludeValues?: string[];
  width?: string;
};

const csvData = (data: any) => {
  if (!data) return {};
  const dataForCsv = Object.entries(data).map(([key, value]) => {
    if (Array.isArray(value)) {
      return {
        ' ': key,
        value: `"${value.join('; ')}"`,
      };
    }
    return {
      ' ': key,
      value: `"${value}"`,
    };
  });
  return dataForCsv;
};

interface Props {
  graphTitle?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  graphID?: string;
  width?: number;
  height?: number;
  onSeriesMouseClick?: (_d: any) => void;
  data: any;
  language?: 'ar' | 'he' | 'en';
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  cardTemplate: string;
  cardBackgroundColor?: string;
  cardFilters?: FilterDataType[];
  cardSortingOptions?: {
    defaultValue?: string;
    options: {
      value: string;
      label: string;
      type: 'asc' | 'desc';
    }[];
    width?: string;
  };
  cardSearchColumns?: string[];
  cardMinWidth?: number;
  backgroundStyle?: BackgroundStyleDataType;
  backgroundColor?: string | boolean;
  padding?: string;
  cardBackgroundStyle?: BackgroundStyleDataType;
  detailsOnClick?: string;
  allowDataDownloadOnDetail?: string | boolean;
  noOfItemsInAPage?: number;
}

const filterByKeys = (jsonArray: any, keys: string[], substring: string) => {
  if (keys.length === 0) return jsonArray;
  return jsonArray.filter((item: any) =>
    keys.some(key =>
      item[key]?.toLowerCase().includes(substring.toLowerCase()),
    ),
  );
};

export function DataCards(props: Props) {
  const {
    width,
    height,
    graphTitle,
    sources,
    graphDescription,
    footNote,
    graphID,
    data,
    onSeriesMouseClick,
    language = 'en',
    mode = 'light',
    ariaLabel,
    cardTemplate,
    cardBackgroundColor,
    cardFilters = [],
    cardSortingOptions,
    cardSearchColumns = [],
    cardMinWidth = 320,
    backgroundStyle = {},
    backgroundColor = false,
    padding,
    cardBackgroundStyle = {},
    detailsOnClick,
    allowDataDownloadOnDetail = false,
    noOfItemsInAPage,
  } = props;

  const [cardData, setCardData] = useState(data);

  const [page, setPage] = useState(1);
  const [selectedData, setSelectedData] = useState<any>(undefined);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSettings, setFilterSettings] = useState<
    FilterSettingsDataType[]
  >([]);
  const [sortedBy, setSortedBy] = useState<
    | {
        value: string;
        label: string;
        type: 'asc' | 'desc';
      }
    | undefined
  >(
    cardSortingOptions
      ? !cardSortingOptions.defaultValue ||
        cardSortingOptions.options.findIndex(
          el => el.label === cardSortingOptions.defaultValue,
        ) === -1
        ? cardSortingOptions.options[0]
        : cardSortingOptions.options[
            cardSortingOptions.options.findIndex(
              el => el.label === cardSortingOptions.defaultValue,
            )
          ]
      : undefined,
  );

  const filterConfig = useMemo(
    () => ({
      ignoreCase: true,
      ignoreAccents: true,
      trim: true,
    }),
    [],
  );

  useEffect(() => {
    setSortedBy(
      cardSortingOptions
        ? !cardSortingOptions.defaultValue ||
          cardSortingOptions.options.findIndex(
            el => el.label === cardSortingOptions.defaultValue,
          ) === -1
          ? cardSortingOptions.options[0]
          : cardSortingOptions.options[
              cardSortingOptions.options.findIndex(
                el => el.label === cardSortingOptions.defaultValue,
              )
            ]
        : undefined,
    );
  }, [cardSortingOptions]);
  useEffect(() => {
    const newFilterSettings = cardFilters.map(el => ({
      filter: el.column,
      label: el.label || `Filter by ${el.column}`,
      singleSelect: true,
      clearable: true,
      defaultValue: transformDefaultValue(el.defaultValue),
      availableValues: getUniqValue(data, el.column)
        .filter(v => !el.excludeValues?.includes(`${v}`))
        .map(v => ({ value: v, label: v })),
      width: el.width,
    }));
    setFilterSettings(newFilterSettings);
  }, [data, cardFilters]);

  const handleFilterChange = useCallback((filter: string, values: any) => {
    setFilterSettings(prev =>
      prev.map(f => (f.filter === filter ? { ...f, value: values } : f)),
    );
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item: any) =>
      filterSettings.every(filter =>
        filter.value && flattenDeep([filter.value]).length > 0
          ? intersection(
              flattenDeep([item[filter.filter]]),
              flattenDeep([filter.value]).map(el => el.value),
            ).length > 0
          : true,
      ),
    );
    if (sortedBy) {
      setCardData(sortBy(filteredData, sortedBy?.value, sortedBy?.type));
    } else {
      setCardData(filteredData);
    }
  }, [filterSettings, data, sortedBy]);

  useEffect(() => {
    setPage(1);
  }, [cardData, cardSearchColumns, searchQuery]);

  return (
    <div
      className={`${
        !backgroundColor
          ? 'bg-transparent '
          : backgroundColor === true
          ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
          : ''
      }ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
      style={{
        ...backgroundStyle,
        ...(backgroundColor && backgroundColor !== true
          ? { backgroundColor }
          : {}),
      }}
      id={graphID}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is an list of cards. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        className='flex grow'
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
        }}
      >
        <div className='flex flex-col grow gap-3 w-full justify-between'>
          {graphTitle || graphDescription ? (
            <GraphHeader
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
            />
          ) : null}
          {cardSortingOptions || filterSettings.length > 0 ? (
            <div className='flex gap-4 flex-wrap items-start w-full'>
              {cardSortingOptions ? (
                <div
                  className='grow shrink-0 min-w-[240px]'
                  style={{
                    width: cardSortingOptions.width || 'calc(25% - 0.75rem)',
                  }}
                >
                  <P
                    marginBottom='xs'
                    size='sm'
                    className='text-primary-gray-700 dark:text-primary-gray-100'
                  >
                    Sort by
                  </P>
                  <DropdownSelect
                    options={cardSortingOptions.options}
                    isRtl={language === 'he' || language === 'ar'}
                    isSearchable
                    filterOption={createFilter(filterConfig)}
                    onChange={(el: any) => {
                      setSortedBy(el || undefined);
                    }}
                    defaultValue={
                      !cardSortingOptions.defaultValue ||
                      cardSortingOptions.options.findIndex(
                        el => el.label === cardSortingOptions.defaultValue,
                      ) === -1
                        ? cardSortingOptions.options[0]
                        : cardSortingOptions.options[
                            cardSortingOptions.options.findIndex(
                              el =>
                                el.label === cardSortingOptions.defaultValue,
                            )
                          ]
                    }
                  />
                </div>
              ) : null}
              {filterSettings?.map((d, i) => (
                <div
                  className='grow shrink-0 min-w-[240px]'
                  style={{
                    width: d.width || 'calc(25% - 0.75rem)',
                  }}
                  key={i}
                >
                  <P
                    marginBottom='xs'
                    size='sm'
                    className='text-primary-gray-700 dark:text-primary-gray-100'
                  >
                    {d.label}
                  </P>
                  <DropdownSelect
                    options={d.availableValues}
                    isClearable={d.clearable === undefined ? true : d.clearable}
                    isRtl={language === 'he' || language === 'ar'}
                    isSearchable
                    controlShouldRenderValue
                    filterOption={createFilter(filterConfig)}
                    onChange={(el: any) => {
                      handleFilterChange(d.filter, el);
                    }}
                    defaultValue={d.defaultValue}
                  />
                </div>
              ))}
            </div>
          ) : null}
          {cardSearchColumns.length > 0 ? (
            <div className='w-full flex'>
              <div className='flex grow relative'>
                <span
                  className='absolute'
                  style={{
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-45%)',
                  }}
                >
                  <img
                    alt='search-icon'
                    src='https://design.undp.org/icons/search.svg'
                    width={24}
                    height={24}
                  />
                </span>
                <Search
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>
            </div>
          ) : null}
          <div
            className='undp-viz-scrollbar w-full my-0 mx-auto grid gap-4 undp-viz-data-cards-container'
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : 'auto',
              gridTemplateColumns: `repeat(auto-fit, minmax(${cardMinWidth}px, 1fr))`,
            }}
          >
            {filterByKeys(cardData, cardSearchColumns, searchQuery)
              .filter((_d: any, i: number) =>
                noOfItemsInAPage
                  ? i < page * noOfItemsInAPage &&
                    i >= (page - 1) * noOfItemsInAPage
                  : true,
              )
              .map((d: any, i: number) => (
                <div
                  key={i}
                  style={{
                    ...cardBackgroundStyle,
                    ...(cardBackgroundColor && {
                      backgroundColor: cardBackgroundColor,
                    }),
                  }}
                  className={`w-full flex flex-col ${
                    onSeriesMouseClick || detailsOnClick
                      ? 'cursor-pointer'
                      : 'cursor-auto'
                  }${
                    !cardBackgroundColor
                      ? 'bg-primary-gray-200 dark:bg-primary-gray-600'
                      : ''
                  }`}
                  onClick={() => {
                    if (onSeriesMouseClick) onSeriesMouseClick(d);
                    if (detailsOnClick) setSelectedData(d);
                  }}
                  dangerouslySetInnerHTML={{
                    __html: string2HTML(cardTemplate, d),
                  }}
                />
              ))}
          </div>
          {noOfItemsInAPage ? (
            <Pagination
              total={
                filterByKeys(cardData, cardSearchColumns, searchQuery).length
              }
              defaultPage={0}
              pageSize={noOfItemsInAPage}
              onChange={setPage}
            />
          ) : null}

          {sources || footNote ? (
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
      </div>
      <Modal
        open={selectedData !== undefined}
        onClose={() => {
          setSelectedData(undefined);
        }}
      >
        {detailsOnClick ? (
          <>
            <div
              className='m-0'
              dangerouslySetInnerHTML={{
                __html: string2HTML(detailsOnClick, selectedData),
              }}
            />
            {allowDataDownloadOnDetail ? (
              <div className='flex'>
                <CsvDownloadButton
                  csvData={csvData(selectedData)}
                  headers={[
                    {
                      label: ' ',
                      key: ' ',
                    },
                    {
                      label: 'value',
                      key: 'value',
                    },
                  ]}
                  buttonContent={
                    <div className='flex items-center gap-4'>
                      {typeof allowDataDownloadOnDetail === 'string'
                        ? allowDataDownloadOnDetail
                        : null}
                      <FileDown />
                    </div>
                  }
                />
              </div>
            ) : null}
          </>
        ) : null}
      </Modal>
    </div>
  );
}
