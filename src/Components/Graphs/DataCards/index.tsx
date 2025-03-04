/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import sortBy from 'lodash.sortby';
import { P } from '@undp-data/undp-design-system-react';
import {
  BackgroundStyleDataType,
  FilterSettingsDataType,
  SourcesDataType,
} from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';
import { string2HTML } from '../../../Utils/string2HTML';
import { getUniqValue } from '../../../Utils/getUniqValue';
import { getReactSelectTheme } from '../../../Utils/getReactSelectTheme';
import { Modal } from '../../Elements/Modal';
import { transformDefaultValue } from '../../../Utils/transformDataForSelect';
import { CsvDownloadButton } from '../../Actions/CsvDownloadButton';
import { FileDown } from '../../Icons/Icons';
import { Pagination } from '../../Elements/Pagination';

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
  rtl?: boolean;
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
    rtl = false,
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
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'}`}
      style={{
        ...backgroundStyle,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
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
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
            />
          ) : null}
          {cardSortingOptions || filterSettings.length > 0 ? (
            <div
              className={`flex gap-4 flex-wrap items-start w-full ${
                rtl ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {cardSortingOptions ? (
                <div
                  className='grow shrink-0 min-w-[240px]'
                  style={{
                    width: cardSortingOptions.width || 'calc(25% - 0.75rem)',
                  }}
                >
                  <P
                    className={`text-sm md:text-sm mb-2 md:mb-2 ${
                      rtl
                        ? `font-sans-${language || 'ar'} text-right`
                        : 'font-sans text-left'
                    }`}
                    style={{
                      color: UNDPColorModule[mode].grays.black,
                    }}
                  >
                    Sort by
                  </P>
                  <Select
                    className={
                      rtl
                        ? `undp-viz-select-${language} undp-viz-select`
                        : 'undp-viz-select'
                    }
                    options={cardSortingOptions.options}
                    isRtl={rtl}
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
                    theme={(theme: any) => getReactSelectTheme(theme, mode)}
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
                    className={`text-sm md:text-sm mb-2 md:mb-2 ${
                      rtl
                        ? `font-sans-${language || 'ar'} text-right`
                        : 'font-sans text-left'
                    }`}
                    style={{
                      color: UNDPColorModule[mode].grays.black,
                    }}
                  >
                    {d.label}
                  </P>
                  <Select
                    className={
                      rtl
                        ? `undp-viz-select-${language} undp-viz-select`
                        : 'undp-viz-select'
                    }
                    options={d.availableValues}
                    isClearable={d.clearable === undefined ? true : d.clearable}
                    isRtl={rtl}
                    isSearchable
                    controlShouldRenderValue
                    filterOption={createFilter(filterConfig)}
                    onChange={(el: any) => {
                      handleFilterChange(d.filter, el);
                    }}
                    defaultValue={d.defaultValue}
                    theme={(theme: any) => getReactSelectTheme(theme, mode)}
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
                <input
                  className='undp-viz-text-box'
                  type='text'
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                  }}
                  style={{
                    border: `2px solid ${UNDPColorModule[mode].grays.black}`,
                    borderRadius: 0,
                    padding: '10px 10px 10px 36px',
                    height: '22px',
                    flexGrow: 1,
                    backgroundColor: UNDPColorModule[mode].grays.white,
                    color: UNDPColorModule[mode].grays.black,
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
                    backgroundColor:
                      cardBackgroundColor ||
                      UNDPColorModule[mode].grays['gray-200'],
                  }}
                  className={`w-full flex flex-col ${
                    onSeriesMouseClick || detailsOnClick
                      ? 'cursor-pointer'
                      : 'cursor-auto'
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
              pageNo={page}
              pageSize={noOfItemsInAPage}
              onChange={setPage}
            />
          ) : null}

          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
            />
          ) : null}
        </div>
      </div>
      <Modal
        isOpen={selectedData !== undefined}
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
