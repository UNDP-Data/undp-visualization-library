/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';
import Select, { createFilter } from 'react-select';
import intersection from 'lodash.intersection';
import flattenDeep from 'lodash.flattendeep';
import sortBy from 'lodash.sortby';
import {
  FilterSettingsDataType,
  SelectedFilterDataType,
  SourcesDataType,
} from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';
import { string2HTML } from '../../../Utils/string2HTML';
import { getUniqValue } from '../../../Utils/getUniqValue';

export type FilterDataType = {
  column: string;
  label?: string;
  defaultValue?: string;
  excludeValues?: string[];
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
  };
}

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
    rtl,
    language,
    mode,
    ariaLabel,
    cardTemplate,
    cardBackgroundColor,
    cardFilters,
    cardSortingOptions,
  } = props;

  const [cardData, setCardData] = useState(data);
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

  const [selectedFilters, setSelectedFilters] = useState<
    SelectedFilterDataType[]
  >(
    cardFilters?.map(d => ({
      filter: d.column,
      value: d.defaultValue
        ? typeof d.defaultValue === 'string'
          ? [d.defaultValue]
          : d.defaultValue
        : undefined,
    })) || [],
  );

  const filterConfig = {
    ignoreCase: true,
    ignoreAccents: true,
    trim: true,
  };

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
    setFilterSettings(
      cardFilters?.map(el => ({
        filter: el.column,
        label: el.label || `Filter by ${el.column}`,
        singleSelect: true,
        clearable: true,
        defaultValue: el.defaultValue,
        availableValues: getUniqValue(data, el.column)
          .filter(v =>
            el.excludeValues ? el.excludeValues.indexOf(`${v}`) === -1 : true,
          )
          .map(v => ({
            value: v,
            label: v,
          })),
      })) || [],
    );
  }, [data, cardFilters]);

  useEffect(() => {
    const filteredData = data.filter((item: any) =>
      selectedFilters.every(filter =>
        filter.value && filter.value.length > 0
          ? intersection(flattenDeep([item[filter.filter]]), filter.value)
              .length > 0
          : true,
      ),
    );
    if (sortedBy) {
      setCardData(sortBy(filteredData, sortedBy?.value, sortedBy?.type));
    } else {
      setCardData(filteredData);
    }
  }, [selectedFilters, data, sortedBy]);

  return (
    <div
      style={{
        display: 'flex',
        height: 'inherit',
        flexDirection: 'column',
        width: width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: width ? 0 : 1,
        backgroundColor: 'transparent',
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            rtl={rtl}
            language={language}
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
            mode={mode || 'light'}
          />
        ) : null}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            width: '100%',
            flexDirection: rtl ? 'row-reverse' : 'row',
          }}
        >
          {cardSortingOptions ? (
            <div
              style={{
                width: '25% - 0.75rem',
                flexGrow: 1,
                flexShrink: 0,
                minWidth: '240px',
              }}
            >
              <p
                className={
                  rtl
                    ? `undp-viz-typography-${
                        language || 'ar'
                      } undp-viz-typography`
                    : 'undp-viz-typography'
                }
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  textAlign: rtl ? 'right' : 'left',
                  color: UNDPColorModule[mode || 'light'].grays.black,
                }}
              >
                Sort by
              </p>
              <Select
                className={
                  rtl
                    ? `undp-viz-select-${language || 'ar'} undp-viz-select`
                    : 'undp-viz-select'
                }
                options={cardSortingOptions.options}
                isRtl={rtl}
                isSearchable
                filterOption={createFilter(filterConfig)}
                onChange={el => {
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
                          el => el.label === cardSortingOptions.defaultValue,
                        )
                      ]
                }
                theme={theme => {
                  return {
                    ...theme,
                    borderRadius: 0,
                    spacing: {
                      ...theme.spacing,
                      baseUnit: 4,
                      menuGutter: 2,
                      controlHeight: 48,
                    },
                    colors: {
                      ...theme.colors,
                      danger: UNDPColorModule[mode || 'light'].alerts.darkRed,
                      dangerLight:
                        UNDPColorModule[mode || 'light'].grays['gray-400'],
                      neutral10:
                        UNDPColorModule[mode || 'light'].grays['gray-400'],
                      primary50:
                        UNDPColorModule[mode || 'light'].primaryColors[
                          'blue-400'
                        ],
                      primary25:
                        UNDPColorModule[mode || 'light'].grays['gray-200'],
                      primary:
                        UNDPColorModule[mode || 'light'].primaryColors[
                          'blue-600'
                        ],
                    },
                  };
                }}
              />
            </div>
          ) : null}
          {filterSettings?.map((d, i) => (
            <div
              style={{
                width: '25% - 0.75rem',
                flexGrow: 1,
                flexShrink: 0,
                minWidth: '240px',
              }}
              key={i}
            >
              <p
                className={
                  rtl
                    ? `undp-viz-typography-${
                        language || 'ar'
                      } undp-viz-typography`
                    : 'undp-viz-typography'
                }
                style={{
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  textAlign: rtl ? 'right' : 'left',
                  color: UNDPColorModule[mode || 'light'].grays.black,
                }}
              >
                {d.label}
              </p>
              <Select
                className={
                  rtl
                    ? `undp-viz-select-${language || 'ar'} undp-viz-select`
                    : 'undp-viz-select'
                }
                options={d.availableValues}
                isClearable={d.clearable === undefined ? true : d.clearable}
                isRtl={rtl}
                isSearchable
                controlShouldRenderValue
                filterOption={createFilter(filterConfig)}
                onChange={el => {
                  const filterTemp = [...selectedFilters];
                  filterTemp[
                    filterTemp.findIndex(f => f.filter === d.filter)
                  ].value = el?.value ? [el?.value] : [];
                  setSelectedFilters(filterTemp);
                }}
                defaultValue={
                  d.defaultValue
                    ? {
                        value: d.defaultValue as string,
                        label: d.defaultValue as string,
                      }
                    : undefined
                }
                theme={theme => {
                  return {
                    ...theme,
                    borderRadius: 0,
                    spacing: {
                      ...theme.spacing,
                      baseUnit: 4,
                      menuGutter: 2,
                      controlHeight: 48,
                    },
                    colors: {
                      ...theme.colors,
                      danger: UNDPColorModule[mode || 'light'].alerts.darkRed,
                      dangerLight:
                        UNDPColorModule[mode || 'light'].grays['gray-400'],
                      neutral10:
                        UNDPColorModule[mode || 'light'].grays['gray-400'],
                      primary50:
                        UNDPColorModule[mode || 'light'].primaryColors[
                          'blue-400'
                        ],
                      primary25:
                        UNDPColorModule[mode || 'light'].grays['gray-200'],
                      primary:
                        UNDPColorModule[mode || 'light'].primaryColors[
                          'blue-600'
                        ],
                    },
                  };
                }}
              />
            </div>
          ))}
        </div>
        <div
          className='undp-viz-scrollbar undp-viz-data-cards-container'
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : 'auto',
          }}
        >
          {cardData?.map((d: any, i: number) => (
            <div
              key={i}
              style={{
                backgroundColor:
                  cardBackgroundColor ||
                  UNDPColorModule[mode || 'light'].grays['gray-200'],
                cursor: onSeriesMouseClick ? 'pointer' : 'auto',
              }}
              className='undp-viz-data-cards'
              onClick={() => {
                if (onSeriesMouseClick) onSeriesMouseClick(d);
              }}
            >
              <div
                style={{ margin: 0 }}
                dangerouslySetInnerHTML={{
                  __html: string2HTML(cardTemplate, d),
                }}
              />
            </div>
          ))}
        </div>
        {sources || footNote ? (
          <GraphFooter
            rtl={rtl}
            language={language}
            sources={sources}
            footNote={footNote}
            width={width}
            mode={mode || 'light'}
          />
        ) : null}
      </div>
    </div>
  );
}