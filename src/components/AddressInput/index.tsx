import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 12px;
  width: 100%;
`;

const Input = styled.input`
  width: 80%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #0071e3;
  }
`;

interface AddressInputProps {
  placeholder?: string;
  onAddressChange?: (address: string) => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ placeholder = 'Enter your address...', onAddressChange }) => {
  const [address, setAddress] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    onAddressChange?.(e.target.value);
  };

  return (
    <InputContainer>
      <Input
        type="text"
        placeholder={placeholder}
        value={address}
        onChange={handleChange}
      />
    </InputContainer>
  );
};

export default AddressInput;
