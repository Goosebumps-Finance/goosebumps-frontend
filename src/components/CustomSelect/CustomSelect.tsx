import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ArrowDropDownIcon, Box, BoxProps, Text } from '@goosebumps/uikit'
import { useLocation } from 'react-router-dom'
import { OptionProps } from 'config/constants/types'

const DropDownHeader = styled.div<{ isHome: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
  // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  // border: 1px solid #52555c;
  border-radius: 9px;
  // background: ${({ theme }) => theme.colors.input};
  // background: transparent;
  background: #182132aa;
  ${({ isHome }) =>
    isHome &&
    `
      background: #0a3040aa;
    `
  }
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div<{ isHome: boolean }>`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  // background: ${({ theme }) => theme.colors.input};
  // background: transparent;
  background: #182132aa;
  ${({ isHome }) =>
    isHome &&
    `
      background: #0a3040aa;
    `
  }
  z-index: ${({ theme }) => theme.zIndices.dropdown};
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 145px;
  }
`

const DropDownContainer = styled(Box) <{ isOpen: boolean, isHome: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  // background: ${({ theme }) => theme.colors.input};
  // background: transparent;
  background: #182132aa;
  ${({ isHome }) =>
    isHome &&
    `
      background: #0a3040aa;
    `
  }
  border-radius: 9px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  margin: 4px 0px;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 145px;
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${DropDownHeader} {
        // border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        border-bottom: 1px solid #52555c;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
        border-radius: 9px 9px 0 0;
        // border-radius: ${props.style?.borderTopLeftRadius}px ${props.style?.borderTopRightRadius}px 0px 0px;
        background-color: ${props.style?.backgroundColor};
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        // border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
        // border: 1px solid #52555c;
        border-top-width: 0;
        border-radius: 0 0 9px 9px;
        box-shadow: ${({ theme }) => theme.tooltip.boxShadow};
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.zIndices.dropdown};
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

export interface SelectProps extends BoxProps {
  options: OptionProps[]
  onOptionChange?: (newOption: OptionProps, nowOption: OptionProps) => void
  defaultOptionIndex?: number
  header?: any
  listContainer?: any
  selIndex?: number
  length?: number
  startIndex?: number
}

const CustomSelect: React.FunctionComponent<SelectProps> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  selIndex,
  length,
  startIndex,
  ...props
}) => {
  const dropdownRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(defaultOptionIndex)

  const location = useLocation()
  const isHome = location.pathname === "/";

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)

    if (onOptionChange) {
      onOptionChange(options[selectedIndex], options[selectedOptionIndex])
    }
  }

  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false)
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selIndex >= startIndex && selIndex < length)
      setSelectedOptionIndex(selIndex)
  }, [selIndex])

  // useEffect(() => {
  //   console.log("CustomSelect: selectedOptionIndex, selIndex", selectedOptionIndex, selIndex)
  //   if (selectedOptionIndex !== selIndex)
  //     setSelectedOptionIndex(selIndex)
  // }, [selectedOptionIndex])

  return (
    <DropDownContainer isOpen={isOpen} isHome={isHome} {...props} >
      <DropDownHeader onClick={toggling} style={props.header} isHome={isHome}>
        <Text>{options[selectedOptionIndex].label}</Text>
      </DropDownHeader>
      <ArrowDropDownIcon color="text" onClick={toggling} />
      <DropDownListContainer style={props.listContainer} isHome={isHome}>
        <DropDownList ref={dropdownRef}>
          {options.map((option, index) =>
            index !== selectedOptionIndex ? (
              <ListItem onClick={onOptionClicked(index)} key={option.label}>
                <Text>{option.label}</Text>
              </ListItem>
            ) : null,
          )}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default CustomSelect
