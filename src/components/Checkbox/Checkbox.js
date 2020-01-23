import React, { useState } from 'react';
import propTypes from 'prop-types';

import styled, { css } from 'styled-components';
import { createDisabledTextStyles, createFlatBoxStyles } from '../common';

import { padding, fontSizes } from '../common/system';
import Cutout from '../Cutout/Cutout';

const checkboxSize = '20px';
const StyledLabel = styled.label`
  display: inline-block;
  position: relative;
  padding-left: calc(${checkboxSize} + ${padding.sm});
  margin: ${padding.sm} 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  font-size: ${fontSizes.md};
  ${props => props.isDisabled && createDisabledTextStyles()}
`;

const StyledInput = styled.input`
  position: absolute;
  opacity: 0;
  z-index: -99;
`;

const createCheckmarkSymbol = () =>
  css`
    &:after {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      top: calc(50% - 1px);
      width: 3px;
      height: 7px;

      border: solid ${({ theme }) => theme.checkmark};
      border-width: 0 3px 3px 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
  `;
const createIndeterminateSymbol = () => css`
  &:after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    background-color: #fff;
    background-image: linear-gradient(
        45deg,
        #000 25%,
        transparent 25%,
        transparent 75%,
        #000 75%
      ),
      linear-gradient(
        45deg,
        #000 25%,
        transparent 25%,
        transparent 75%,
        #000 75%
      );
    background-size: 4px 4px;
    background-position: 0 0, 2px 2px;
  }
`;
const sharedCheckmarkStyles = css`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: ${checkboxSize};
  height: ${checkboxSize};
  ${({ checked, indeterminate }) =>
    indeterminate
      ? createIndeterminateSymbol()
      : checked && createCheckmarkSymbol(checked)}
`;
const StyledCheckbox = styled(Cutout)`
  ${sharedCheckmarkStyles}
  background: ${({ theme, isDisabled }) =>
    isDisabled ? theme.material : theme.canvas};
  box-shadow: ${({ shadow }) =>
    shadow ? 'inset 3px 3px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  &:before {
    box-shadow: none;
  }
`;
const StyledFlatCheckbox = styled.div`
  ${createFlatBoxStyles()}
  ${sharedCheckmarkStyles}
  background: ${({ theme, isDisabled }) =>
    isDisabled ? theme.flatLight : theme.canvas};

`;
const Checkbox = ({
  onChange,
  label,
  disabled,
  variant,
  value,
  checked,
  defaultChecked,
  indeterminate,
  name,
  className,
  style,
  shadow,
  ...otherProps
}) => {
  const Checkmark = variant === 'flat' ? StyledFlatCheckbox : StyledCheckbox;

  let Input;

  if (defaultChecked || checked === undefined) {
    const [state, setState] = useState(defaultChecked || false);

    const handleChange = e => {
      const newState = e.target.checked;
      setState(newState);
      if (onChange) onChange(e);
    };

    Input = (
      <>
        <StyledInput
          onChange={disabled ? undefined : handleChange}
          readOnly={disabled}
          type='checkbox'
          value={value}
          checked={state}
          name={name}
          data-indeterminate={indeterminate}
          {...otherProps}
        />
        <Checkmark
          checked={state}
          indeterminate={indeterminate}
          isDisabled={disabled}
          shadow={shadow}
        />
      </>
    );
  } else {
    Input = (
      <>
        <StyledInput
          onChange={disabled ? undefined : onChange}
          readOnly={disabled}
          type='checkbox'
          value={value}
          checked={checked}
          name={name}
          data-indeterminate={indeterminate}
          {...otherProps}
        />
        <Checkmark
          checked={checked}
          indeterminate={indeterminate}
          isDisabled={disabled}
          shadow={shadow}
        />
      </>
    );
  }
  return (
    <StyledLabel isDisabled={disabled} className={className} style={style}>
      {label}
      {Input}
    </StyledLabel>
  );
};

Checkbox.defaultProps = {
  label: '',
  disabled: false,
  variant: 'default',
  shadow: true,
  onChange: () => {},
  checked: false,
  style: {},
  defaultChecked: false,
  className: '',
  indeterminate: false,
  value: undefined
};

Checkbox.propTypes = {
  onChange: propTypes.func,
  name: propTypes.string.isRequired,
  value: propTypes.oneOfType([
    propTypes.string,
    propTypes.number,
    propTypes.bool
  ]),
  label: propTypes.oneOfType([propTypes.string, propTypes.number]),
  checked: propTypes.bool,
  disabled: propTypes.bool,
  variant: propTypes.oneOf(['default', 'flat']),
  shadow: propTypes.bool,
  style: propTypes.shape([propTypes.string, propTypes.number]),
  defaultChecked: propTypes.bool,
  indeterminate: propTypes.bool,
  className: propTypes.string
};

export default Checkbox;
