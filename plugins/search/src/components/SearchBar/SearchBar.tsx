/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ChangeEvent, useEffect, KeyboardEvent, useState } from 'react';
import { useDebounce } from 'react-use';
import { InputBase, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearButton from '@material-ui/icons/Clear';

import { useSearch } from '../SearchContext';

type PresenterProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
};

export const SearchBarPresenter = ({
  value,
  onChange,
  onKeyDown,
  handleClear,
  className,
  placeholder,
}: PresenterProps) => {
  const endAdornment = (
    <InputAdornment position="end">
      <IconButton aria-label="Clear term" onClick={handleClear}>
        <ClearButton />
      </IconButton>
    </InputAdornment>
  );

  return (
    <InputBase
      data-testid="search-bar-next"
      fullWidth
      placeholder={placeholder ?? 'Search in Backstage'}
      value={value}
      onChange={onChange}
      inputProps={{ 'aria-label': 'Search term' }}
      startAdornment={
        <InputAdornment position="start">
          <IconButton aria-label="Query term" disabled>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
      {...(handleClear ? { endAdornment } : {})}
      {...(className ? { className } : {})}
      {...(onKeyDown ? { onKeyDown } : {})}
    />
  );
};

type Props = {
  className?: string;
  debounceTime?: number;
};

export const SearchBar = ({ className, debounceTime = 0 }: Props) => {
  const { term, setTerm } = useSearch();
  const [value, setValue] = useState<string>(term);

  useEffect(() => {
    setValue(prevValue => (prevValue !== term ? term : prevValue));
  }, [term]);

  useDebounce(() => setTerm(value), debounceTime, [value]);

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => setValue('');

  return (
    <SearchBarPresenter
      className={className}
      value={value}
      onChange={handleQuery}
      handleClear={handleClear}
    />
  );
};
