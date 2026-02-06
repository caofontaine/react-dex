import React from 'react';
import { shallow } from 'enzyme';
import DexList from '../DexList';

it('Expect to render DexList component', () => {
  const mockDex = [
    {
      dexNum: '0004',
      name: 'Charmander',
      type1: 'Fire',
      type2: null,
      region: 'Kanto'
    }
  ];
  expect(shallow(<DexList dex={mockDex} />)).toMatchSnapshot();
});
