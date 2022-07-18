import React, { useState, useMemo } from 'react'
import { Input, InputGroup, SearchIcon } from '@goosebumps/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`

const InputWrapper = styled.div`
  position: relative;
  border: 2px solid #c4c4c4;
  background-color: #171717;
  border-radius: 9px;
  color: #fff;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({ onChange: onChangeCallback, placeholder = 'Search' }) => {
  const [searchText, setSearchText] = useState('')

  const { t } = useTranslation()

  const debouncedOnChange = useMemo(
    () => debounce((e: React.ChangeEvent<HTMLInputElement>) => onChangeCallback(e), 500),
    [onChangeCallback],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedOnChange(e)
  }

  return (
    <InputWrapper>
      <InputGroup endIcon={<SearchIcon width="24px" />}>
        <StyledInput value={searchText} onChange={onChange} placeholder={t(placeholder)} />
      </InputGroup>
    </InputWrapper>
  )
}

export default SearchInput
